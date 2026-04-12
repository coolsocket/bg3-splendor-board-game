export type ResourceType =
  | 'RADIANT_GEM'
  | 'ARCANE_CRYSTAL'
  | 'NATURES_BLESSING'
  | 'INFERNAL_IRON'
  | 'DARK_QUARTZ'
  | 'TRUE_SOUL_TADPOLE';

export const getDisplayName = (type: ResourceType) => {
  switch (type) {
    case 'RADIANT_GEM': return 'Fairy Gold';
    case 'ARCANE_CRYSTAL': return 'Enchanted Agate';
    case 'NATURES_BLESSING': return 'Poison Bottle';
    case 'INFERNAL_IRON': return 'Soul Coin';
    case 'DARK_QUARTZ': return 'Parasite';
    case 'TRUE_SOUL_TADPOLE': return 'Astral Prism';
    default: return type;
  }
};
