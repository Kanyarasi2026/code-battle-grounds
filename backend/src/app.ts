import cors from 'cors';
import express from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { logger } from './utils/logger.js';
import { roomManager } from './utils/roomManager.js';

export const JUDGE0_LANG_IDS: Record<string, number> = {
  cpp: 54,
  c: 50,
  javascript: 93,
  java: 91,
  python: 100,
};

export function getAllowedOrigins(): string[] {
  return process.env['CORS_ORIGINS']
    ? process.env['CORS_ORIGINS'].split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];
}

export function createApp() {
  const app = express();

  app.use(cors({ origin: getAllowedOrigins(), credentials: true }));
  app.use(express.json());

  app.get('/room/:roomId/exists', (req, res) => {
    const { roomId } = req.params;
    const exists = roomManager.roomExists(roomId as string);
    res.json({ exists });
  });

  const executeRateLimiter = new RateLimiterMemory({ points: 10, duration: 60 });
  const JUDGE0_URL = process.env['JUDGE0_URL'] ?? 'https://ce.judge0.com';

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
# HELP codebattleground_rooms_total Total number of active rooms
# TYPE codebattleground_rooms_total gauge
codebattleground_rooms_total ${stats.totalRooms}

# HELP codebattleground_clients_total Total number of connected clients
# TYPE codebattleground_clients_total gauge
codebattleground_clients_total ${stats.totalClients}

# HELP codebattleground_uptime_seconds Server uptime in seconds
# TYPE codebattleground_uptime_seconds counter
codebattleground_uptime_seconds ${Math.floor(process.uptime())}
  `.trim(),
    );
  });

  return app;
}
