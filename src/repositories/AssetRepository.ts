import galeImg from '../assets/gale_portrait.png';
import astarionImg from '../assets/astarion_portrait.png';
import daggerCursor from '../assets/dagger_cursor.png';
import heroImg from '../assets/hero.png';
import parchmentTexture from '../assets/parchment_texture.png';

export const AssetRepository = {
  getAvatar(name: string): string | null {
    if (name === 'Gale') return galeImg;
    if (name === 'Astarion') return astarionImg;
    return null;
  },
  getCursor(): string {
    return daggerCursor;
  },
  getHero(): string {
    return heroImg;
  },
  getParchmentTexture(): string {
    return parchmentTexture;
  }
};
