import { createCard, createPatron } from '../domain/logic';
import { ResourceType, CardTier, CardType } from '../domain/models';

/**
 * Tier 1 Cards
 */
export const TIER_1_CARDS = [
    createCard('t1_sacred_flame', 'Sacred Flame', CardTier.TIER_1, CardType.SPELL, { [ResourceType.RADIANT_GEM]: 3 }, ResourceType.RADIANT_GEM, 0, 'A cantrip that calls down divine light upon foes'),
    createCard('t1_magic_missile', 'Magic Missile', CardTier.TIER_1, CardType.SPELL, { [ResourceType.ARCANE_CRYSTAL]: 2, [ResourceType.RADIANT_GEM]: 1 }, ResourceType.ARCANE_CRYSTAL, 0, 'Arcane projectiles that never miss their target'),
    createCard('t1_goodberry', 'Goodberry', CardTier.TIER_1, CardType.SPELL, { [ResourceType.NATURES_BLESSING]: 3 }, ResourceType.NATURES_BLESSING, 0, "Nature's bounty provides healing and sustenance"),
    createCard('t1_hellish_rebuke', 'Hellish Rebuke', CardTier.TIER_1, CardType.SPELL, { [ResourceType.INFERNAL_IRON]: 2, [ResourceType.DARK_QUARTZ]: 1 }, ResourceType.INFERNAL_IRON, 0, 'Infernal flames punish those who dare strike you'),
    createCard('t1_hex', 'Hex', CardTier.TIER_1, CardType.SPELL, { [ResourceType.DARK_QUARTZ]: 3 }, ResourceType.DARK_QUARTZ, 0, "A warlock's curse that weakens their victim"),
    createCard('t1_potion_healing', 'Potion of Healing', CardTier.TIER_1, CardType.ITEM, { [ResourceType.RADIANT_GEM]: 2, [ResourceType.NATURES_BLESSING]: 1 }, ResourceType.RADIANT_GEM, 0, 'A standard healing potion, lifesaver of adventurers'),
    createCard('t1_thieves_tools', "Thieves' Tools", CardTier.TIER_1, CardType.ITEM, { [ResourceType.DARK_QUARTZ]: 2, [ResourceType.ARCANE_CRYSTAL]: 1 }, ResourceType.DARK_QUARTZ, 0, 'Essential equipment for any self-respecting rogue'),
    createCard('t1_acid_vial', "Alchemist's Fire", CardTier.TIER_1, CardType.ITEM, { [ResourceType.INFERNAL_IRON]: 3 }, ResourceType.INFERNAL_IRON, 0, 'A volatile substance that bursts into flames on impact'),
    createCard('t1_shield', 'Shield of Faith', CardTier.TIER_1, CardType.SPELL, { [ResourceType.RADIANT_GEM]: 1, [ResourceType.ARCANE_CRYSTAL]: 2 }, ResourceType.ARCANE_CRYSTAL, 0, 'Divine or arcane protection against harm'),
    createCard('t1_animal_friendship', 'Speak with Animals', CardTier.TIER_1, CardType.SPELL, { [ResourceType.NATURES_BLESSING]: 2, [ResourceType.RADIANT_GEM]: 1 }, ResourceType.NATURES_BLESSING, 0, 'Commune with the beasts of the wild'),
    createCard('t1_charm_person', 'Charm Person', CardTier.TIER_1, CardType.SPELL, { [ResourceType.ARCANE_CRYSTAL]: 1, [ResourceType.NATURES_BLESSING]: 2 }, ResourceType.ARCANE_CRYSTAL, 1, 'Beguile a humanoid with magical charm'),
    createCard('t1_guiding_bolt', 'Guiding Bolt', CardTier.TIER_1, CardType.SPELL, { [ResourceType.RADIANT_GEM]: 2, [ResourceType.ARCANE_CRYSTAL]: 2 }, ResourceType.RADIANT_GEM, 1, 'A radiant strike that illuminates the target'),
];

/**
 * Tier 2 Cards
 */
export const TIER_2_CARDS = [
    createCard('t2_fireball', 'Fireball', CardTier.TIER_2, CardType.SPELL, { [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.INFERNAL_IRON]: 2 }, ResourceType.ARCANE_CRYSTAL, 2, "The wizard's most iconic spell of destruction"),
    createCard('t2_spirit_guardians', 'Spirit Guardians', CardTier.TIER_2, CardType.SPELL, { [ResourceType.RADIANT_GEM]: 4, [ResourceType.NATURES_BLESSING]: 1 }, ResourceType.RADIANT_GEM, 2, 'Spectral guardians protect the faithful'),
    createCard('t2_call_lightning', 'Call Lightning', CardTier.TIER_2, CardType.SPELL, { [ResourceType.NATURES_BLESSING]: 4, [ResourceType.ARCANE_CRYSTAL]: 1 }, ResourceType.NATURES_BLESSING, 2, "Channel the storm's fury against your foes"),
    createCard('t2_hunger_of_hadar', 'Hunger of Hadar', CardTier.TIER_2, CardType.SPELL, { [ResourceType.DARK_QUARTZ]: 3, [ResourceType.INFERNAL_IRON]: 2 }, ResourceType.DARK_QUARTZ, 2, 'Summon the dark void that devours all within'),
    createCard('t2_smite', 'Divine Smite', CardTier.TIER_2, CardType.SKILL, { [ResourceType.RADIANT_GEM]: 3, [ResourceType.INFERNAL_IRON]: 2 }, ResourceType.RADIANT_GEM, 2, 'Channel divine wrath through your weapon'),
    createCard('t2_sneak_attack', 'Sneak Attack', CardTier.TIER_2, CardType.SKILL, { [ResourceType.DARK_QUARTZ]: 4, [ResourceType.NATURES_BLESSING]: 1 }, ResourceType.DARK_QUARTZ, 2, 'Strike from the shadows with deadly precision'),
    createCard('t2_sussur_dagger', 'Sussur Dagger', CardTier.TIER_2, CardType.ITEM, { [ResourceType.DARK_QUARTZ]: 2, [ResourceType.ARCANE_CRYSTAL]: 3 }, ResourceType.ARCANE_CRYSTAL, 2, 'A blade forged from sussur bark, silencing magic'),
    createCard('t2_everburn_blade', 'Everburn Blade', CardTier.TIER_2, CardType.ITEM, { [ResourceType.INFERNAL_IRON]: 4, [ResourceType.RADIANT_GEM]: 1 }, ResourceType.INFERNAL_IRON, 2, "Commander Zhalk's greatsword, wreathed in eternal flame"),
    createCard('t2_elixir_giant_str', 'Elixir of Hill Giant Strength', CardTier.TIER_2, CardType.ITEM, { [ResourceType.NATURES_BLESSING]: 3, [ResourceType.INFERNAL_IRON]: 2 }, ResourceType.NATURES_BLESSING, 2, 'Grants the mighty strength of a hill giant'),
    createCard('t2_ring_protection', 'Ring of Protection', CardTier.TIER_2, CardType.ITEM, { [ResourceType.RADIANT_GEM]: 2, [ResourceType.ARCANE_CRYSTAL]: 2, [ResourceType.NATURES_BLESSING]: 1 }, ResourceType.RADIANT_GEM, 3, 'A magical ring that wards against harm'),
];

/**
 * Tier 3 Cards
 */
export const TIER_3_CARDS = [
    createCard('t3_meteor_swarm', 'Meteor Swarm', CardTier.TIER_3, CardType.SPELL, { [ResourceType.ARCANE_CRYSTAL]: 5, [ResourceType.INFERNAL_IRON]: 3 }, ResourceType.ARCANE_CRYSTAL, 4, 'Call down meteors from the heavens to devastate foes'),
    createCard('t3_mass_heal', 'Mass Healing Word', CardTier.TIER_3, CardType.SPELL, { [ResourceType.RADIANT_GEM]: 6, [ResourceType.NATURES_BLESSING]: 2 }, ResourceType.RADIANT_GEM, 4, 'Divine power heals all allies at once'),
    createCard('t3_shapechange', 'Shapechange', CardTier.TIER_3, CardType.SPELL, { [ResourceType.NATURES_BLESSING]: 6, [ResourceType.ARCANE_CRYSTAL]: 2 }, ResourceType.NATURES_BLESSING, 4, 'Transform into any creature, gaining their form and power'),
    createCard('t3_power_word_kill', 'Power Word Kill', CardTier.TIER_3, CardType.SPELL, { [ResourceType.DARK_QUARTZ]: 5, [ResourceType.ARCANE_CRYSTAL]: 3 }, ResourceType.DARK_QUARTZ, 4, 'A single word of power that ends a life instantly'),
    createCard('t3_blood_of_lathander', 'Blood of Lathander', CardTier.TIER_3, CardType.ITEM, { [ResourceType.RADIANT_GEM]: 7 }, ResourceType.RADIANT_GEM, 5, 'The legendary mace of the Morninglord himself'),
    createCard('t3_nyrulna', 'Nyrulna', CardTier.TIER_3, CardType.ITEM, { [ResourceType.INFERNAL_IRON]: 6, [ResourceType.NATURES_BLESSING]: 2 }, ResourceType.INFERNAL_IRON, 5, "A legendary trident that returns to the wielder's hand"),
    createCard('t3_netherstone', 'Netherstone', CardTier.TIER_3, CardType.ITEM, { [ResourceType.DARK_QUARTZ]: 7 }, ResourceType.DARK_QUARTZ, 5, 'One of the three netherstones, artifacts of immense power'),
    createCard('t3_orphic_hammer', 'Orphic Hammer', CardTier.TIER_3, CardType.ITEM, { [ResourceType.ARCANE_CRYSTAL]: 4, [ResourceType.RADIANT_GEM]: 3 }, ResourceType.ARCANE_CRYSTAL, 5, 'Can shatter any prison, even those made of souls'),
    createCard('t3_silver_sword', 'Silver Sword of the Astral Plane', CardTier.TIER_3, CardType.ITEM, { [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.RADIANT_GEM]: 3, [ResourceType.DARK_QUARTZ]: 1 }, ResourceType.ARCANE_CRYSTAL, 5, 'The sacred weapon of the githyanki people'),
    createCard('t3_illithid_powers', 'Awakened Illithid Powers', CardTier.TIER_3, CardType.SKILL, { [ResourceType.DARK_QUARTZ]: 4, [ResourceType.ARCANE_CRYSTAL]: 4 }, ResourceType.DARK_QUARTZ, 5, "Fully embrace the tadpole's power for ultimate abilities"),
];

/**
 * Patrons
 */
export const WITHERS = createPatron('withers', 'Withers', { [ResourceType.RADIANT_GEM]: 3, [ResourceType.DARK_QUARTZ]: 3 }, 3, 'The enigmatic skeleton who dwells in your camp, observing all');
export const RAPHAEL = createPatron('raphael', 'Raphael', { [ResourceType.INFERNAL_IRON]: 4, [ResourceType.ARCANE_CRYSTAL]: 2 }, 3, 'A charming devil who always has a contract ready');
export const VLAAKITH = createPatron('vlaakith', 'Vlaakith', { [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.DARK_QUARTZ]: 3 }, 3, 'The eternal ruler of the githyanki, feared across the planes');
export const MYSTRA = createPatron('mystra', 'Mystra', { [ResourceType.ARCANE_CRYSTAL]: 4, [ResourceType.NATURES_BLESSING]: 2 }, 3, 'The goddess who embodies the Weave itself');
export const THE_ABSOLUTE = createPatron('the_absolute', 'The Absolute', { [ResourceType.INFERNAL_IRON]: 2, [ResourceType.DARK_QUARTZ]: 2, [ResourceType.RADIANT_GEM]: 2 }, 3, 'The mysterious entity commanding the Cult of the Absolute');
export const SELUNE = createPatron('selune', 'Selûne', { [ResourceType.RADIANT_GEM]: 4, [ResourceType.NATURES_BLESSING]: 2 }, 3, 'The Moonmaiden, goddess of light in darkness');
export const SHAR = createPatron('shar', 'Shar', { [ResourceType.DARK_QUARTZ]: 4, [ResourceType.INFERNAL_IRON]: 2 }, 3, 'The Lady of Loss, seeking to unmake all creation');
export const BHAAL = createPatron('bhaal', 'Bhaal', { [ResourceType.DARK_QUARTZ]: 3, [ResourceType.INFERNAL_IRON]: 3 }, 3, 'The dread Lord of Murder, father of Bhaalspawn');

export const ALL_PATRONS = [WITHERS, RAPHAEL, VLAAKITH, MYSTRA, THE_ABSOLUTE, SELUNE, SHAR, BHAAL];
