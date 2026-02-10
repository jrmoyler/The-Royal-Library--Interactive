/**
 * AssetMapper - Maps 2D PNG placeholder assets to modular low-poly 3D definitions.
 *
 * Each original hotlinked PNG is analyzed for theme/silhouette/color and mapped to
 * a procedural low-poly 3D asset specification that can be rendered by Three.js.
 */

export interface LowPoly3DAsset {
  id: string;
  /** Original PNG URL being replaced */
  originalPng: string;
  /** Human-readable description extracted from the PNG theme */
  description: string;
  /** Dominant color palette extracted from the PNG theme */
  palette: { primary: string; secondary: string; accent: string };
  /** Low-poly geometry specification */
  geometry: GeometrySpec;
  /** Material properties */
  material: MaterialSpec;
}

export interface GeometrySpec {
  type: 'box' | 'cylinder' | 'sphere' | 'capsule' | 'octahedron' | 'torus' | 'cone' | 'composite';
  dimensions: number[];
  /** For composite geometry - array of child parts */
  parts?: GeometryPart[];
}

export interface GeometryPart {
  type: 'box' | 'cylinder' | 'sphere' | 'capsule' | 'octahedron' | 'torus' | 'cone';
  dimensions: number[];
  position: [number, number, number];
  rotation?: [number, number, number];
  material?: MaterialSpec;
}

export interface MaterialSpec {
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  transparent?: boolean;
  opacity?: number;
}

// ── Original PNG Assets from the codebase ──
const ORIGINAL_ASSETS = {
  START_SCREEN: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&q=80&w=2000',
  BACKGROUND: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000',
  MAGE: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&q=80&w=800',
  SCOUT: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
  GUARDIAN: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
  BOOK_TEXTURE: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
  INTERIOR: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000',
};

// ── Low-poly 3D replacement definitions ──

/** Bookshelf module - replaces backdrop PNG with modular shelving units */
export const BOOKSHELF_ASSET: LowPoly3DAsset = {
  id: 'bookshelf',
  originalPng: ORIGINAL_ASSETS.INTERIOR,
  description: 'Modular low-poly bookshelf with glowing rune accents',
  palette: { primary: '#2a1810', secondary: '#4a3020', accent: '#00f0ff' },
  geometry: {
    type: 'composite',
    dimensions: [2, 4, 0.5],
    parts: [
      // Main frame
      { type: 'box', dimensions: [2, 4, 0.5], position: [0, 2, 0], material: { color: '#2a1810', metalness: 0.3, roughness: 0.8 } },
      // Shelves
      { type: 'box', dimensions: [1.8, 0.08, 0.45], position: [0, 0.8, 0], material: { color: '#4a3020', roughness: 0.9 } },
      { type: 'box', dimensions: [1.8, 0.08, 0.45], position: [0, 1.6, 0], material: { color: '#4a3020', roughness: 0.9 } },
      { type: 'box', dimensions: [1.8, 0.08, 0.45], position: [0, 2.4, 0], material: { color: '#4a3020', roughness: 0.9 } },
      { type: 'box', dimensions: [1.8, 0.08, 0.45], position: [0, 3.2, 0], material: { color: '#4a3020', roughness: 0.9 } },
      // Decorative rune strip
      { type: 'box', dimensions: [0.1, 3.6, 0.02], position: [0, 2, 0.26], material: { color: '#00f0ff', emissive: '#00f0ff', emissiveIntensity: 3, metalness: 1 } },
    ],
  },
  material: { color: '#2a1810', metalness: 0.3, roughness: 0.8 },
};

/** Floor tile module */
export const FLOOR_TILE_ASSET: LowPoly3DAsset = {
  id: 'floor-tile',
  originalPng: ORIGINAL_ASSETS.BACKGROUND,
  description: 'Stone floor tile with embedded circuit pattern',
  palette: { primary: '#0a0e17', secondary: '#151c2c', accent: '#00f0ff' },
  geometry: {
    type: 'composite',
    dimensions: [4, 0.2, 4],
    parts: [
      { type: 'box', dimensions: [4, 0.2, 4], position: [0, 0, 0], material: { color: '#0a0e17', metalness: 0.9, roughness: 0.2 } },
      { type: 'box', dimensions: [3.6, 0.01, 0.05], position: [0, 0.11, 0], material: { color: '#00f0ff', emissive: '#00f0ff', emissiveIntensity: 5, transparent: true, opacity: 0.3 } },
      { type: 'box', dimensions: [0.05, 0.01, 3.6], position: [0, 0.11, 0], material: { color: '#00f0ff', emissive: '#00f0ff', emissiveIntensity: 5, transparent: true, opacity: 0.3 } },
    ],
  },
  material: { color: '#0a0e17', metalness: 0.9, roughness: 0.2 },
};

/** Pillar module */
export const PILLAR_ASSET: LowPoly3DAsset = {
  id: 'pillar',
  originalPng: ORIGINAL_ASSETS.INTERIOR,
  description: 'Modular stone pillar with energy conduit',
  palette: { primary: '#1a2130', secondary: '#2a3040', accent: '#00f0ff' },
  geometry: {
    type: 'composite',
    dimensions: [1.5, 8, 1.5],
    parts: [
      // Base
      { type: 'box', dimensions: [2, 0.5, 2], position: [0, 0.25, 0], material: { color: '#1a2130', metalness: 0.8 } },
      // Column
      { type: 'cylinder', dimensions: [0.6, 0.6, 7, 8], position: [0, 4, 0], material: { color: '#1a2130', metalness: 0.8 } },
      // Capital
      { type: 'box', dimensions: [1.8, 0.4, 1.8], position: [0, 7.7, 0], material: { color: '#1a2130', metalness: 0.8 } },
      // Energy conduit
      { type: 'cylinder', dimensions: [0.08, 0.08, 6.5, 8], position: [0, 4, 0.65], material: { color: '#00f0ff', emissive: '#00f0ff', emissiveIntensity: 8 } },
    ],
  },
  material: { color: '#1a2130', metalness: 0.8, roughness: 0.3 },
};

/** Reading desk / lectern */
export const LECTERN_ASSET: LowPoly3DAsset = {
  id: 'lectern',
  originalPng: ORIGINAL_ASSETS.BOOK_TEXTURE,
  description: 'Low-poly reading lectern for book display',
  palette: { primary: '#3a2515', secondary: '#5a4030', accent: '#ffaa00' },
  geometry: {
    type: 'composite',
    dimensions: [0.8, 1.2, 0.6],
    parts: [
      // Pedestal
      { type: 'cylinder', dimensions: [0.15, 0.3, 1.0, 6], position: [0, 0.5, 0], material: { color: '#3a2515', roughness: 0.8 } },
      // Top surface (angled)
      { type: 'box', dimensions: [0.8, 0.06, 0.6], position: [0, 1.05, 0], rotation: [-0.3, 0, 0], material: { color: '#5a4030', roughness: 0.7 } },
      // Base
      { type: 'cylinder', dimensions: [0.4, 0.4, 0.1, 6], position: [0, 0.05, 0], material: { color: '#3a2515', roughness: 0.8 } },
    ],
  },
  material: { color: '#3a2515', roughness: 0.8 },
};

/** Central energy fountain / data core */
export const DATA_CORE_ASSET: LowPoly3DAsset = {
  id: 'data-core',
  originalPng: ORIGINAL_ASSETS.BACKGROUND,
  description: 'Central energy data core with hovering rings',
  palette: { primary: '#001533', secondary: '#002255', accent: '#00f0ff' },
  geometry: {
    type: 'composite',
    dimensions: [4, 20, 4],
    parts: [
      // Base platform
      { type: 'cylinder', dimensions: [3, 3.5, 0.4, 8], position: [0, 0.2, 0], material: { color: '#0a0e17', metalness: 1, roughness: 0.1 } },
      // Core orb
      { type: 'sphere', dimensions: [1.5, 8, 8], position: [0, 3, 0], material: { color: '#00f0ff', emissive: '#00f0ff', emissiveIntensity: 10, transparent: true, opacity: 0.6 } },
      // Energy beam
      { type: 'cylinder', dimensions: [0.2, 0.2, 20, 8], position: [0, 10, 0], material: { color: '#ffffff', emissive: '#00f0ff', emissiveIntensity: 20 } },
    ],
  },
  material: { color: '#001533' },
};

// ── Asset Registry ──

const ASSET_REGISTRY: Map<string, LowPoly3DAsset> = new Map([
  ['bookshelf', BOOKSHELF_ASSET],
  ['floor-tile', FLOOR_TILE_ASSET],
  ['pillar', PILLAR_ASSET],
  ['lectern', LECTERN_ASSET],
  ['data-core', DATA_CORE_ASSET],
]);

/**
 * AssetMapper provides centralized access to all low-poly 3D asset definitions.
 * Maps original PNG assets to their procedural 3D replacements.
 */
export class AssetMapper {
  private registry: Map<string, LowPoly3DAsset>;

  constructor() {
    this.registry = new Map(ASSET_REGISTRY);
  }

  /** Get a specific asset by ID */
  getAsset(id: string): LowPoly3DAsset | undefined {
    return this.registry.get(id);
  }

  /** Get all registered assets */
  getAllAssets(): LowPoly3DAsset[] {
    return Array.from(this.registry.values());
  }

  /** Get asset that replaces a specific PNG URL */
  getReplacementFor(pngUrl: string): LowPoly3DAsset[] {
    return this.getAllAssets().filter(a => a.originalPng === pngUrl);
  }

  /** Register a new asset definition */
  registerAsset(asset: LowPoly3DAsset): void {
    this.registry.set(asset.id, asset);
  }

  /** Get mapping report: original PNG -> 3D replacement */
  getMappingReport(): Array<{ originalPng: string; replacementId: string; description: string }> {
    return this.getAllAssets().map(a => ({
      originalPng: a.originalPng,
      replacementId: a.id,
      description: a.description,
    }));
  }

  /** Get the original asset URLs */
  static getOriginalAssets() {
    return { ...ORIGINAL_ASSETS };
  }
}

export const assetMapper = new AssetMapper();
