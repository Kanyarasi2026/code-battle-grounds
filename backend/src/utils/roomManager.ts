import type {
  ClientData,
  ClientInfo,
  Room,
  RoomInfo,
  RoomManagerOptions,
  RoomStats,
} from '../types/index.js';
import { logger } from './logger.js';

export class RoomManager {
  private rooms: Map<string, Room>;
  private roomActivity: Map<string, number>;
  // Maps userEmail → roomId for currently connected authenticated users
  private userRoomMap: Map<string, string>;
  private readonly ROOM_TTL: number;
  private readonly CLEANUP_INTERVAL: number;
  private cleanupIntervalId: ReturnType<typeof setInterval> | null;
  private readonly MAX_ROOMS: number;
  private readonly MAX_CLIENTS_PER_ROOM: number;
  private readonly autoStartCleanup: boolean;

  constructor(options: RoomManagerOptions = {}) {
    this.rooms = new Map();
    this.roomActivity = new Map();
    this.userRoomMap = new Map();
    this.ROOM_TTL = options.roomTTL ?? 3600000;
    this.CLEANUP_INTERVAL = options.cleanupInterval ?? 300000;
    this.cleanupIntervalId = null;
    this.MAX_ROOMS = options.maxRooms ?? 1000;
    this.MAX_CLIENTS_PER_ROOM = options.maxClientsPerRoom ?? 50;
    this.autoStartCleanup = options.autoStartCleanup ?? true;

    if (this.autoStartCleanup) {
      this.startCleanupInterval();
    }
  }

  roomExists(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  /** Returns the roomId the user is currently in, or null if not in any room. */
  getUserCurrentRoom(userEmail: string): string | null {
    return this.userRoomMap.get(userEmail) ?? null;
  }

  /** Returns true if the user is already tracked as being in the given room. */
  isUserInRoom(userEmail: string, roomId: string): boolean {
    return this.userRoomMap.get(userEmail) === roomId;
  }

  getOrCreateRoom(
    roomId: string,
    creatorUserId: string | null = null,
    creatorEmail: string | null = null,
  ): Room {
    if (!this.rooms.has(roomId)) {
      if (this.rooms.size >= this.MAX_ROOMS) {
        throw new Error(`Maximum number of rooms (${this.MAX_ROOMS}) reached`);
      }

      this.rooms.set(roomId, {
        clients: new Map<string, ClientData>(),
        code: '',
        language: 'cpp',
        stdin: '',
        output: '',
        isError: false,
        createdAt: Date.now(),
        createdBy: creatorUserId,
        creatorEmail: creatorEmail,
        participants: new Set<string>(),
      });
      this.updateActivity(roomId);
      logger.info(
        `Room created: ${roomId} by ${creatorEmail ?? 'unknown'} (${creatorUserId ?? 'N/A'})`,
      );
    }
    return this.rooms.get(roomId) as Room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  updateActivity(roomId: string): void {
    this.roomActivity.set(roomId, Date.now());
  }

  addClient(
    roomId: string,
    socketId: string,
    username: string,
    userId: string | null = null,
    userEmail: string | null = null,
  ): Room {
    const room = this.getOrCreateRoom(roomId, userId, userEmail);

    if (room.clients.size >= this.MAX_CLIENTS_PER_ROOM) {
      throw new Error(`Room is full (max ${this.MAX_CLIENTS_PER_ROOM} clients)`);
    }

    room.clients.set(socketId, { username, userId, userEmail });

    if (userId) {
      room.participants.add(userId);
    }

    // Track authenticated user → room mapping
    if (userEmail) {
      this.userRoomMap.set(userEmail, roomId);
    }

    this.updateActivity(roomId);
    logger.info(
      `Client ${username} (${userEmail ?? 'no-email'}) joined room ${roomId}`,
    );
    return room;
  }

  removeClient(
    roomId: string,
    socketId: string,
  ): { room: Room; username: string } | null {
    if (!this.rooms.has(roomId)) return null;

    const room = this.rooms.get(roomId) as Room;
    const clientData = room.clients.get(socketId);
    room.clients.delete(socketId);

    // Clear the user→room lock when they leave
    if (clientData?.userEmail) {
      this.userRoomMap.delete(clientData.userEmail);
    }

    if (room.clients.size === 0) {
      this.rooms.delete(roomId);
      this.roomActivity.delete(roomId);
      logger.info(`Room ${roomId} deleted (empty)`);
      return null;
    }

    this.updateActivity(roomId);
    return { room, username: clientData?.username ?? 'Unknown' };
  }

  updateCode(roomId: string, code: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.code = code;
      this.updateActivity(roomId);
    }
  }

  updateLanguage(roomId: string, language: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.language = language;
      this.updateActivity(roomId);
    }
  }

  updateInput(roomId: string, stdin: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.stdin = stdin;
      this.updateActivity(roomId);
    }
  }

  updateOutput(roomId: string, output: string, isError = false): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.output = output;
      room.isError = isError;
      this.updateActivity(roomId);
    }
  }

  /**
   * Returns the list of clients in a room deduplicated by userEmail.
   * For null-email (unauthenticated) clients each entry is kept as-is.
   * When duplicate emails exist, the last socket entry wins.
   */
  getClients(roomId: string): ClientInfo[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    const all = Array.from(room.clients, ([id, data]) => ({
      socketId: id,
      username: typeof data === 'string' ? data : data.username,
      userId: typeof data === 'object' ? data.userId : null,
      userEmail: typeof data === 'object' ? data.userEmail : null,
    }));

    // Deduplicate by userEmail — last entry (most recent socketId) wins.
    // Null emails are never deduplicated against each other.
    const emailSeen = new Map<string, ClientInfo>();
    const noEmailClients: ClientInfo[] = [];

    for (const client of all) {
      if (client.userEmail) {
        emailSeen.set(client.userEmail, client);
      } else {
        noEmailClients.push(client);
      }
    }

    return [...emailSeen.values(), ...noEmailClients];
  }

  getRoomInfo(roomId: string): RoomInfo | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    return {
      roomId,
      createdBy: room.createdBy,
      creatorEmail: room.creatorEmail,
      createdAt: room.createdAt,
      participants: Array.from(room.participants),
      activeClients: room.clients.size,
    };
  }

  cleanupInactiveRooms(): number {
    const now = Date.now();
    let cleanedCount = 0;

    this.roomActivity.forEach((lastActivity, roomId) => {
      if (now - lastActivity > this.ROOM_TTL) {
        // Clear userRoomMap entries for clients in this room
        const room = this.rooms.get(roomId);
        if (room) {
          room.clients.forEach((clientData) => {
            if (clientData.userEmail) {
              this.userRoomMap.delete(clientData.userEmail);
            }
          });
        }
        this.rooms.delete(roomId);
        this.roomActivity.delete(roomId);
        cleanedCount++;
        logger.info(
          `Room ${roomId} cleaned up (inactive for ${this.ROOM_TTL / 60000} minutes)`,
        );
      }
    });

    if (cleanedCount > 0) {
      logger.info(`Cleaned up ${cleanedCount} inactive rooms`);
    }

    return cleanedCount;
  }

  startCleanupInterval(): void {
    if (!this.autoStartCleanup || this.cleanupIntervalId) {
      return;
    }
    this.cleanupIntervalId = setInterval(() => {
      this.cleanupInactiveRooms();
    }, this.CLEANUP_INTERVAL);

    logger.info('Room cleanup interval started');
  }

  getStats(): RoomStats {
    return {
      totalRooms: this.rooms.size,
      totalClients: Array.from(this.rooms.values()).reduce(
        (sum, room) => sum + room.clients.size,
        0,
      ),
    };
  }

  async shutdown(): Promise<void> {
    logger.info('RoomManager shutting down...');

    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
      logger.info('Cleanup interval cleared');
    }

    this.rooms.clear();
    this.roomActivity.clear();
    this.userRoomMap.clear();
    logger.info('RoomManager shutdown complete');
  }
}

export const roomManager = new RoomManager();
