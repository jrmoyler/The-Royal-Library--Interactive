/**
 * Asset Mapping & Character Manager Tests
 *
 * Tests the AssetMapper and CharacterManager systems that replace
 * 2D PNG placeholders with modular low-poly 3D definitions.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { AssetMapper, assetMapper } from '../lib/AssetMapper';
import { CharacterManager, characterManager } from '../lib/CharacterManager';
import type { SlotType } from '../lib/CharacterManager';

// ── AssetMapper Tests ──

describe('AssetMapper', () => {
  let mapper: AssetMapper;

  beforeEach(() => {
    mapper = new AssetMapper();
  });

  it('has all 5 core assets registered', () => {
    const assets = mapper.getAllAssets();
    expect(assets.length).toBe(5);
  });

  it('can retrieve bookshelf asset', () => {
    const asset = mapper.getAsset('bookshelf');
    expect(asset).toBeDefined();
    expect(asset!.id).toBe('bookshelf');
    expect(asset!.description).toContain('bookshelf');
  });

  it('can retrieve floor-tile asset', () => {
    const asset = mapper.getAsset('floor-tile');
    expect(asset).toBeDefined();
    expect(asset!.geometry.type).toBe('composite');
  });

  it('can retrieve pillar asset', () => {
    const asset = mapper.getAsset('pillar');
    expect(asset).toBeDefined();
    expect(asset!.geometry.parts).toBeDefined();
    expect(asset!.geometry.parts!.length).toBeGreaterThan(0);
  });

  it('can retrieve lectern asset', () => {
    const asset = mapper.getAsset('lectern');
    expect(asset).toBeDefined();
  });

  it('can retrieve data-core asset', () => {
    const asset = mapper.getAsset('data-core');
    expect(asset).toBeDefined();
    expect(asset!.palette.accent).toBe('#00f0ff');
  });

  it('all assets have valid color palettes', () => {
    mapper.getAllAssets().forEach((asset) => {
      expect(asset.palette.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(asset.palette.secondary).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(asset.palette.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('all assets have valid geometry specs', () => {
    mapper.getAllAssets().forEach((asset) => {
      expect(asset.geometry.type).toBeTruthy();
      expect(asset.geometry.dimensions.length).toBeGreaterThan(0);
    });
  });

  it('returns original PNG URLs', () => {
    const originals = AssetMapper.getOriginalAssets();
    expect(originals.START_SCREEN).toContain('unsplash.com');
    expect(originals.MAGE).toContain('unsplash.com');
    expect(originals.SCOUT).toContain('unsplash.com');
    expect(originals.GUARDIAN).toContain('unsplash.com');
    expect(originals.BOOK_TEXTURE).toContain('unsplash.com');
    expect(originals.INTERIOR).toContain('unsplash.com');
  });

  it('can find replacements for a given PNG URL', () => {
    const originals = AssetMapper.getOriginalAssets();
    const replacements = mapper.getReplacementFor(originals.INTERIOR);
    expect(replacements.length).toBeGreaterThan(0);
  });

  it('generates a valid mapping report', () => {
    const report = mapper.getMappingReport();
    expect(report.length).toBe(5);
    report.forEach((entry) => {
      expect(entry.originalPng).toBeTruthy();
      expect(entry.replacementId).toBeTruthy();
      expect(entry.description).toBeTruthy();
    });
  });

  it('can register a custom asset', () => {
    mapper.registerAsset({
      id: 'custom-torch',
      originalPng: 'https://example.com/torch.png',
      description: 'Wall torch',
      palette: { primary: '#333', secondary: '#666', accent: '#ff6600' },
      geometry: { type: 'cylinder', dimensions: [0.05, 0.05, 0.5] },
      material: { color: '#333' },
    });

    const torch = mapper.getAsset('custom-torch');
    expect(torch).toBeDefined();
    expect(torch!.id).toBe('custom-torch');
    expect(mapper.getAllAssets().length).toBe(6);
  });
});

// ── CharacterManager Tests ──

describe('CharacterManager', () => {
  let manager: CharacterManager;

  beforeEach(() => {
    manager = new CharacterManager();
  });

  it('has 3 default characters', () => {
    const chars = manager.getAllCharacters();
    expect(chars.length).toBe(3);
  });

  it('has mage character with correct slots', () => {
    const mage = manager.getCharacter('mage');
    expect(mage).toBeDefined();
    expect(mage!.name).toBe('TECHNO MAGE');
    expect(mage!.slots.head).toBeDefined();
    expect(mage!.slots.body).toBeDefined();
    expect(mage!.slots.cape).toBeDefined();
    expect(mage!.slots.weapon).toBeDefined();
  });

  it('has scout character with correct slots', () => {
    const scout = manager.getCharacter('scout');
    expect(scout).toBeDefined();
    expect(scout!.name).toBe('VOID SCOUT');
    expect(scout!.slots.accessory).toBeDefined(); // Belt pouch
  });

  it('has guardian character with correct slots', () => {
    const guardian = manager.getCharacter('guardian');
    expect(guardian).toBeDefined();
    expect(guardian!.name).toBe('CORE GUARD');
    expect(guardian!.slots.accessory).toBeDefined(); // Shoulder pads
  });

  it('all characters reference source PNGs', () => {
    manager.getAllCharacters().forEach((char) => {
      expect(char.sourcePng).toContain('unsplash.com');
    });
  });

  it('all characters have valid palettes', () => {
    manager.getAllCharacters().forEach((char) => {
      expect(char.palette.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(char.palette.skin).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});

describe('CharacterManager: Part Swapping', () => {
  let manager: CharacterManager;

  beforeEach(() => {
    manager = new CharacterManager();
  });

  it('can swap weapon on mage', () => {
    const result = manager.swapPart('mage', 'battle-axe');
    expect(result).toBe(true);

    const mage = manager.getCharacter('mage');
    expect(mage!.slots.weapon!.id).toBe('battle-axe');
  });

  it('can swap head on guardian', () => {
    const result = manager.swapPart('guardian', 'crown');
    expect(result).toBe(true);

    const guardian = manager.getCharacter('guardian');
    expect(guardian!.slots.head!.id).toBe('crown');
  });

  it('can swap cape on scout', () => {
    const result = manager.swapPart('scout', 'royal-cape');
    expect(result).toBe(true);

    const scout = manager.getCharacter('scout');
    expect(scout!.slots.cape!.id).toBe('royal-cape');
  });

  it('returns false for invalid character id', () => {
    const result = manager.swapPart('nonexistent', 'crown');
    expect(result).toBe(false);
  });

  it('returns false for invalid part id', () => {
    const result = manager.swapPart('mage', 'nonexistent-part');
    expect(result).toBe(false);
  });

  it('can remove a part from a slot', () => {
    const result = manager.removePart('mage', 'accessory');
    expect(result).toBe(true);

    const mage = manager.getCharacter('mage');
    expect(mage!.slots.accessory).toBeNull();
  });
});

describe('CharacterManager: Parts Library', () => {
  let manager: CharacterManager;

  beforeEach(() => {
    manager = new CharacterManager();
  });

  it('has parts for all slot types', () => {
    const slotTypes: SlotType[] = ['head', 'body', 'cape', 'weapon', 'accessory'];
    slotTypes.forEach((slot) => {
      const parts = manager.getPartsForSlot(slot);
      expect(parts.length).toBeGreaterThan(0);
    });
  });

  it('has at least 15 total parts', () => {
    const allParts = manager.getAllParts();
    expect(allParts.length).toBeGreaterThanOrEqual(15);
  });

  it('all parts have valid geometry types', () => {
    const validTypes = ['box', 'capsule', 'sphere', 'cylinder', 'octahedron', 'cone'];
    manager.getAllParts().forEach((part) => {
      expect(validTypes).toContain(part.geometryType);
    });
  });

  it('all parts have valid material properties', () => {
    manager.getAllParts().forEach((part) => {
      expect(part.material).toBeDefined();
      expect(part.material.color).toBeTruthy();
    });
  });

  it('can register a custom part', () => {
    manager.registerPart({
      id: 'custom-wings',
      slot: 'accessory',
      geometryType: 'box',
      dimensions: [2, 1, 0.05],
      position: [0, 1.2, -0.3],
      material: { color: '#ffffff', transparent: true, opacity: 0.5 },
    });

    const wings = manager.getPart('custom-wings');
    expect(wings).toBeDefined();
    expect(wings!.id).toBe('custom-wings');
  });

  it('can get render parts for a character', () => {
    const mageRenderParts = manager.getRenderParts('mage');
    // Mage has head, body, cape, weapon (no accessory)
    expect(mageRenderParts.length).toBe(4);
  });

  it('can get render parts for scout (includes accessory)', () => {
    const scoutParts = manager.getRenderParts('scout');
    // Scout has all 5 slots filled
    expect(scoutParts.length).toBe(5);
  });
});

describe('CharacterManager: Character Cloning', () => {
  let manager: CharacterManager;

  beforeEach(() => {
    manager = new CharacterManager();
  });

  it('can clone a character', () => {
    const clone = manager.cloneCharacter('mage', 'dark-mage');
    expect(clone).toBeDefined();
    expect(clone!.id).toBe('dark-mage');
    expect(clone!.name).toBe('TECHNO MAGE');
  });

  it('cloned character is independent of original', () => {
    manager.cloneCharacter('mage', 'dark-mage');
    manager.swapPart('dark-mage', 'battle-axe');

    const original = manager.getCharacter('mage');
    const clone = manager.getCharacter('dark-mage');

    expect(original!.slots.weapon!.id).toBe('mage-staff');
    expect(clone!.slots.weapon!.id).toBe('battle-axe');
  });

  it('returns undefined for invalid source id', () => {
    const clone = manager.cloneCharacter('nonexistent', 'clone');
    expect(clone).toBeUndefined();
  });
});
