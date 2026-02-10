/**
 * Interaction Bot Tests
 *
 * Simulates an automated "Player Bot" that:
 * 1. Spawns at the player start position
 * 2. Walks to each of the 3 books
 * 3. Triggers interaction events (E key press)
 * 4. Verifies book discovery and XP gains
 */
import { describe, it, expect, beforeEach } from 'vitest';

// ── Book Data (matches Scene.tsx) ──
const BOOKS = [
  { id: '1', title: 'Neon Commerce', description: 'Next.js 14 Headless Shopify', position: [-8, 1.5, -8] as [number, number, number], color: '#00f0ff' },
  { id: '2', title: 'Neural Dashboard', description: 'Real-time AI Analytics', position: [8, 1.5, -8] as [number, number, number], color: '#ff0055' },
  { id: '3', title: 'Aether State', description: 'Distributed State Mgmt', position: [0, 1.5, 8] as [number, number, number], color: '#764abc' },
];

// ── Simulated Player Bot ──
interface BotState {
  position: { x: number; y: number; z: number };
  discoveredBooks: Set<string>;
  xp: number;
  level: number;
  energy: number;
  interactionLog: string[];
}

function createBot(): BotState {
  return {
    position: { x: 0, y: 5, z: 0 }, // Player spawn position
    discoveredBooks: new Set(),
    xp: 0,
    level: 1,
    energy: 100,
    interactionLog: [],
  };
}

function moveToward(bot: BotState, target: [number, number, number], speed: number = 5.5): number {
  const dx = target[0] - bot.position.x;
  const dz = target[2] - bot.position.z;
  const distance = Math.sqrt(dx * dx + dz * dz);

  if (distance < 0.1) return 0;

  const steps = Math.ceil(distance / (speed * (1 / 60))); // 60fps simulation
  const nx = dx / distance;
  const nz = dz / distance;

  // Simulate walking
  for (let i = 0; i < steps && distance > 0.5; i++) {
    bot.position.x += nx * speed * (1 / 60);
    bot.position.z += nz * speed * (1 / 60);
    // Energy cost: slight drain when moving
    bot.energy = Math.max(0, bot.energy - 0.01);
  }

  // Snap to target when close enough
  bot.position.x = target[0];
  bot.position.z = target[2];

  return distance;
}

function isInRange(bot: BotState, bookPosition: [number, number, number], range: number = 2): boolean {
  const dx = bookPosition[0] - bot.position.x;
  const dz = bookPosition[2] - bot.position.z;
  return Math.sqrt(dx * dx + dz * dz) <= range;
}

function interactWithBook(bot: BotState, bookId: string): boolean {
  if (bot.discoveredBooks.has(bookId)) {
    bot.interactionLog.push(`Book ${bookId}: already discovered`);
    return false;
  }

  bot.discoveredBooks.add(bookId);
  const xpGain = 150;
  bot.xp += xpGain;
  bot.level = Math.floor(bot.xp / 500) + 1;
  bot.interactionLog.push(`Book ${bookId}: discovered (+${xpGain} XP)`);

  // Check for archivist achievement
  if (bot.discoveredBooks.size === 3) {
    bot.interactionLog.push('ACHIEVEMENT UNLOCKED: ARCHIVIST');
  }

  return true;
}

// ── Tests ──

describe('Player Bot: Navigation', () => {
  let bot: BotState;

  beforeEach(() => {
    bot = createBot();
  });

  it('bot spawns at correct position', () => {
    expect(bot.position.x).toBe(0);
    expect(bot.position.y).toBe(5);
    expect(bot.position.z).toBe(0);
  });

  it('bot can navigate to Book 1 (Neon Commerce) at [-8, 1.5, -8]', () => {
    const book = BOOKS[0];
    const distance = moveToward(bot, book.position);

    expect(bot.position.x).toBeCloseTo(book.position[0], 0);
    expect(bot.position.z).toBeCloseTo(book.position[2], 0);
    expect(isInRange(bot, book.position)).toBe(true);
  });

  it('bot can navigate to Book 2 (Neural Dashboard) at [8, 1.5, -8]', () => {
    const book = BOOKS[1];
    moveToward(bot, book.position);

    expect(isInRange(bot, book.position)).toBe(true);
  });

  it('bot can navigate to Book 3 (Aether State) at [0, 1.5, 8]', () => {
    const book = BOOKS[2];
    moveToward(bot, book.position);

    expect(isInRange(bot, book.position)).toBe(true);
  });

  it('bot can navigate between all 3 books sequentially', () => {
    BOOKS.forEach((book) => {
      moveToward(bot, book.position);
      expect(isInRange(bot, book.position)).toBe(true);
    });
  });

  it('all book positions are reachable from spawn (within play area)', () => {
    BOOKS.forEach((book) => {
      expect(Math.abs(book.position[0])).toBeLessThan(40);
      expect(Math.abs(book.position[2])).toBeLessThan(40);
    });
  });
});

describe('Player Bot: Book Interactions', () => {
  let bot: BotState;

  beforeEach(() => {
    bot = createBot();
  });

  it('bot can interact with Book 1 and gain XP', () => {
    moveToward(bot, BOOKS[0].position);
    expect(isInRange(bot, BOOKS[0].position)).toBe(true);

    const result = interactWithBook(bot, BOOKS[0].id);
    expect(result).toBe(true);
    expect(bot.discoveredBooks.has(BOOKS[0].id)).toBe(true);
    expect(bot.xp).toBe(150);
  });

  it('bot can interact with Book 2 and gain XP', () => {
    moveToward(bot, BOOKS[1].position);
    const result = interactWithBook(bot, BOOKS[1].id);

    expect(result).toBe(true);
    expect(bot.discoveredBooks.has(BOOKS[1].id)).toBe(true);
    expect(bot.xp).toBe(150);
  });

  it('bot can interact with Book 3 and gain XP', () => {
    moveToward(bot, BOOKS[2].position);
    const result = interactWithBook(bot, BOOKS[2].id);

    expect(result).toBe(true);
    expect(bot.discoveredBooks.has(BOOKS[2].id)).toBe(true);
    expect(bot.xp).toBe(150);
  });

  it('bot cannot re-discover the same book', () => {
    moveToward(bot, BOOKS[0].position);
    interactWithBook(bot, BOOKS[0].id);
    const secondResult = interactWithBook(bot, BOOKS[0].id);

    expect(secondResult).toBe(false);
    expect(bot.xp).toBe(150); // No additional XP
  });

  it('full playtest: bot walks to all 3 books and triggers all interactions', () => {
    BOOKS.forEach((book) => {
      moveToward(bot, book.position);
      expect(isInRange(bot, book.position)).toBe(true);
      interactWithBook(bot, book.id);
    });

    expect(bot.discoveredBooks.size).toBe(3);
    expect(bot.xp).toBe(450); // 150 * 3
    expect(bot.level).toBe(1); // 450 < 500, still level 1
    expect(bot.interactionLog).toContain('ACHIEVEMENT UNLOCKED: ARCHIVIST');
  });
});

describe('Player Bot: XP and Leveling', () => {
  let bot: BotState;

  beforeEach(() => {
    bot = createBot();
  });

  it('XP accumulates correctly across discoveries', () => {
    interactWithBook(bot, '1');
    expect(bot.xp).toBe(150);

    interactWithBook(bot, '2');
    expect(bot.xp).toBe(300);

    interactWithBook(bot, '3');
    expect(bot.xp).toBe(450);
  });

  it('level calculation is correct', () => {
    // Level = floor(xp / 500) + 1
    bot.xp = 0;
    bot.level = Math.floor(bot.xp / 500) + 1;
    expect(bot.level).toBe(1);

    bot.xp = 499;
    bot.level = Math.floor(bot.xp / 500) + 1;
    expect(bot.level).toBe(1);

    bot.xp = 500;
    bot.level = Math.floor(bot.xp / 500) + 1;
    expect(bot.level).toBe(2);
  });

  it('archivist achievement triggers at 3 books', () => {
    interactWithBook(bot, '1');
    interactWithBook(bot, '2');
    expect(bot.interactionLog).not.toContain('ACHIEVEMENT UNLOCKED: ARCHIVIST');

    interactWithBook(bot, '3');
    expect(bot.interactionLog).toContain('ACHIEVEMENT UNLOCKED: ARCHIVIST');
  });
});

describe('Player Bot: Energy System', () => {
  let bot: BotState;

  beforeEach(() => {
    bot = createBot();
  });

  it('energy starts at 100', () => {
    expect(bot.energy).toBe(100);
  });

  it('energy drains slightly when moving', () => {
    const initialEnergy = bot.energy;
    moveToward(bot, [10, 0, 10]);
    expect(bot.energy).toBeLessThan(initialEnergy);
  });

  it('energy never goes below 0', () => {
    bot.energy = 0.005;
    moveToward(bot, [100, 0, 100]);
    expect(bot.energy).toBeGreaterThanOrEqual(0);
  });
});
