import { type ResourceType } from '../TokenTypes';

export const ANIMATION_COLORS = {
  resources: {
    RADIANT_GEM: '#ca8a04', // Gold
    ARCANE_CRYSTAL: '#0284c7', // Blue
    NATURES_BLESSING: '#16a34a', // Green
    INFERNAL_IRON: '#dc2626', // Red
    DARK_QUARTZ: '#9333ea', // Purple
    TRUE_SOUL_TADPOLE: '#db2777', // Pink
  } as Record<ResourceType, string>,
  magicCircle: {
    glow: 'rgba(147,51,234,0.8)',
    outer: '#a855f7',
    inner: '#d8b4fe',
    shapes: '#e9d5ff',
  },
  buyGlow: '#fbbf24'
};

export const PHYSICS_CONFIG = {
  particle: {
    defaultLifeBase: 60,
    defaultLifeVariance: 40,
    impactLife: 40,
    impactBurstCount: 15,
  },
  transfer: {
    cleanupDelay: 2500,
    trailCleanupDelay: 800,
    bounceDuration: 0.8,
  },
  flight: {
    cleanupDelay: 2000,
    reserveDuration: 1,
    buyDuration: 0.8,
    defaultDuration: 1.2,
  }
};
