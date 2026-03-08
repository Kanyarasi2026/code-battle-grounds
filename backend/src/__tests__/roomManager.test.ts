import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RoomManager } from '../utils/roomManager.js';

// Suppress logger output during tests
vi.mock('../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const ROOM_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
const SOCKET_ID = 'socket-1';
const USERNAME = 'Alice';

describe('RoomManager', () => {
  let manager: RoomManager;

  beforeEach(() => {
    manager = new RoomManager({ autoStartCleanup: false });
  });

  afterEach(async () => {
    await manager.shutdown();
  });

  // ── roomExists ────────────────────────────────────────────────
  describe('roomExists', () => {
    it('returns false for a non-existent room', () => {
      expect(manager.roomExists(ROOM_ID)).toBe(false);
    });

    it('returns true after a client joins', () => {
      manager.addClient(ROOM_ID, SOCKET_ID, USERNAME);
      expect(manager.roomExists(ROOM_ID)).toBe(true);
    });
  });

  // ── addClient ─────────────────────────────────────────────────
  describe('addClient', () => {
    it('creates the room and adds the client', () => {
      const room = manager.addClient(ROOM_ID, SOCKET_ID, USERNAME);
      expect(room.clients.size).toBe(1);
      expect(room.clients.get(SOCKET_ID)?.username).toBe(USERNAME);
    });

    it('adds multiple clients to the same room', () => {
      manager.addClient(ROOM_ID, 'socket-1', 'Alice');
      const room = manager.addClient(ROOM_ID, 'socket-2', 'Bob');
      expect(room.clients.size).toBe(2);
    });

    it('stores userId and userEmail when provided', () => {
      const room = manager.addClient(ROOM_ID, SOCKET_ID, USERNAME, 'user-id-1', 'alice@test.com');
      const client = room.clients.get(SOCKET_ID);
      expect(client?.userId).toBe('user-id-1');
      expect(client?.userEmail).toBe('alice@test.com');
    });

    it('adds userId to room participants set', () => {
      const room = manager.addClient(ROOM_ID, SOCKET_ID, USERNAME, 'user-id-1', null);
      expect(room.participants.has('user-id-1')).toBe(true);
    });

    it('throws when the room is at max capacity', () => {
      const smallManager = new RoomManager({ autoStartCleanup: false, maxClientsPerRoom: 2 });
      smallManager.addClient(ROOM_ID, 'socket-1', 'User1');
      smallManager.addClient(ROOM_ID, 'socket-2', 'User2');
      expect(() => smallManager.addClient(ROOM_ID, 'socket-3', 'User3')).toThrow(
        'Room is full',
      );
    });

    it('throws when server is at max room capacity', () => {
      const smallManager = new RoomManager({ autoStartCleanup: false, maxRooms: 1 });
      smallManager.addClient('room-a-1111-1111-1111-111111111111', 'socket-1', 'User1');
      expect(() =>
        smallManager.addClient('room-b-2222-2222-2222-222222222222', 'socket-2', 'User2'),
      ).toThrow('Maximum number of rooms');
    });
  });

  // ── removeClient ──────────────────────────────────────────────
  describe('removeClient', () => {
    it('returns null for a non-existent room', () => {
      expect(manager.removeClient(ROOM_ID, SOCKET_ID)).toBeNull();
    });

    it('removes the client and returns username', () => {
      manager.addClient(ROOM_ID, 'socket-1', 'Alice');
      manager.addClient(ROOM_ID, 'socket-2', 'Bob');
      const result = manager.removeClient(ROOM_ID, 'socket-1');
      expect(result?.username).toBe('Alice');
      expect(manager.getClients(ROOM_ID)).toHaveLength(1);
    });

    it('deletes the room when the last client leaves and returns null', () => {
      manager.addClient(ROOM_ID, SOCKET_ID, USERNAME);
      const result = manager.removeClient(ROOM_ID, SOCKET_ID);
      expect(result).toBeNull();
      expect(manager.roomExists(ROOM_ID)).toBe(false);
    });

    it('clears the user→room mapping when an authenticated user leaves', () => {
      manager.addClient(ROOM_ID, SOCKET_ID, USERNAME, 'uid-1', 'alice@test.com');
      manager.addClient(ROOM_ID, 'socket-2', 'Bob'); // keep room alive
      manager.removeClient(ROOM_ID, SOCKET_ID);
      expect(manager.getUserCurrentRoom('alice@test.com')).toBeNull();
    });
  });

  // ── updateCode / updateLanguage / updateInput / updateOutput ──
  describe('state updates', () => {
    beforeEach(() => {
      manager.addClient(ROOM_ID, SOCKET_ID, USERNAME);
    });

    it('updateCode stores new code', () => {
      manager.updateCode(ROOM_ID, 'console.log("hi")');
      expect(manager.getRoom(ROOM_ID)?.code).toBe('console.log("hi")');
    });

    it('updateLanguage stores new language', () => {
      manager.updateLanguage(ROOM_ID, 'python');
      expect(manager.getRoom(ROOM_ID)?.language).toBe('python');
    });

    it('updateInput stores new stdin', () => {
      manager.updateInput(ROOM_ID, 'hello\nworld');
      expect(manager.getRoom(ROOM_ID)?.stdin).toBe('hello\nworld');
    });

    it('updateOutput stores output and isError flag', () => {
      manager.updateOutput(ROOM_ID, 'error: undefined', true);
      const room = manager.getRoom(ROOM_ID);
      expect(room?.output).toBe('error: undefined');
      expect(room?.isError).toBe(true);
    });

    it('state updates on a non-existent room are no-ops', () => {
      expect(() => {
        manager.updateCode('no-such-room', 'code');
        manager.updateLanguage('no-such-room', 'python');
        manager.updateInput('no-such-room', 'stdin');
        manager.updateOutput('no-such-room', 'out', false);
      }).not.toThrow();
    });
  });

  // ── getClients ────────────────────────────────────────────────
  describe('getClients', () => {
    it('returns empty array for a non-existent room', () => {
      expect(manager.getClients(ROOM_ID)).toEqual([]);
    });

    it('returns all unauthenticated clients without deduplication', () => {
      manager.addClient(ROOM_ID, 'socket-1', 'Alice');
      manager.addClient(ROOM_ID, 'socket-2', 'Bob');
      expect(manager.getClients(ROOM_ID)).toHaveLength(2);
    });

    it('deduplicates authenticated clients by email (last entry wins)', () => {
      manager.addClient(ROOM_ID, 'socket-1', 'Alice', 'uid-1', 'alice@test.com');
      manager.addClient(ROOM_ID, 'socket-2', 'AliceNew', 'uid-1', 'alice@test.com');
      const clients = manager.getClients(ROOM_ID);
      expect(clients).toHaveLength(1);
      expect(clients[0]?.username).toBe('AliceNew');
    });
  });

  // ── getUserCurrentRoom / isUserInRoom ─────────────────────────
  describe('user-room tracking', () => {
    it('getUserCurrentRoom returns null when user is not in any room', () => {
      expect(manager.getUserCurrentRoom('nobody@test.com')).toBeNull();
    });

    it('getUserCurrentRoom returns roomId after user joins', () => {
      manager.addClient(ROOM_ID, SOCKET_ID, USERNAME, 'uid', 'user@test.com');
      expect(manager.getUserCurrentRoom('user@test.com')).toBe(ROOM_ID);
    });

    it('isUserInRoom returns true for the correct room', () => {
      manager.addClient(ROOM_ID, SOCKET_ID, USERNAME, 'uid', 'user@test.com');
      expect(manager.isUserInRoom('user@test.com', ROOM_ID)).toBe(true);
    });

    it('isUserInRoom returns false for a different room', () => {
      manager.addClient(ROOM_ID, SOCKET_ID, USERNAME, 'uid', 'user@test.com');
      expect(manager.isUserInRoom('user@test.com', 'other-room')).toBe(false);
    });
  });

  // ── getStats ──────────────────────────────────────────────────
  describe('getStats', () => {
    it('returns zeros when there are no rooms', () => {
      expect(manager.getStats()).toEqual({ totalRooms: 0, totalClients: 0 });
    });

    it('counts rooms and clients correctly', () => {
      manager.addClient(ROOM_ID, 'socket-1', 'Alice');
      manager.addClient(ROOM_ID, 'socket-2', 'Bob');
      manager.addClient('other-room-2222-2222-2222-222222222222', 'socket-3', 'Carol');
      expect(manager.getStats()).toEqual({ totalRooms: 2, totalClients: 3 });
    });
  });

  // ── cleanupInactiveRooms ──────────────────────────────────────
  describe('cleanupInactiveRooms', () => {
    it('removes rooms that exceeded the TTL', () => {
      const shortTTL = new RoomManager({ autoStartCleanup: false, roomTTL: 1 });
      shortTTL.addClient(ROOM_ID, SOCKET_ID, USERNAME);

      // Fast-forward time by manipulating roomActivity directly via a waiting approach
      // We use a tiny TTL and real Date.now advancement via fake timers
      vi.useFakeTimers();
      vi.advanceTimersByTime(10);
      const cleaned = shortTTL.cleanupInactiveRooms();
      expect(cleaned).toBe(1);
      expect(shortTTL.roomExists(ROOM_ID)).toBe(false);
      vi.useRealTimers();
    });

    it('does not remove recently active rooms', () => {
      manager.addClient(ROOM_ID, SOCKET_ID, USERNAME);
      const cleaned = manager.cleanupInactiveRooms();
      expect(cleaned).toBe(0);
      expect(manager.roomExists(ROOM_ID)).toBe(true);
    });
  });

  // ── getRoomInfo ───────────────────────────────────────────────
  describe('getRoomInfo', () => {
    it('returns null for non-existent room', () => {
      expect(manager.getRoomInfo(ROOM_ID)).toBeNull();
    });

    it('returns room metadata', () => {
      manager.addClient(ROOM_ID, SOCKET_ID, USERNAME, 'uid-1', 'alice@test.com');
      const info = manager.getRoomInfo(ROOM_ID);
      expect(info?.roomId).toBe(ROOM_ID);
      expect(info?.creatorEmail).toBe('alice@test.com');
      expect(info?.activeClients).toBe(1);
    });
  });

  // ── shutdown ──────────────────────────────────────────────────
  describe('shutdown', () => {
    it('clears all rooms and resets stats', async () => {
      manager.addClient(ROOM_ID, SOCKET_ID, USERNAME);
      await manager.shutdown();
      expect(manager.getStats()).toEqual({ totalRooms: 0, totalClients: 0 });
    });
  });
});
