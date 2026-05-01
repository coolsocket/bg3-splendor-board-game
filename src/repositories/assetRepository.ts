import assetMapping from './assetMapping.json';

const GCS_STATIC_BASE = 'https://storage.googleapis.com/bg3-splendor-static-assets';

export const AssetRepository = {
  getAvatar(name: string): string | null {
    if (name === 'Gale') return `${GCS_STATIC_BASE}/portraits/gale_portrait.png`;
    if (name === 'Astarion') return `${GCS_STATIC_BASE}/portraits/astarion_portrait.png`;
    if (name === 'Shadowheart') return `${GCS_STATIC_BASE}/portraits/shadowheart_portrait.png`;
    return null;
  },
  
  /**
   * Get card or patron art using a unique assetId.
   * Fetches from GCS for better performance and smaller deployment size.
   */
  getArt(assetId: string): string | null {
    const cleanId = assetId.replace('_(withers)', '');
    const relativePath = (assetMapping as any)[cleanId];
    if (relativePath) {
      return `${GCS_STATIC_BASE}/cards/${relativePath}`;
    }
    return null;
  },

  getCursor(): string {
    return `${GCS_STATIC_BASE}/ui/dagger_cursor.png`;
  },
  getHero(): string {
    return `${GCS_STATIC_BASE}/ui/hero.png`;
  },
  getParchmentTexture(): string {
    return `${GCS_STATIC_BASE}/ui/parchment_texture.png`;
  }
};

if (typeof window !== 'undefined') {
  (window as any).__ASSET_REPOSITORY__ = AssetRepository;
}
