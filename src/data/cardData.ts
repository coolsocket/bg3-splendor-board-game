import { ResourceType, CardType, CardTier, type Card } from '../domain/models';
import { createCard } from '../domain/logic';

// ----------------------------------------------------------------------------
// 1. Abstracted Card Template
// ----------------------------------------------------------------------------
export interface CardTemplate {
    id: string;
    assetId: string;
    name: string;
    type?: CardType;
    bonus: ResourceType;
    points?: number;
    cost: Partial<Record<ResourceType, number>>;
    description?: string;
}

export function buildCards(templates: CardTemplate[], tier: CardTier): Card[] {
    return templates.map(t => {
        const card = createCard(
            t.id,
            t.assetId,
            t.name,
            tier,
            t.type || CardType.SKILL,
            t.cost,
            t.bonus,
            t.points || 0,
            t.description
        );
        return card;
    });
}

// ----------------------------------------------------------------------------
// TIER 1: Act 1 & 2 Minor Factions, NPCs, Encounters, and Locations (30 Cards)
// ----------------------------------------------------------------------------
export const tier1Templates: CardTemplate[] = [
    { id: 't1_r1', name: 'Dammon', assetId: 'dammon', bonus: ResourceType.RADIANT_GEM, cost: { [ResourceType.RADIANT_GEM]: 1, [ResourceType.ARCANE_CRYSTAL]: 1, [ResourceType.NATURES_BLESSING]: 1, [ResourceType.INFERNAL_IRON]: 1, [ResourceType.DARK_QUARTZ]: 1 }, description: 'The skilled tiefling hellrider smith.' },
    { id: 't1_r2', name: 'Zevlor', assetId: 'zevlor', bonus: ResourceType.RADIANT_GEM, cost: { [ResourceType.ARCANE_CRYSTAL]: 2, [ResourceType.NATURES_BLESSING]: 1, [ResourceType.INFERNAL_IRON]: 1, [ResourceType.DARK_QUARTZ]: 1 }, description: 'Former Hellrider leading the refugees.' },
    { id: 't1_r3', name: 'Harper Stash', assetId: 'harper_stash', bonus: ResourceType.RADIANT_GEM, cost: { [ResourceType.NATURES_BLESSING]: 2, [ResourceType.INFERNAL_IRON]: 2 }, description: 'Hidden supplies left by the Harpers.' },
    { id: 't1_r4', name: 'Barcus Wroot', assetId: 'barcus_wroot', bonus: ResourceType.RADIANT_GEM, cost: { [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.DARK_QUARTZ]: 1 }, description: 'A determined Ironhand Gnome.' },
    { id: 't1_r5', name: 'Flaming Fist', assetId: 'flaming_fist', bonus: ResourceType.RADIANT_GEM, cost: { [ResourceType.NATURES_BLESSING]: 3 }, description: 'Mercenaries enforcing the law of the Gate.' },
    { id: 't1_r6', name: 'Selûnite Outpost', assetId: 'selûnite_outpost', bonus: ResourceType.RADIANT_GEM, points: 1, cost: { [ResourceType.INFERNAL_IRON]: 4 }, description: 'An ancient temple warding off the Underdark.' },
    { id: 't1_a1', name: 'Volo', assetId: 'volo', bonus: ResourceType.ARCANE_CRYSTAL, cost: { [ResourceType.RADIANT_GEM]: 1, [ResourceType.ARCANE_CRYSTAL]: 1, [ResourceType.NATURES_BLESSING]: 1, [ResourceType.INFERNAL_IRON]: 1, [ResourceType.DARK_QUARTZ]: 1 }, description: 'The famous bard and "expert" on everything.' },
    { id: 't1_a2', name: 'Alfira', assetId: 'alfira', bonus: ResourceType.ARCANE_CRYSTAL, cost: { [ResourceType.NATURES_BLESSING]: 2, [ResourceType.INFERNAL_IRON]: 1, [ResourceType.DARK_QUARTZ]: 1, [ResourceType.RADIANT_GEM]: 1 }, description: 'A sweet tiefling bard searching for a song.' },
    { id: 't1_a3', name: 'Omeluum', assetId: 'omeluum', bonus: ResourceType.ARCANE_CRYSTAL, cost: { [ResourceType.INFERNAL_IRON]: 2, [ResourceType.DARK_QUARTZ]: 2 }, description: 'A rogue mind flayer studying the arcane.' },
    { id: 't1_a4', name: 'Blurg', assetId: 'blurg', bonus: ResourceType.ARCANE_CRYSTAL, cost: { [ResourceType.NATURES_BLESSING]: 3, [ResourceType.RADIANT_GEM]: 1 }, description: 'Hobgoblin scholar of the Society of Brilliance.' },
    { id: 't1_a5', name: 'Iron Flask', assetId: 'iron_flask', bonus: ResourceType.ARCANE_CRYSTAL, cost: { [ResourceType.INFERNAL_IRON]: 3 }, description: 'Zhentarim cargo containing a dangerous beast.' },
    { id: 't1_a6', name: 'Arcane Tower', assetId: 'arcane_tower', bonus: ResourceType.ARCANE_CRYSTAL, points: 1, cost: { [ResourceType.DARK_QUARTZ]: 4 }, description: "Lenore's isolated laboratory in the Underdark." },
    { id: 't1_n1', name: 'Emerald Grove', assetId: 'emerald_grove', bonus: ResourceType.NATURES_BLESSING, cost: { [ResourceType.RADIANT_GEM]: 1, [ResourceType.ARCANE_CRYSTAL]: 1, [ResourceType.NATURES_BLESSING]: 1, [ResourceType.INFERNAL_IRON]: 1, [ResourceType.DARK_QUARTZ]: 1 }, description: 'A sanctuary shielded by druidic magic.' },
    { id: 't1_n2', name: 'Scratch', assetId: 'scratch', bonus: ResourceType.NATURES_BLESSING, cost: { [ResourceType.INFERNAL_IRON]: 2, [ResourceType.DARK_QUARTZ]: 1, [ResourceType.RADIANT_GEM]: 1, [ResourceType.ARCANE_CRYSTAL]: 1 }, description: 'The best boy in all the Sword Coast.' },
    { id: 't1_n3', name: 'Owlbear Cub', assetId: 'owlbear_cub', bonus: ResourceType.NATURES_BLESSING, cost: { [ResourceType.DARK_QUARTZ]: 2, [ResourceType.RADIANT_GEM]: 2 }, description: 'A fierce but adorable orphaned beast.' },
    { id: 't1_n4', name: 'Sovereign Spaw', assetId: 'sovereign_spaw', bonus: ResourceType.NATURES_BLESSING, cost: { [ResourceType.INFERNAL_IRON]: 3, [ResourceType.ARCANE_CRYSTAL]: 1 }, description: 'The peaceful leader of the Myconid Colony.' },
    { id: 't1_n5', name: 'Sussur Tree', assetId: 'sussur_tree', bonus: ResourceType.NATURES_BLESSING, cost: { [ResourceType.DARK_QUARTZ]: 3 }, description: 'A massive anti-magic tree in the depths.' },
    { id: 't1_n6', name: 'Sovereign Glut', assetId: 'sovereign_glut', bonus: ResourceType.NATURES_BLESSING, points: 1, cost: { [ResourceType.RADIANT_GEM]: 4 }, description: 'A deposed myconid seeking violent revenge.' },
    { id: 't1_i1', name: 'Goblin Camp', assetId: 'goblin_camp', bonus: ResourceType.INFERNAL_IRON, cost: { [ResourceType.RADIANT_GEM]: 1, [ResourceType.ARCANE_CRYSTAL]: 1, [ResourceType.NATURES_BLESSING]: 1, [ResourceType.INFERNAL_IRON]: 1, [ResourceType.DARK_QUARTZ]: 1 }, description: 'A raucous stronghold of the Absolute.' },
    { id: 't1_i2', name: 'Dror Ragzlin', assetId: 'dror_ragzlin', bonus: ResourceType.INFERNAL_IRON, cost: { [ResourceType.DARK_QUARTZ]: 2, [ResourceType.RADIANT_GEM]: 1, [ResourceType.ARCANE_CRYSTAL]: 1, [ResourceType.NATURES_BLESSING]: 1 }, description: 'The hobgoblin warlord.' },
    { id: 't1_i3', name: 'Grymforge', assetId: 'grymforge', bonus: ResourceType.INFERNAL_IRON, cost: { [ResourceType.RADIANT_GEM]: 2, [ResourceType.ARCANE_CRYSTAL]: 2 }, description: 'An ancient Sharran fortress over magma.' },
    { id: 't1_i4', name: 'Adamantine Forge', assetId: 'adamantine_forge', bonus: ResourceType.INFERNAL_IRON, cost: { [ResourceType.DARK_QUARTZ]: 3, [ResourceType.NATURES_BLESSING]: 1 }, description: 'A legendary forge capable of shaping mithral.' },
    { id: 't1_i5', name: 'Zhentarim Hideout', assetId: 'zhentarim_hideout', bonus: ResourceType.INFERNAL_IRON, cost: { [ResourceType.RADIANT_GEM]: 3 }, description: 'A black market smuggling ring.' },
    { id: 't1_i6', name: 'Sazza', assetId: 'sazza', bonus: ResourceType.INFERNAL_IRON, points: 1, cost: { [ResourceType.ARCANE_CRYSTAL]: 4 }, description: 'A captive goblin with information.' },
    { id: 't1_d1', name: 'Blighted Village', assetId: 'blighted_village', bonus: ResourceType.DARK_QUARTZ, cost: { [ResourceType.RADIANT_GEM]: 1, [ResourceType.ARCANE_CRYSTAL]: 1, [ResourceType.NATURES_BLESSING]: 1, [ResourceType.INFERNAL_IRON]: 1, [ResourceType.DARK_QUARTZ]: 1 }, description: 'An abandoned settlement overrun by goblins.' },
    { id: 't1_d2', name: 'Auntie Ethel', assetId: 'auntie_ethel', bonus: ResourceType.DARK_QUARTZ, cost: { [ResourceType.RADIANT_GEM]: 2, [ResourceType.ARCANE_CRYSTAL]: 1, [ResourceType.NATURES_BLESSING]: 1, [ResourceType.INFERNAL_IRON]: 1 }, description: 'A sweet old lady, or something far worse.' },
    { id: 't1_d3', name: 'Duergar Intruders', assetId: 'duergar_intruders', bonus: ResourceType.DARK_QUARTZ, cost: { [ResourceType.ARCANE_CRYSTAL]: 2, [ResourceType.NATURES_BLESSING]: 2 }, description: 'Cruel slavers of the Underdark.' },
    { id: 't1_d4', name: 'Phase Spider Matriarch', assetId: 'phase_spider_matriarch', bonus: ResourceType.DARK_QUARTZ, cost: { [ResourceType.RADIANT_GEM]: 3, [ResourceType.INFERNAL_IRON]: 1 }, description: 'Queen of the Whispering Depths.' },
    { id: 't1_d5', name: 'True Soul Nere', assetId: 'true_soul_nere', bonus: ResourceType.DARK_QUARTZ, cost: { [ResourceType.ARCANE_CRYSTAL]: 3 }, description: 'An arrogant drow trapped in a cave-in.' },
    { id: 't1_d6', name: 'Spectator', assetId: 'spectator', bonus: ResourceType.DARK_QUARTZ, points: 1, cost: { [ResourceType.NATURES_BLESSING]: 4 }, description: 'A lesser beholder guarding ancient secrets.' },
];

export const tier2Templates: CardTemplate[] = [
    { id: 't2_r1', name: 'Isobel', assetId: 'isobel', bonus: ResourceType.RADIANT_GEM, points: 3, cost: { [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.NATURES_BLESSING]: 3, [ResourceType.INFERNAL_IRON]: 3 }, description: 'The radiant cleric shielding Last Light from the curse.' },
    { id: 't2_r2', name: 'Dame Aylin', assetId: 'dame_aylin', bonus: ResourceType.RADIANT_GEM, points: 2, cost: { [ResourceType.NATURES_BLESSING]: 5, [ResourceType.DARK_QUARTZ]: 2 }, description: 'The Nightsong, immortal daughter of Selûne.' },
    { id: 't2_r3', name: 'Last Light Inn', assetId: 'last_light_inn', bonus: ResourceType.RADIANT_GEM, points: 2, cost: { [ResourceType.INFERNAL_IRON]: 4, [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.DARK_QUARTZ]: 2 }, description: 'The only safe haven in the shadow curse.' },
    { id: 't2_r4', name: 'Art Cullagh', assetId: 'art_cullagh', bonus: ResourceType.RADIANT_GEM, points: 3, cost: { [ResourceType.DARK_QUARTZ]: 6 }, description: 'A sleeping Flaming Fist humming a forgotten tune.' },
    { id: 't2_a1', name: 'Moonrise Towers', assetId: 'moonrise_towers', bonus: ResourceType.ARCANE_CRYSTAL, points: 3, cost: { [ResourceType.NATURES_BLESSING]: 3, [ResourceType.INFERNAL_IRON]: 3, [ResourceType.RADIANT_GEM]: 3 }, description: 'The ominous stronghold of the Absolute.' },
    { id: 't2_a2', name: 'Wulbren Bongle', assetId: 'wulbren_bongle', bonus: ResourceType.ARCANE_CRYSTAL, points: 2, cost: { [ResourceType.INFERNAL_IRON]: 5, [ResourceType.NATURES_BLESSING]: 2 }, description: 'A brilliant but arrogant imprisoned runepowder expert.' },
    { id: 't2_a3', name: 'Mind Flayer Colony', assetId: 'mind_flayer_colony', bonus: ResourceType.ARCANE_CRYSTAL, points: 2, cost: { [ResourceType.DARK_QUARTZ]: 4, [ResourceType.RADIANT_GEM]: 3, [ResourceType.INFERNAL_IRON]: 2 }, description: 'The illithid hive hidden beneath Moonrise.' },
    { id: 't2_a4', name: 'Oubliette', assetId: 'oubliette', bonus: ResourceType.ARCANE_CRYSTAL, points: 3, cost: { [ResourceType.RADIANT_GEM]: 6 }, description: 'The flesh-wrought prison beneath the towers.' },
    { id: 't2_n1', name: 'Thaniel', assetId: 'thaniel', bonus: ResourceType.NATURES_BLESSING, points: 3, cost: { [ResourceType.INFERNAL_IRON]: 3, [ResourceType.DARK_QUARTZ]: 3, [ResourceType.ARCANE_CRYSTAL]: 3 }, description: 'The spirit of the land, corrupted by shadow.' },
    { id: 't2_n2', name: 'Oliver', assetId: 'oliver', bonus: ResourceType.NATURES_BLESSING, points: 2, cost: { [ResourceType.DARK_QUARTZ]: 5, [ResourceType.RADIANT_GEM]: 2 }, description: "The manifestation of the shadow curse's playful cruelty." },
    { id: 't2_n3', name: 'He Who Was', assetId: 'he_who_was', bonus: ResourceType.NATURES_BLESSING, points: 2, cost: { [ResourceType.RADIANT_GEM]: 4, [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.DARK_QUARTZ]: 2 }, description: 'A shadar-kai enacting justice upon the dead.' },
    { id: 't2_n4', name: 'Shambling Mound', assetId: 'shambling_mound', bonus: ResourceType.NATURES_BLESSING, points: 3, cost: { [ResourceType.ARCANE_CRYSTAL]: 6 }, description: 'A horrifying amalgamation of shadow-cursed plant life.' },
    { id: 't2_i1', name: 'Yurgir', assetId: 'yurgir', bonus: ResourceType.INFERNAL_IRON, points: 3, cost: { [ResourceType.DARK_QUARTZ]: 3, [ResourceType.RADIANT_GEM]: 3, [ResourceType.NATURES_BLESSING]: 3 }, description: "An orthon bound by a trickster's contract in the Gauntlet of Shar." },
    { id: 't2_i2', name: "Kar'niss", assetId: "kar'niss", bonus: ResourceType.INFERNAL_IRON, points: 2, cost: { [ResourceType.RADIANT_GEM]: 5, [ResourceType.ARCANE_CRYSTAL]: 2 }, description: 'A cursed drider guiding the cultists with a Moonlantern.' },
    { id: 't2_i3', name: "Z'rell", assetId: "z'rell", bonus: ResourceType.INFERNAL_IRON, points: 2, cost: { [ResourceType.ARCANE_CRYSTAL]: 4, [ResourceType.DARK_QUARTZ]: 3, [ResourceType.RADIANT_GEM]: 2 }, description: 'A ruthless half-orc disciple of Ketheric Thorm.' },
    { id: 't2_i4', name: 'Marcus', assetId: 'marcus', bonus: ResourceType.INFERNAL_IRON, points: 3, cost: { [ResourceType.NATURES_BLESSING]: 6 }, description: 'A winged Flaming Fist traitor serving the Absolute.' },
    { id: 't2_d1', name: 'Balthazar', assetId: 'balthazar', bonus: ResourceType.DARK_QUARTZ, points: 3, cost: { [ResourceType.RADIANT_GEM]: 3, [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.INFERNAL_IRON]: 3 }, description: 'A grotesque necromancer serving Ketheric.' },
    { id: 't2_d2', name: 'Malus Thorm', assetId: 'malus_thorm', bonus: ResourceType.DARK_QUARTZ, points: 2, cost: { [ResourceType.ARCANE_CRYSTAL]: 5, [ResourceType.INFERNAL_IRON]: 2 }, description: 'The horrifying, maddened surgeon of the House of Healing.' },
    { id: 't2_d3', name: 'Gerringothe Thorm', assetId: 'gerringothe_thorm', bonus: ResourceType.DARK_QUARTZ, points: 2, cost: { [ResourceType.NATURES_BLESSING]: 4, [ResourceType.RADIANT_GEM]: 3, [ResourceType.ARCANE_CRYSTAL]: 2 }, description: 'The gold-obsessed Toll Collector.' },
    { id: 't2_d4', name: 'Thisobald Thorm', assetId: 'thisobald_thorm', bonus: ResourceType.DARK_QUARTZ, points: 3, cost: { [ResourceType.INFERNAL_IRON]: 6 }, description: 'The bloated, toxic Brewer of the Waning Moon.' },
];

export const tier3Templates: CardTemplate[] = [
    { id: 't3_r1', name: 'Hope', assetId: 'hope', bonus: ResourceType.RADIANT_GEM, points: 3, cost: { [ResourceType.ARCANE_CRYSTAL]: 2, [ResourceType.NATURES_BLESSING]: 3, [ResourceType.INFERNAL_IRON]: 4, [ResourceType.DARK_QUARTZ]: 5 }, description: 'A captive cleric keeping faith alive in Hell.' },
    { id: 't3_r2', name: 'Ansur', assetId: 'ansur', bonus: ResourceType.RADIANT_GEM, points: 5, cost: { [ResourceType.NATURES_BLESSING]: 6, [ResourceType.INFERNAL_IRON]: 6 }, description: 'The Heart of the Gate, a legendary bronze dragon.' },
    { id: 't3_r3', name: 'Duke Ravengard', assetId: 'duke_ravengard', bonus: ResourceType.RADIANT_GEM, points: 4, cost: { [ResourceType.INFERNAL_IRON]: 7 }, description: "Grand Duke of Baldur's Gate, father to Wyll." },
    { id: 't3_a1', name: 'The Emperor', assetId: 'the_emperor', bonus: ResourceType.ARCANE_CRYSTAL, points: 3, cost: { [ResourceType.NATURES_BLESSING]: 2, [ResourceType.INFERNAL_IRON]: 3, [ResourceType.DARK_QUARTZ]: 4, [ResourceType.RADIANT_GEM]: 5 }, description: 'A manipulative mind flayer residing in the prism.' },
    { id: 't3_a2', name: 'Prince Orpheus', assetId: 'prince_orpheus', bonus: ResourceType.ARCANE_CRYSTAL, points: 5, cost: { [ResourceType.INFERNAL_IRON]: 6, [ResourceType.DARK_QUARTZ]: 6 }, description: 'The true heir of Gith, prisoner of the astral plane.' },
    { id: 't3_a3', name: 'Crown of Karsus', assetId: 'crown_of_karsus', bonus: ResourceType.ARCANE_CRYSTAL, points: 4, cost: { [ResourceType.DARK_QUARTZ]: 7 }, description: 'A netherese artifact capable of dominating a god.' },
    { id: 't3_n1', name: 'Mystic Carrion', assetId: 'mystic_carrion', bonus: ResourceType.NATURES_BLESSING, points: 3, cost: { [ResourceType.INFERNAL_IRON]: 2, [ResourceType.DARK_QUARTZ]: 3, [ResourceType.RADIANT_GEM]: 4, [ResourceType.ARCANE_CRYSTAL]: 5 }, description: 'An ancient mummy lord commanding the dead.' },
    { id: 't3_n2', name: "Water Queen's House", assetId: "water_queen's_house", bonus: ResourceType.NATURES_BLESSING, points: 5, cost: { [ResourceType.DARK_QUARTZ]: 6, [ResourceType.RADIANT_GEM]: 6 }, description: "The grand temple of Umberlee in Baldur's Gate." },
    { id: 't3_n3', name: 'The Guildhall', assetId: 'the_guildhall', bonus: ResourceType.NATURES_BLESSING, points: 4, cost: { [ResourceType.RADIANT_GEM]: 7 }, description: "The center of Nine-Fingers' underground empire." },
    { id: 't3_i1', name: 'Lord Enver Gortash', assetId: 'lord_enver_gortash', bonus: ResourceType.INFERNAL_IRON, points: 3, cost: { [ResourceType.DARK_QUARTZ]: 2, [ResourceType.RADIANT_GEM]: 3, [ResourceType.ARCANE_CRYSTAL]: 4, [ResourceType.NATURES_BLESSING]: 5 }, description: 'Archduke of Baldur\'s Gate, Chosen of Bane.' },
    { id: 't3_i2', name: 'Steel Watch Titan', assetId: 'steel_watch_titan', bonus: ResourceType.INFERNAL_IRON, points: 5, cost: { [ResourceType.RADIANT_GEM]: 6, [ResourceType.ARCANE_CRYSTAL]: 6 }, description: 'A colossal mechanical enforcer of Gortash.' },
    { id: 't3_i3', name: 'House of Hope', assetId: 'house_of_hope', bonus: ResourceType.INFERNAL_IRON, points: 4, cost: { [ResourceType.ARCANE_CRYSTAL]: 7 }, description: "Raphael's opulent, inescapable domain in Avernus." },
    { id: 't3_d1', name: 'Sarevok Anchev', assetId: 'sarevok_anchev', bonus: ResourceType.DARK_QUARTZ, points: 3, cost: { [ResourceType.RADIANT_GEM]: 2, [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.NATURES_BLESSING]: 4, [ResourceType.INFERNAL_IRON]: 5 }, description: 'The terrifying leader of the Murder Tribunal.' },
    { id: 't3_d2', name: 'Orin the Red', assetId: 'orin_the_red', bonus: ResourceType.DARK_QUARTZ, points: 5, cost: { [ResourceType.ARCANE_CRYSTAL]: 6, [ResourceType.NATURES_BLESSING]: 6 }, description: 'A shapeshifting assassin, Chosen of Bhaal.' },
    { id: 't3_d3', name: 'Cazador Szarr', assetId: 'cazador_szarr', bonus: ResourceType.DARK_QUARTZ, points: 4, cost: { [ResourceType.NATURES_BLESSING]: 7 }, description: 'A vampire lord attempting the Black Mass ritual.' },
];

export const GENERATED_TIER_1_CARDS = buildCards(tier1Templates, CardTier.TIER_1);
export const GENERATED_TIER_2_CARDS = buildCards(tier2Templates, CardTier.TIER_2);
export const GENERATED_TIER_3_CARDS = buildCards(tier3Templates, CardTier.TIER_3);

import { createPatron } from '../domain/logic';
import type { Patron } from '../domain/models';

export interface PatronTemplate {
    id: string;
    assetId: string;
    name: string;
    points: number;
    requirements: Partial<Record<ResourceType, number>>;
    description?: string;
}

export function buildPatrons(templates: PatronTemplate[]): Patron[] {
    return templates.map(t => {
        return createPatron(t.id, t.assetId, t.name, t.requirements, t.points, t.description);
    });
}

export const patronTemplates: PatronTemplate[] = [
    { id: 'p_bhaal', name: 'Bhaal', assetId: 'bhaal', points: 3, requirements: { [ResourceType.DARK_QUARTZ]: 4, [ResourceType.INFERNAL_IRON]: 4 }, description: 'The Lord of Murder.' },
    { id: 'p_myrkul', name: 'Myrkul', assetId: 'myrkul', points: 3, requirements: { [ResourceType.DARK_QUARTZ]: 4, [ResourceType.NATURES_BLESSING]: 4 }, description: 'The Lord of Bones.' },
    { id: 'p_bane', name: 'Bane', assetId: 'bane', points: 3, requirements: { [ResourceType.INFERNAL_IRON]: 4, [ResourceType.ARCANE_CRYSTAL]: 4 }, description: 'The Lord of Darkness.' },
    { id: 'p_selune', name: 'Selûne', assetId: 'selûne', points: 3, requirements: { [ResourceType.RADIANT_GEM]: 4, [ResourceType.NATURES_BLESSING]: 4 }, description: 'The Moonmaiden.' },
    { id: 'p_shar', name: 'Shar', assetId: 'shar', points: 3, requirements: { [ResourceType.DARK_QUARTZ]: 4, [ResourceType.RADIANT_GEM]: 4 }, description: 'The Nightsinger.' },
    { id: 'p_mystra', name: 'Mystra', assetId: 'mystra', points: 3, requirements: { [ResourceType.ARCANE_CRYSTAL]: 4, [ResourceType.RADIANT_GEM]: 4 }, description: 'The Mother of all Magic.' },
    { id: 'p_oghma', name: 'Oghma', assetId: 'oghma', points: 3, requirements: { [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.RADIANT_GEM]: 3, [ResourceType.NATURES_BLESSING]: 3 }, description: 'The Lord of Knowledge.' },
    { id: 'p_vlaakith', name: 'Vlaakith', assetId: 'vlaakith', points: 3, requirements: { [ResourceType.ARCANE_CRYSTAL]: 4, [ResourceType.DARK_QUARTZ]: 4 }, description: 'The Undying Queen of the Githyanki.' },
    { id: 'p_silvanus', name: 'Silvanus', assetId: 'silvanus', points: 3, requirements: { [ResourceType.NATURES_BLESSING]: 4, [ResourceType.RADIANT_GEM]: 4 }, description: 'The Oak Father.' },
    { id: 'p_umberlee', name: 'Umberlee', assetId: 'umberlee', points: 3, requirements: { [ResourceType.NATURES_BLESSING]: 3, [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.DARK_QUARTZ]: 3 }, description: 'The Bitch Queen of the Depths.' },
    { id: 'p_lathander', name: 'Lathander', assetId: 'lathander', points: 3, requirements: { [ResourceType.RADIANT_GEM]: 4, [ResourceType.INFERNAL_IRON]: 4 }, description: 'The Morninglord.' },
    { id: 'p_kelemvor', name: 'Kelemvor', assetId: 'kelemvor', points: 3, requirements: { [ResourceType.DARK_QUARTZ]: 3, [ResourceType.RADIANT_GEM]: 3, [ResourceType.ARCANE_CRYSTAL]: 3 }, description: 'The Lord of the Dead.' },
    { id: 'p_jergal', name: 'Jergal (Withers)', assetId: 'jergal', points: 3, requirements: { [ResourceType.DARK_QUARTZ]: 3, [ResourceType.RADIANT_GEM]: 3, [ResourceType.NATURES_BLESSING]: 3 }, description: 'The Final Scribe.' },
    { id: 'p_asmodeus', name: 'Asmodeus', assetId: 'asmodeus', points: 3, requirements: { [ResourceType.INFERNAL_IRON]: 3, [ResourceType.DARK_QUARTZ]: 3, [ResourceType.ARCANE_CRYSTAL]: 3 }, description: 'The Supreme Master of the Nine Hells.' },
    { id: 'p_zariel', name: 'Zariel', assetId: 'zariel', points: 3, requirements: { [ResourceType.INFERNAL_IRON]: 4, [ResourceType.RADIANT_GEM]: 4 }, description: 'The Fallen Archangel of Avernus.' },
    { id: 'p_raphael', name: 'Raphael', assetId: 'raphael', points: 3, requirements: { [ResourceType.INFERNAL_IRON]: 3, [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.NATURES_BLESSING]: 3 }, description: 'The Dealmaker.' },
    { id: 'p_absolute', name: 'The Absolute', assetId: 'the_absolute', points: 3, requirements: { [ResourceType.DARK_QUARTZ]: 3, [ResourceType.INFERNAL_IRON]: 3, [ResourceType.RADIANT_GEM]: 3 }, description: 'The Grand Design.' },
    { id: 'p_harpers', name: 'High Harpers', assetId: 'high_harpers', points: 3, requirements: { [ResourceType.NATURES_BLESSING]: 3, [ResourceType.RADIANT_GEM]: 3, [ResourceType.ARCANE_CRYSTAL]: 3 }, description: 'Those who harp for balance.' },
    { id: 'p_zhentarim', name: 'The Zhentarim', assetId: 'the_zhentarim', points: 3, requirements: { [ResourceType.DARK_QUARTZ]: 3, [ResourceType.INFERNAL_IRON]: 3, [ResourceType.NATURES_BLESSING]: 3 }, description: 'The Black Network.' },
    { id: 'p_eilistraee', name: 'Eilistraee', assetId: 'eilistraee', points: 3, requirements: { [ResourceType.RADIANT_GEM]: 3, [ResourceType.ARCANE_CRYSTAL]: 3, [ResourceType.NATURES_BLESSING]: 3 }, description: 'The Dark Maiden of the Drow.' },
];

export const GENERATED_PATRONS = buildPatrons(patronTemplates);
