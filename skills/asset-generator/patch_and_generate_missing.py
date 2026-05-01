import json
import os
from pathlib import Path

# Paths
JSON_PATH = Path("docs/UIUX/all_85_card_prompts.json")
CHECKPOINT_PATH = Path("scripts/generation_checkpoint.json")

# 1. Load existing prompts
with open(JSON_PATH, "r", encoding="utf-8") as f:
    prompts = json.load(f)

# 2. Add Patrons (if not already there)
existing_names = [p["name"] for p in prompts]
patrons = [
    {"name": "Bhaal", "attribute": "Dark/Infernal", "desc": "The Lord of Murder, terrifying skull-like visage, blood, daggers"},
    {"name": "Myrkul", "attribute": "Dark/Nature", "desc": "The Lord of Bones, massive skeleton, green necrotic fire, scythe"},
    {"name": "Bane", "attribute": "Infernal/Arcane", "desc": "The Lord of Darkness, imposing tyrant in spiked black armor, green glowing fist"},
    {"name": "Selûne", "attribute": "Radiant/Nature", "desc": "The Moonmaiden, divine silver light, stars, serene and powerful"},
    {"name": "Shar", "attribute": "Dark/Radiant", "desc": "The Nightsinger, absolute darkness, purple magical void, eclipse"},
    {"name": "Mystra", "attribute": "Arcane/Radiant", "desc": "The Mother of all Magic, swirling weave energy, powerful human goddess"},
    {"name": "Oghma", "attribute": "Arcane/Radiant/Nature", "desc": "The Lord of Knowledge, floating scrolls, divine wisdom"},
    {"name": "Vlaakith", "attribute": "Arcane/Dark", "desc": "The Undying Queen of the Githyanki, ancient undead githyanki lich-queen, furious expression"},
    {"name": "Silvanus", "attribute": "Nature/Radiant", "desc": "The Oak Father, massive ancient tree-ent god, primal nature magic"},
    {"name": "Umberlee", "attribute": "Nature/Arcane/Dark", "desc": "The Bitch Queen of the Depths, raging ocean waves, furious sea goddess"},
    {"name": "Lathander", "attribute": "Radiant/Infernal", "desc": "The Morninglord, brilliant dawn sunlight, golden armor, fierce divine power"},
    {"name": "Kelemvor", "attribute": "Dark/Radiant/Arcane", "desc": "The Lord of the Dead, stern judge, grey scales, balance of souls"},
    {"name": "Jergal", "attribute": "Dark/Radiant/Nature", "desc": "Withers, The Final Scribe, ancient skeletal scribe, golden mask, writing in the book of the dead"},
    {"name": "Asmodeus", "attribute": "Infernal/Dark/Arcane", "desc": "The Supreme Master of the Nine Hells, handsome but terrifying devil king, hellfire, dark pacts"},
    {"name": "Zariel", "attribute": "Infernal/Radiant", "desc": "The Fallen Archangel of Avernus, blazing infernal sword, burning angel wings, wrathful"},
    {"name": "Raphael", "attribute": "Infernal/Arcane/Nature", "desc": "The Dealmaker, handsome devil in noble clothing, smug expression, hellfire in background"},
    {"name": "The Absolute", "attribute": "Dark/Infernal/Radiant", "desc": "The Grand Design, massive brain with tentacles, glowing purple illithid energy"},
    {"name": "High Harpers", "attribute": "Nature/Radiant/Arcane", "desc": "Those who harp for balance, a secretive order of mages and rangers, silver harp symbol magically glowing in the dark"},
    {"name": "The Zhentarim", "attribute": "Dark/Infernal/Nature", "desc": "The Black Network, shadowy mercenaries, dark alleyway, winged snake symbol glowing magically"},
    {"name": "Eilistraee", "attribute": "Radiant/Arcane/Nature", "desc": "The Dark Maiden of the Drow, beautiful drow goddess dancing with a silver sword under the moonlight"}
]

for p in patrons:
    if p["name"] not in existing_names:
        prompt_text = f"An edge-to-edge full canvas pure 2D illustration of {p['name']}, {p['desc']} from Baldurs Gate 3. Pure 2D digital art that fills the ENTIRE canvas. No 3D perspectives of physical frames, no canvas edges. Highly detailed, cinematic lighting, dark fantasy masterpiece. No borders, no frames, absolutely no text, no letters, no words, no runes anywhere on the artwork."
        prompts.append({
            "id": f"patron_{p['name'].lower().replace(' ', '_')}",
            "name": p["name"],
            "tier": "Patron",
            "attribute": p["attribute"],
            "prompt": prompt_text
        })

# 3. Patch bad prompts
bad_ids = []
patch_map = {
    "Sazza": "An edge-to-edge full canvas pure 2D portrait of Sazza, the captive female goblin in Baldurs Gate 3. Distinct goblin anatomical features: green skin, sharp teeth, pointed ears, devious smirk. Pure 2D digital art that fills the ENTIRE canvas edge-to-edge. Must NOT look like a physical painting hanging on a wall, NO 3D angles, NO drawn metallic/stone picture frames or borders, no canvas edges. Absolutely no text.",
    "Hope": "An edge-to-edge full canvas pure 2D portrait of Hope, the female dwarf cleric imprisoned in the House of Hope in Baldurs Gate 3. Distinct dwarven anatomical features: short sturdy build, round face. She wears dirty, ragged cleric robes and has golden glowing shackles on her wrists. Her hair is wild, but her facial expression is fiercely hopeful and slightly manic. Cinematic lighting, hellfire in the background. No frames, no borders, absolutely no text.",
    "Lord Enver Gortash": "An edge-to-edge full canvas pure 2D portrait of Lord Enver Gortash, the Chosen of Bane in Baldurs Gate 3. He has messy, unruly dark hair, a handsome but exhausted and arrogant face, wearing an extremely ornate black and gold nobleman coat intricately lined with mechanical gears and infernal iron. Cinematic lighting, dark red aura. No frames, no borders, absolutely no text.",
    "Scratch": "An edge-to-edge full canvas pure 2D portrait of Scratch the dog in Baldurs Gate 3, depicted in a highly gritty, dark fantasy style. He is a loyal white hound standing bravely in a dark, ominous, shadowy forest. The mood must be serious and dark fantasy, not a bright cartoon. Cinematic lighting. No frames, no borders, absolutely no text.",
    "Balthazar": "An edge-to-edge full canvas pure 2D portrait of Balthazar, the grotesque undead necromancer in Baldurs Gate 3. Pale stitched skin, vile and menacing expression. CRITICAL RULE: DO NOT draw any runes, words, or letters on his face or anywhere in the image. No text allowed. Pure 2D illustration. No frames, no borders, absolutely no text.",
    "Zhentarim Hideout": "An edge-to-edge full canvas pure 2D illustration of the Zhentarim Hideout in Baldurs Gate 3. A dark, secretive cavern filled with shadowy rogues. The atmosphere is tense and gritty. CRITICAL RULE: DO NOT draw any text, letters, or words on any barrels, crates, or signs. Absolutely NO TEXT in the image. No frames, no borders.",
    "Crown of Karsus": "An edge-to-edge full canvas pure 2D illustration of the Crown of Karsus hovering in the air from Baldurs Gate 3. A massive, jagged magical crown forged of netherese metal, radiating intense crimson magical power. CRITICAL RULE: DO NOT draw any runes, text, letters, or symbols on the crown's metal bands. The metal must be plain but magical. No text anywhere. No frames, no borders.",
    "Harper Stash": "An edge-to-edge full canvas pure 2D illustration of a hidden Harper Stash in the dark forests of Baldurs Gate 3. A sturdy, ancient chest glowing with subtle magical blue light in the dark. Do not use real-world symbols. Gritty dark fantasy mood. No frames, no borders, absolutely no text.",
    "Blighted Village": "An edge-to-edge full canvas pure 2D illustration of the Blighted Village in Baldurs Gate 3. Dark, gloomy, ruined settlement overrun by menacing shadows. Pure 2D illustration. No text, no frames, no borders.",
    "Grymforge": "An edge-to-edge full canvas pure 2D illustration of Grymforge in Baldurs Gate 3. A massive, ancient underground duergar fortress built over rivers of glowing magma. Gritty dark fantasy, pure 2D illustration. No text, no frames, no borders."
}

for i, p in enumerate(prompts):
    if p["name"] in patch_map:
        prompts[i]["prompt"] = patch_map[p["name"]]
        bad_ids.append(p["id"])

# Save updated prompts
with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(prompts, f, indent=2, ensure_ascii=False)
print(f"Updated {JSON_PATH} with {len(prompts)} total prompts.")

# 4. Remove bad IDs from checkpoint
if CHECKPOINT_PATH.exists():
    with open(CHECKPOINT_PATH, "r", encoding="utf-8") as f:
        try:
            completed = set(json.load(f))
        except:
            completed = set()
            
    original_len = len(completed)
    for bid in bad_ids:
        if bid in completed:
            completed.remove(bid)
            
    with open(CHECKPOINT_PATH, "w", encoding="utf-8") as f:
        json.dump(list(completed), f)
    print(f"Removed {original_len - len(completed)} items from checkpoint. Remaining completed: {len(completed)}")
else:
    print("No checkpoint found.")
