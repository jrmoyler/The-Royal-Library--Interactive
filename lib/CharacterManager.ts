/**
 * CharacterManager - Modular character system with interchangeable parts.
 *
 * Characters are composed of modular "slots" (head, body, cape, weapon, accessory).
 * Each slot can hold different parts that are swappable at runtime.
 * Parts are defined as low-poly geometry specs derived from the PNG character descriptions.
 */

export type SlotType = 'head' | 'body' | 'cape' | 'weapon' | 'accessory';

export interface CharacterPart {
  id: string;
  slot: SlotType;
  /** Geometry primitive type */
  geometryType: 'box' | 'capsule' | 'sphere' | 'cylinder' | 'octahedron' | 'cone';
  /** Geometry dimensions array */
  dimensions: number[];
  /** Local position offset within the character rig */
  position: [number, number, number];
  /** Local rotation */
  rotation?: [number, number, number];
  /** Scale */
  scale?: [number, number, number];
  /** Material properties */
  material: {
    color: string;
    metalness?: number;
    roughness?: number;
    emissive?: string;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    useShader?: boolean;
    glowIntensity?: number;
  };
  /** Cast shadow */
  castShadow?: boolean;
  /** Sub-parts (e.g., weapon hilt + blade) */
  children?: CharacterPart[];
}

export interface CharacterConfig {
  id: string;
  name: string;
  description: string;
  /** Source PNG that this replaces */
  sourcePng: string;
  /** Color palette extracted from the PNG theme */
  palette: { primary: string; secondary: string; accent: string; skin: string };
  /** Parts assigned to each slot */
  slots: Record<SlotType, CharacterPart | null>;
}

// ── Predefined Parts Library ──

// HEAD PARTS
const MAGE_HELMET: CharacterPart = {
  id: 'mage-helmet',
  slot: 'head',
  geometryType: 'sphere',
  dimensions: [0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.4],
  position: [0, 1.66, 0],
  material: { color: '#080c14', metalness: 0.9, roughness: 0.1 },
  castShadow: true,
};

const SCOUT_HOOD: CharacterPart = {
  id: 'scout-hood',
  slot: 'head',
  geometryType: 'cone',
  dimensions: [0.28, 0.35, 6],
  position: [0, 1.75, -0.05],
  material: { color: '#0a0f1a', metalness: 0.5, roughness: 0.6 },
  castShadow: true,
};

const GUARDIAN_HELM: CharacterPart = {
  id: 'guardian-helm',
  slot: 'head',
  geometryType: 'box',
  dimensions: [0.3, 0.28, 0.3],
  position: [0, 1.7, 0],
  material: { color: '#1a2130', metalness: 1, roughness: 0.05 },
  castShadow: true,
};

const CROWN: CharacterPart = {
  id: 'crown',
  slot: 'head',
  geometryType: 'cylinder',
  dimensions: [0.22, 0.28, 0.15, 6],
  position: [0, 1.78, 0],
  material: { color: '#ffaa00', metalness: 1, roughness: 0.1, emissive: '#ffaa00', emissiveIntensity: 2 },
  castShadow: true,
};

// BODY PARTS
const MAGE_ROBE: CharacterPart = {
  id: 'mage-robe',
  slot: 'body',
  geometryType: 'capsule',
  dimensions: [0.28, 0.8, 12, 12],
  position: [0, 0.8, 0],
  material: { color: '#11151c' },
  castShadow: true,
};

const SCOUT_ARMOR: CharacterPart = {
  id: 'scout-armor',
  slot: 'body',
  geometryType: 'capsule',
  dimensions: [0.22, 0.9, 12, 12],
  position: [0, 0.85, 0],
  material: { color: '#050a14', metalness: 0.8 },
  castShadow: true,
};

const GUARDIAN_PLATE: CharacterPart = {
  id: 'guardian-plate',
  slot: 'body',
  geometryType: 'box',
  dimensions: [0.65, 1.2, 0.55],
  position: [0, 0.9, 0],
  material: { color: '#1a2130', metalness: 1, roughness: 0.05 },
  castShadow: true,
};

// CAPE PARTS
const MAGE_CAPE: CharacterPart = {
  id: 'mage-cape',
  slot: 'cape',
  geometryType: 'box',
  dimensions: [0.9, 1.7, 0.01],
  position: [0, -0.85, 0],
  material: { useShader: true, color: '#00f0ff', transparent: true, opacity: 0.3, glowIntensity: 1.5 },
  castShadow: true,
};

const SCOUT_CLOAK: CharacterPart = {
  id: 'scout-cloak',
  slot: 'cape',
  geometryType: 'box',
  dimensions: [0.6, 1.3, 0.01],
  position: [0, -0.7, 0],
  material: { useShader: true, color: '#00f0ff', transparent: true, opacity: 0.7 },
  castShadow: true,
};

const GUARDIAN_MANTLE: CharacterPart = {
  id: 'guardian-mantle',
  slot: 'cape',
  geometryType: 'box',
  dimensions: [1.1, 1.8, 0.05],
  position: [0, -0.9, 0],
  material: { color: '#080808' },
  castShadow: true,
};

const ROYAL_CAPE: CharacterPart = {
  id: 'royal-cape',
  slot: 'cape',
  geometryType: 'box',
  dimensions: [1.0, 2.0, 0.02],
  position: [0, -0.9, 0],
  material: { color: '#660022', metalness: 0.4, roughness: 0.6 },
  castShadow: true,
};

// WEAPON PARTS
const MAGE_STAFF: CharacterPart = {
  id: 'mage-staff',
  slot: 'weapon',
  geometryType: 'cylinder',
  dimensions: [0.025, 0.025, 2.8],
  position: [0.7, 1.1, 0.4],
  material: { color: '#111', metalness: 1 },
  castShadow: true,
  children: [
    {
      id: 'staff-crystal',
      slot: 'weapon',
      geometryType: 'octahedron',
      dimensions: [0.15],
      position: [0, 1.5, 0],
      material: { useShader: true, color: '#00f0ff', glowIntensity: 10 },
    },
  ],
};

const SCOUT_DAGGERS: CharacterPart = {
  id: 'scout-daggers',
  slot: 'weapon',
  geometryType: 'box',
  dimensions: [0.04, 0.5, 0.02],
  position: [-0.5, 0.9, 0.35],
  rotation: [Math.PI / 2, 0, 0],
  material: { useShader: true, color: '#00f0ff', glowIntensity: 8 },
  children: [
    {
      id: 'scout-dagger-2',
      slot: 'weapon',
      geometryType: 'box',
      dimensions: [0.04, 0.5, 0.02],
      position: [1, 0, 0],
      material: { useShader: true, color: '#00f0ff', glowIntensity: 8 },
    },
  ],
};

const GUARDIAN_SWORD: CharacterPart = {
  id: 'guardian-sword',
  slot: 'weapon',
  geometryType: 'box',
  dimensions: [0.18, 2.0, 0.06],
  position: [0.7, 1.0, 0.4],
  rotation: [0, 0, 0.05],
  material: { useShader: true, color: '#00f0ff', glowIntensity: 4 },
  castShadow: true,
  children: [
    {
      id: 'sword-hilt',
      slot: 'weapon',
      geometryType: 'cylinder',
      dimensions: [0.05, 0.05, 0.7],
      position: [0, -1.1, 0],
      material: { color: '#444' },
    },
  ],
};

const BATTLE_AXE: CharacterPart = {
  id: 'battle-axe',
  slot: 'weapon',
  geometryType: 'cylinder',
  dimensions: [0.03, 0.03, 2.2],
  position: [0.7, 1.1, 0.4],
  material: { color: '#333', metalness: 1 },
  castShadow: true,
  children: [
    {
      id: 'axe-head',
      slot: 'weapon',
      geometryType: 'box',
      dimensions: [0.4, 0.5, 0.05],
      position: [0.15, 0.9, 0],
      material: { color: '#888', metalness: 1, roughness: 0.1 },
    },
  ],
};

// ACCESSORY PARTS
const SHOULDER_PADS: CharacterPart = {
  id: 'shoulder-pads',
  slot: 'accessory',
  geometryType: 'box',
  dimensions: [0.2, 0.12, 0.2],
  position: [-0.35, 1.35, 0],
  material: { color: '#1a2130', metalness: 0.8 },
  castShadow: true,
  children: [
    {
      id: 'shoulder-pad-right',
      slot: 'accessory',
      geometryType: 'box',
      dimensions: [0.2, 0.12, 0.2],
      position: [0.7, 0, 0],
      material: { color: '#1a2130', metalness: 0.8 },
    },
  ],
};

const BELT_POUCH: CharacterPart = {
  id: 'belt-pouch',
  slot: 'accessory',
  geometryType: 'box',
  dimensions: [0.12, 0.1, 0.08],
  position: [0.25, 0.45, 0.2],
  material: { color: '#4a3020', roughness: 0.9 },
};

// ── Parts Registry ──

const PARTS_REGISTRY: Map<string, CharacterPart> = new Map([
  // Heads
  ['mage-helmet', MAGE_HELMET],
  ['scout-hood', SCOUT_HOOD],
  ['guardian-helm', GUARDIAN_HELM],
  ['crown', CROWN],
  // Bodies
  ['mage-robe', MAGE_ROBE],
  ['scout-armor', SCOUT_ARMOR],
  ['guardian-plate', GUARDIAN_PLATE],
  // Capes
  ['mage-cape', MAGE_CAPE],
  ['scout-cloak', SCOUT_CLOAK],
  ['guardian-mantle', GUARDIAN_MANTLE],
  ['royal-cape', ROYAL_CAPE],
  // Weapons
  ['mage-staff', MAGE_STAFF],
  ['scout-daggers', SCOUT_DAGGERS],
  ['guardian-sword', GUARDIAN_SWORD],
  ['battle-axe', BATTLE_AXE],
  // Accessories
  ['shoulder-pads', SHOULDER_PADS],
  ['belt-pouch', BELT_POUCH],
]);

// ── Default Character Configs ──

const MAGE_CONFIG: CharacterConfig = {
  id: 'mage',
  name: 'TECHNO MAGE',
  description: 'Data-stream archivist specialized in energetic archival manipulation.',
  sourcePng: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&q=80&w=800',
  palette: { primary: '#11151c', secondary: '#080c14', accent: '#00f0ff', skin: '#d29d7c' },
  slots: {
    head: MAGE_HELMET,
    body: MAGE_ROBE,
    cape: MAGE_CAPE,
    weapon: MAGE_STAFF,
    accessory: null,
  },
};

const SCOUT_CONFIG: CharacterConfig = {
  id: 'scout',
  name: 'VOID SCOUT',
  description: 'Deep-layer infiltrator optimized for rapid retrieval and stealth archival.',
  sourcePng: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
  palette: { primary: '#050a14', secondary: '#0a0f1a', accent: '#00f0ff', skin: '#d29d7c' },
  slots: {
    head: SCOUT_HOOD,
    body: SCOUT_ARMOR,
    cape: SCOUT_CLOAK,
    weapon: SCOUT_DAGGERS,
    accessory: BELT_POUCH,
  },
};

const GUARDIAN_CONFIG: CharacterConfig = {
  id: 'guardian',
  name: 'CORE GUARD',
  description: 'Sentinel of the Aetheria. Maximum neural shielding for heavy sector defense.',
  sourcePng: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
  palette: { primary: '#1a2130', secondary: '#080808', accent: '#00f0ff', skin: '#d29d7c' },
  slots: {
    head: GUARDIAN_HELM,
    body: GUARDIAN_PLATE,
    cape: GUARDIAN_MANTLE,
    weapon: GUARDIAN_SWORD,
    accessory: SHOULDER_PADS,
  },
};

/**
 * CharacterManager provides a modular character system.
 * Characters are composed of interchangeable parts across 5 slots.
 */
export class CharacterManager {
  private characters: Map<string, CharacterConfig>;
  private partsLibrary: Map<string, CharacterPart>;

  constructor() {
    this.characters = new Map([
      ['mage', { ...MAGE_CONFIG, slots: { ...MAGE_CONFIG.slots } }],
      ['scout', { ...SCOUT_CONFIG, slots: { ...SCOUT_CONFIG.slots } }],
      ['guardian', { ...GUARDIAN_CONFIG, slots: { ...GUARDIAN_CONFIG.slots } }],
    ]);
    this.partsLibrary = new Map(PARTS_REGISTRY);
  }

  /** Get a character configuration by ID */
  getCharacter(id: string): CharacterConfig | undefined {
    return this.characters.get(id);
  }

  /** Get all character configurations */
  getAllCharacters(): CharacterConfig[] {
    return Array.from(this.characters.values());
  }

  /** Get a part from the library by ID */
  getPart(partId: string): CharacterPart | undefined {
    return this.partsLibrary.get(partId);
  }

  /** Get all parts for a specific slot */
  getPartsForSlot(slot: SlotType): CharacterPart[] {
    return Array.from(this.partsLibrary.values()).filter(p => p.slot === slot);
  }

  /** Swap a part on a character. Returns true if successful. */
  swapPart(characterId: string, newPartId: string): boolean {
    const character = this.characters.get(characterId);
    const part = this.partsLibrary.get(newPartId);
    if (!character || !part) return false;

    character.slots[part.slot] = part;
    return true;
  }

  /** Remove a part from a character slot */
  removePart(characterId: string, slot: SlotType): boolean {
    const character = this.characters.get(characterId);
    if (!character) return false;

    character.slots[slot] = null;
    return true;
  }

  /** Clone a character config (for creating variants) */
  cloneCharacter(sourceId: string, newId: string): CharacterConfig | undefined {
    const source = this.characters.get(sourceId);
    if (!source) return undefined;

    const clone: CharacterConfig = {
      ...source,
      id: newId,
      slots: { ...source.slots },
    };
    this.characters.set(newId, clone);
    return clone;
  }

  /** Register a custom part in the library */
  registerPart(part: CharacterPart): void {
    this.partsLibrary.set(part.id, part);
  }

  /** Get all parts in the library */
  getAllParts(): CharacterPart[] {
    return Array.from(this.partsLibrary.values());
  }

  /** Get the rendering data for a character (all non-null slots) */
  getRenderParts(characterId: string): CharacterPart[] {
    const character = this.characters.get(characterId);
    if (!character) return [];

    return Object.values(character.slots).filter((p): p is CharacterPart => p !== null);
  }
}

export const characterManager = new CharacterManager();
