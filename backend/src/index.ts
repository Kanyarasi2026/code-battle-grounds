import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Server } from 'socket.io';
import type {
  AppSocket,
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types/index.js';
import { verifyAuth } from './middleware/auth.js';
import { handleSocketError } from './middleware/errorHandler.js';
import { schemas, validate } from './middleware/validation.js';
import { logger } from './utils/logger.js';
import { roomManager } from './utils/roomManager.js';

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env['CORS_ORIGINS']
  ? process.env['CORS_ORIGINS'].split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  maxHttpBufferSize: 1e6,
  pingTimeout: 60000,
});

const rateLimiters = {
  join: new RateLimiterMemory({ points: 10, duration: 60 }),
  codeChange: new RateLimiterMemory({ points: 1000, duration: 60 }),
  languageChange: new RateLimiterMemory({ points: 20, duration: 60 }),
  inputChange: new RateLimiterMemory({ points: 1000, duration: 60 }),
  executeCode: new RateLimiterMemory({ points: 10, duration: 60 }),
};

const getClientIdentifier = (socket: AppSocket): string => {
  return (
    (socket.handshake.headers['x-forwarded-for'] as string | undefined)
      ?.split(',')[0]
      ?.trim() ??
    socket.handshake.address ??
    socket.id
  );
};

app.get('/room/:roomId/exists', (req, res) => {
  const { roomId } = req.params;
  const exists = roomManager.roomExists(roomId as string);
  res.json({ exists });
});

// ── Code execution proxy (Judge0 CE) ──
const executeRateLimiter = new RateLimiterMemory({ points: 10, duration: 60 });

const JUDGE0_URL = process.env['JUDGE0_URL'] ?? 'https://ce.judge0.com';

const JUDGE0_LANG_IDS: Record<string, number> = {
  cpp: 54,
  c: 50,
  javascript: 93,
  java: 91,
  python: 100,
};

app.post('/execute', async (req, res) => {
  try {
    const clientIp =
      (req.headers['x-forwarded-for'] as string | undefined)
        ?.split(',')[0]
        ?.trim() ?? req.socket.remoteAddress ?? 'unknown';
    await executeRateLimiter.consume(clientIp);

    const { language, files, stdin } = req.body as {
      language: string;
      files: Array<{ content: string }>;
      stdin?: string;
    };

    if (!language || !Array.isArray(files) || files.length === 0) {
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    const languageId = JUDGE0_LANG_IDS[language];
    if (!languageId) {
      res.status(400).json({ error: `Unsupported language: ${language}` });
      return;
    }

    const sourceCode = files[0]?.content ?? '';

    logger.info(
      `[Execute] Sending to Judge0: langId=${languageId}, codeLength=${sourceCode.length}`,
    );

    const judge0Res = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language_id: languageId,
          source_code: sourceCode,
          stdin: stdin ?? '',
        }),
        signal: AbortSignal.timeout(30000),
      },
    );

    if (!judge0Res.ok) {
      const errText = await judge0Res.text().catch(() => 'Unknown error');
      logger.error(`[Execute] Judge0 returned ${judge0Res.status}: ${errText}`);
      res
        .status(judge0Res.status === 429 ? 429 : 502)
        .json({ error: 'Code execution service error', detail: errText });
      return;
    }

    const data = await judge0Res.json() as {
      stdout?: string;
      stderr?: string;
      compile_output?: string;
      status?: { description: string; id: number };
    };

    const stdout = data.stdout ?? '';
    const stderr = data.stderr ?? '';
    const compileOut = data.compile_output ?? '';
    const statusDesc = data.status?.description ?? '';
    const exitCode =
      statusDesc === 'Accepted' ? 0 : (data.status?.id ?? 0) >= 6 ? 1 : 0;

    const fullStderr = [compileOut, stderr].filter(Boolean).join('\n').trim();
    const output =
      stdout || fullStderr || (statusDesc !== 'Accepted' ? statusDesc : '');

    const pistonCompatible = {
      run: {
        stdout,
        stderr: fullStderr,
        code: exitCode,
        output: output || 'No output',
      },
    };

    logger.info(
      `[Execute] Done: status=${statusDesc}, outputLen=${output.length}`,
    );
    res.json(pistonCompatible);
  } catch (error) {
    const err = error as Error & { name?: string };
    if (err.message?.includes('rate')) {
      res.status(429).json({ error: 'Rate limit exceeded' });
      return;
    }
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      logger.error('[Execute] Judge0 request timed out');
      res.status(504).json({ error: 'Code execution timed out (30s limit)' });
      return;
    }
    logger.error('[Execute] Error:', error);
    res.status(500).json({ error: 'Code execution failed' });
  }
});

app.get('/health', (_req, res) => {
  const stats = roomManager.getStats();
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    rooms: stats.totalRooms,
    clients: stats.totalClients,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
  });
});

app.get('/metrics', (_req, res) => {
  const stats = roomManager.getStats();
  res.set('Content-Type', 'text/plain');
  res.send(
    `
# HELP codesketch_rooms_total Total number of active rooms
# TYPE codesketch_rooms_total gauge
codesketch_rooms_total ${stats.totalRooms}

# HELP codesketch_clients_total Total number of connected clients
# TYPE codesketch_clients_total gauge
codesketch_clients_total ${stats.totalClients}

# HELP codesketch_uptime_seconds Server uptime in seconds
# TYPE codesketch_uptime_seconds counter
codesketch_uptime_seconds ${Math.floor(process.uptime())}
  `.trim(),
  );
});

io.use(verifyAuth);

io.on('connection', (socket) => {
  logger.info(`[Socket] Client connected: ${socket.id}`);

  let currentRoom: string | null = null;
  let currentUser: string | null = null;

  socket.on('join', async (data) => {
    try {
      logger.info(`[Join] Received join request from ${socket.id}:`, data);

      await rateLimiters.join.consume(getClientIdentifier(socket));

      const { roomId, username } = validate(schemas.join, data);
      const sanitizedUsername = username.trim();

      // ── Policy: one room per user (active-session lock) ──
      const userEmail = socket.data.user?.email ?? null;
      if (userEmail) {
        const existingRoomId = roomManager.getUserCurrentRoom(userEmail);
        if (existingRoomId) {
          const isSameRoom = existingRoomId === roomId;
          logger.warn(
            `[Join] User ${userEmail} already in room ${existingRoomId}, rejecting join to ${roomId} (isSameRoom=${isSameRoom})`,
          );
          socket.emit('alreadyInRoom', { currentRoomId: existingRoomId, isSameRoom });
          setTimeout(() => socket.disconnect(true), 150); // give event time to deliver
          return;
        }
      }

      if (currentRoom) {
        logger.info(
          `[Join] User ${socket.id} leaving previous room ${currentRoom}`,
        );
        socket.leave(currentRoom);
        const result = roomManager.removeClient(currentRoom, socket.id);
        if (result) {
          io.to(currentRoom).emit('userLeft', {
            socketId: socket.id,
            username: currentUser,
          });
        }
      }

      currentRoom = roomId;
      currentUser = sanitizedUsername;

      logger.info(
        `[Join] User ${sanitizedUsername} (${socket.id}) joining room ${roomId}`,
      );
      socket.join(roomId);

      const room = roomManager.addClient(
        roomId,
        socket.id,
        sanitizedUsername,
        socket.data.user?.id ?? null,
        socket.data.user?.email ?? null,
      );
      logger.info(`[Join] Room ${roomId} now has ${room.clients.size} clients`);

      const clients = roomManager.getClients(roomId);

      io.to(roomId).emit('userJoined', {
        clients,
        username: sanitizedUsername,
        socketId: socket.id,
      });

      const syncData = {
        code: room.code || '',
        language: room.language || 'cpp',
        stdin: room.stdin || '',
        output: room.output || '',
        isError: room.isError || false,
      };

      logger.info(`[Join] Syncing complete state to ${sanitizedUsername}:`, {
        codeLength: syncData.code.length,
        language: syncData.language,
        stdinLength: syncData.stdin.length,
        outputLength: syncData.output.length,
        isError: syncData.isError,
      });

      socket.emit('syncCode', syncData);

      logger.info(
        `[Join] Successfully synced state to ${sanitizedUsername} in room ${roomId}`,
      );
    } catch (error) {
      logger.error(`[Join] Error:`, error);
      handleSocketError(socket, error as Error, 'join');
    }
  });

  socket.on('codeChange', async (data) => {
    try {
      await rateLimiters.codeChange.consume(getClientIdentifier(socket));

      const { roomId, code } = validate(schemas.codeChange, data);

      if (!socket.rooms.has(roomId)) {
        logger.warn(`[CodeChange] Socket ${socket.id} not in room ${roomId}, ignoring`);
        return;
      }

      logger.debug(
        `[CodeChange] Updating code in room ${roomId}, length: ${code.length}`,
      );
      roomManager.updateCode(roomId, code);

      socket.to(roomId).emit('codeChanged', { code });

      logger.debug(`[CodeChange] Code change broadcasted to room ${roomId}`);
    } catch (error) {
      logger.error(`[CodeChange] Error:`, error);
      handleSocketError(socket, error as Error, 'codeChange');
    }
  });

  socket.on('languageChange', async (data) => {
    try {
      await rateLimiters.languageChange.consume(getClientIdentifier(socket));

      const { roomId, language } = validate(schemas.languageChange, data);

      if (!socket.rooms.has(roomId)) {
        logger.warn(`[LanguageChange] Socket ${socket.id} not in room ${roomId}, ignoring`);
        return;
      }

      logger.info(
        `[LanguageChange] Changing language to ${language} in room ${roomId}`,
      );
      roomManager.updateLanguage(roomId, language);

      socket.to(roomId).emit('languageChanged', { language });

      logger.info(
        `[LanguageChange] Language change broadcasted to room ${roomId}`,
      );
    } catch (error) {
      logger.error(`[LanguageChange] Error:`, error);
      handleSocketError(socket, error as Error, 'languageChange');
    }
  });

  socket.on('inputChange', async (data) => {
    try {
      logger.debug(`[InputChange] Received from ${socket.id}:`, data);

      await rateLimiters.inputChange.consume(getClientIdentifier(socket));

      const { roomId, stdin } = validate(schemas.inputChange, data);

      if (!socket.rooms.has(roomId)) {
        logger.warn(`[InputChange] Socket ${socket.id} not in room ${roomId}, ignoring`);
        return;
      }

      logger.info(
        `[InputChange] Updating input in room ${roomId}, length: ${stdin.length}`,
      );
      roomManager.updateInput(roomId, stdin);

      logger.info(
        `[InputChange] Broadcasting inputChanged to other users in room ${roomId}`,
      );
      socket.to(roomId).emit('inputChanged', { stdin });

      logger.info(`[InputChange] Input change broadcasted successfully`);
    } catch (error) {
      logger.error(`[InputChange] Error:`, error);
      handleSocketError(socket, error as Error, 'inputChange');
    }
  });

  socket.on('executeCode', async (data) => {
    try {
      logger.info(
        `[ExecuteCode] Received from ${currentUser} (${socket.id}):`,
        {
          roomId: data.roomId,
          language: data.language,
          codeLength: data.code?.length ?? 0,
          stdinLength: data.stdin?.length ?? 0,
        },
      );

      await rateLimiters.executeCode.consume(getClientIdentifier(socket));

      const { roomId } = validate(schemas.executeCode, data);

      logger.info(
        `[ExecuteCode] Broadcasting executionStarted to ALL users in room ${roomId}`,
      );
      io.to(roomId).emit('executionStarted', {
        username: currentUser,
      });

      logger.info(
        `[ExecuteCode] Execution started by ${currentUser} in room ${roomId}`,
      );
    } catch (error) {
      logger.error(`[ExecuteCode] Error:`, error);
      handleSocketError(socket, error as Error, 'executeCode');
    }
  });

  socket.on('executionResult', async (data) => {
    try {
      logger.info(
        `[ExecutionResult] Received from ${currentUser} (${socket.id}):`,
        {
          roomId: data.roomId,
          outputLength: data.output?.length ?? 0,
          isError: data.isError,
        },
      );

      const { roomId, output, isError } = data;

      if (!roomId || output === undefined) {
        throw new Error('Invalid execution result data');
      }

      logger.info(`[ExecutionResult] Storing output in room ${roomId}`);
      roomManager.updateOutput(roomId, output, isError);

      logger.info(
        `[ExecutionResult] Broadcasting to ALL users in room ${roomId}`,
      );
      io.to(roomId).emit('executionResult', {
        output,
        isError,
        username: currentUser,
      });

      logger.info(
        `[ExecutionResult] Successfully broadcasted execution result in room ${roomId}`,
      );
    } catch (error) {
      logger.error(`[ExecutionResult] Error:`, error);
      handleSocketError(socket, error as Error, 'executionResult');
    }
  });

  socket.on('disconnect', () => {
    logger.info(`[Disconnect] Client disconnected: ${socket.id}`);

    if (currentRoom) {
      const result = roomManager.removeClient(currentRoom, socket.id);
      if (result) {
        io.to(currentRoom).emit('userLeft', {
          socketId: socket.id,
          username: currentUser,
        });
        logger.info(
          `[Disconnect] User ${currentUser} left room ${currentRoom}`,
        );
      }
    }
  });
});

const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received, starting graceful shutdown...`);

  server.close(() => {
    logger.info('HTTP server closed');
  });

  io.close(() => {
    logger.info('Socket.IO server closed');
  });

  await roomManager.shutdown();

  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);

  logger.info('Graceful shutdown complete');
  process.exit(0);
};

process.on('SIGTERM', () => { void gracefulShutdown('SIGTERM'); });
process.on('SIGINT', () => { void gracefulShutdown('SIGINT'); });

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  void gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const port = parseInt(process.env['PORT'] ?? '3000', 10);
const host = process.env['HOST'] ?? '0.0.0.0';

server.listen(port, host, () => {
  logger.info(`Server running on ${host}:${port}`);
  logger.info(`Health check: http://${host}:${port}/health`);
  logger.info(`Metrics: http://${host}:${port}/metrics`);
  logger.info(`Environment: ${process.env['NODE_ENV'] ?? 'development'}`);
});
