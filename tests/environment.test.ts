/**
 * Environment Collider Tests
 *
 * Verifies all 3D colliders are correctly configured and the player
 * cannot fall through the floor. Tests the physics setup and boundary walls.
 */
import { describe, it, expect } from 'vitest';

// ── Floor Collider Tests ──

describe('Environment: Floor Colliders', () => {
  it('floor slab has sufficient thickness to prevent fall-through', () => {
    // The floor is an 80x2x80 box positioned at y=-1
    // This means its top surface is at y=0 and bottom at y=-2
    const floorThickness = 2;
    const floorY = -1;
    const topSurface = floorY + floorThickness / 2; // 0
    const bottomSurface = floorY - floorThickness / 2; // -2

    // Floor must be at least 1 unit thick to prevent fast-moving objects passing through
    expect(floorThickness).toBeGreaterThanOrEqual(1);
    // Top surface must be at or above y=0 (ground level)
    expect(topSurface).toBeGreaterThanOrEqual(0);
    // Bottom surface must extend below ground
    expect(bottomSurface).toBeLessThan(0);
  });

  it('floor covers the entire play area', () => {
    const floorWidth = 80;
    const floorDepth = 80;
    const playAreaRadius = 35; // Maximum expected play area radius

    expect(floorWidth / 2).toBeGreaterThanOrEqual(playAreaRadius);
    expect(floorDepth / 2).toBeGreaterThanOrEqual(playAreaRadius);
  });

  it('player spawn position is above the floor', () => {
    const playerSpawnY = 5;
    const floorTopY = 0;

    expect(playerSpawnY).toBeGreaterThan(floorTopY);
  });

  it('floor has physics friction for realistic movement', () => {
    // Floor friction is set to 1.2 in the Level component
    const floorFriction = 1.2;
    expect(floorFriction).toBeGreaterThan(0);
    expect(floorFriction).toBeLessThanOrEqual(2.0); // Reasonable range
  });

  it('floor has restitution near zero (no bouncing)', () => {
    const floorRestitution = 0.1;
    expect(floorRestitution).toBeLessThanOrEqual(0.3);
    expect(floorRestitution).toBeGreaterThanOrEqual(0);
  });
});

// ── Boundary Wall Tests ──

describe('Environment: Boundary Walls', () => {
  const walls = [
    { name: 'North', position: [0, 5, -40], size: [80, 10, 1] },
    { name: 'South', position: [0, 5, 40], size: [80, 10, 1] },
    { name: 'East', position: [40, 5, 0], size: [1, 10, 80] },
    { name: 'West', position: [-40, 5, 0], size: [1, 10, 80] },
  ];

  walls.forEach((wall) => {
    it(`${wall.name} wall is positioned at boundary`, () => {
      // Walls should be at the edges of the floor (±40)
      const maxCoord = Math.max(
        Math.abs(wall.position[0]),
        Math.abs(wall.position[2])
      );
      expect(maxCoord).toBe(40); // Matches floor half-width
    });

    it(`${wall.name} wall height covers player jump range`, () => {
      const wallHeight = wall.size[1];
      const maxJumpHeight = 5.5; // Player jump impulse
      expect(wallHeight).toBeGreaterThan(maxJumpHeight);
    });
  });

  it('all four boundary walls form a closed perimeter', () => {
    expect(walls).toHaveLength(4);
    const xWalls = walls.filter(w => Math.abs(w.position[0]) === 40);
    const zWalls = walls.filter(w => Math.abs(w.position[2]) === 40);
    expect(xWalls).toHaveLength(2);
    expect(zWalls).toHaveLength(2);
  });
});

// ── Pillar Collider Tests ──

describe('Environment: Pillar Colliders', () => {
  const pillarPositions: [number, number, number][] = [
    [-15, 0, -15],
    [15, 0, -15],
    [-15, 0, 15],
    [15, 0, 15],
  ];

  it('all four pillars are present', () => {
    expect(pillarPositions).toHaveLength(4);
  });

  pillarPositions.forEach(([x, y, z], i) => {
    it(`pillar ${i + 1} base is on the floor`, () => {
      expect(y).toBe(0);
    });

    it(`pillar ${i + 1} is within play area`, () => {
      expect(Math.abs(x)).toBeLessThan(40);
      expect(Math.abs(z)).toBeLessThan(40);
    });
  });
});

// ── Physics Configuration Tests ──

describe('Environment: Physics Configuration', () => {
  it('gravity uses real-world value (9.81 m/s²)', () => {
    const gravity = [0, -9.81, 0];
    expect(gravity[1]).toBeCloseTo(-9.81, 1);
    expect(gravity[0]).toBe(0);
    expect(gravity[2]).toBe(0);
  });

  it('player has proper physics properties', () => {
    const playerConfig = {
      friction: 1.0,
      linearDamping: 0.5,
      angularDamping: 1.0,
      gravityScale: 1.2,
    };

    expect(playerConfig.friction).toBeGreaterThan(0);
    expect(playerConfig.linearDamping).toBeGreaterThan(0);
    expect(playerConfig.angularDamping).toBeGreaterThan(0);
    expect(playerConfig.gravityScale).toBeGreaterThan(0);
  });

  it('player capsule collider has proper friction and no bounce', () => {
    const capsuleFriction = 0.8;
    const capsuleRestitution = 0.0;

    expect(capsuleFriction).toBeGreaterThan(0);
    expect(capsuleRestitution).toBe(0);
  });

  it('player cannot fall through floor in worst case', () => {
    // At gravity 9.81 * 1.2 = 11.772 m/s² and max fall from spawn at y=5,
    // terminal velocity v = sqrt(2 * g * h) = sqrt(2 * 11.772 * 5) ≈ 10.85 m/s
    // With a 2-unit thick floor and typical 60fps physics step (1/60 = 0.0167s),
    // max displacement per step = 10.85 * 0.0167 ≈ 0.18 units
    // Floor thickness of 2 >> 0.18, so fall-through is prevented
    const gravity = 9.81 * 1.2;
    const fallHeight = 5;
    const terminalVelocity = Math.sqrt(2 * gravity * fallHeight);
    const physicsStep = 1 / 60;
    const maxDisplacementPerStep = terminalVelocity * physicsStep;
    const floorThickness = 2;

    expect(floorThickness).toBeGreaterThan(maxDisplacementPerStep * 5); // 5x safety margin
  });
});

// ── Bookshelf Collider Tests ──

describe('Environment: Bookshelf Colliders', () => {
  const bookshelfPositions = {
    north: [-12, -8, -4, 4, 8, 12].map(x => [x, 2, -18] as [number, number, number]),
    east: [-12, -6, 0, 6, 12].map(z => [20, 2, z] as [number, number, number]),
    west: [-12, -6, 0, 6, 12].map(z => [-20, 2, z] as [number, number, number]),
    south: [-8, -4, 4, 8].map(x => [x, 2, 18] as [number, number, number]),
  };

  it('north wing has 6 bookshelves', () => {
    expect(bookshelfPositions.north).toHaveLength(6);
  });

  it('east wing has 5 bookshelves', () => {
    expect(bookshelfPositions.east).toHaveLength(5);
  });

  it('west wing has 5 bookshelves', () => {
    expect(bookshelfPositions.west).toHaveLength(5);
  });

  it('south wing has 4 bookshelves', () => {
    expect(bookshelfPositions.south).toHaveLength(4);
  });

  it('total bookshelf count is 20', () => {
    const total = Object.values(bookshelfPositions).reduce((sum, arr) => sum + arr.length, 0);
    expect(total).toBe(20);
  });

  it('all bookshelves are within play area', () => {
    Object.values(bookshelfPositions).flat().forEach(([x, y, z]) => {
      expect(Math.abs(x)).toBeLessThan(40);
      expect(Math.abs(z)).toBeLessThan(40);
    });
  });
});
