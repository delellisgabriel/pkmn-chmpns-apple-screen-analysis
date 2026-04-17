// Pokemon Champions roster — 210 base forms + 59 Mega Evolution forms
// Source: Serebii / Bulbapedia / The Gamer (Season M-1 launch roster)

export const CHAMPIONS_BASE: string[] = [
  // Gen I
  'Venusaur', 'Charizard', 'Blastoise', 'Beedrill', 'Pidgeot', 'Arbok',
  'Pikachu', 'Raichu', 'Raichu-Alola', 'Clefable', 'Ninetales', 'Ninetales-Alola',
  'Arcanine', 'Arcanine-Hisui', 'Alakazam', 'Machamp', 'Victreebel', 'Slowbro',
  'Slowbro-Galar', 'Gengar', 'Kangaskhan', 'Starmie', 'Pinsir', 'Tauros',
  'Tauros-Paldea-Combat', 'Tauros-Paldea-Blaze', 'Tauros-Paldea-Aqua',
  'Gyarados', 'Ditto', 'Vaporeon', 'Jolteon', 'Flareon', 'Aerodactyl', 'Snorlax', 'Dragonite',

  // Gen II
  'Meganium', 'Typhlosion', 'Typhlosion-Hisui', 'Feraligatr', 'Ariados', 'Ampharos',
  'Azumarill', 'Politoed', 'Espeon', 'Umbreon', 'Slowking', 'Slowking-Galar',
  'Forretress', 'Steelix', 'Scizor', 'Heracross', 'Skarmory', 'Houndoom', 'Tyranitar',

  // Gen III
  'Pelipper', 'Gardevoir', 'Sableye', 'Aggron', 'Medicham', 'Manectric', 'Sharpedo',
  'Camerupt', 'Torkoal', 'Altaria', 'Milotic', 'Castform', 'Banette', 'Chimecho',
  'Absol', 'Glalie',

  // Gen IV
  'Torterra', 'Infernape', 'Empoleon', 'Luxray', 'Roserade', 'Rampardos', 'Bastiodon',
  'Lopunny', 'Spiritomb', 'Garchomp', 'Lucario', 'Hippowdon', 'Toxicroak', 'Abomasnow',
  'Weavile', 'Rhyperior', 'Leafeon', 'Glaceon', 'Gliscor', 'Mamoswine', 'Gallade',
  'Froslass', 'Rotom',

  // Gen V
  'Serperior', 'Emboar', 'Samurott', 'Samurott-Hisui', 'Watchog', 'Liepard', 'Simisage',
  'Simisear', 'Simipour', 'Excadrill', 'Audino', 'Conkeldurr', 'Whimsicott', 'Krookodile',
  'Cofagrigus', 'Garbodor', 'Zoroark', 'Zoroark-Hisui', 'Reuniclus', 'Vanilluxe', 'Emolga',
  'Chandelure', 'Beartic', 'Stunfisk', 'Golurk', 'Hydreigon', 'Volcarona',

  // Gen VI
  'Chesnaught', 'Delphox', 'Greninja', 'Diggersby', 'Talonflame', 'Vivillon', 'Floette',
  'Florges', 'Pangoro', 'Furfrou', 'Meowstic', 'Aegislash-Shield', 'Aromatisse', 'Slurpuff',
  'Clawitzer', 'Heliolisk', 'Tyrantrum', 'Aurorus', 'Sylveon', 'Hawlucha', 'Dedenne',
  'Goodra', 'Klefki', 'Trevenant', 'Gourgeist', 'Avalugg', 'Noivern',

  // Gen VII
  'Decidueye', 'Decidueye-Hisui', 'Incineroar', 'Primarina', 'Toucannon', 'Crabominable',
  'Lycanroc', 'Toxapex', 'Mudsdale', 'Araquanid', 'Salazzle', 'Tsareena', 'Oranguru',
  'Passimian', 'Mimikyu', 'Drampa', 'Kommo-o',

  // Gen VIII
  'Corviknight', 'Flapple', 'Appletun', 'Sandaconda', 'Polteageist', 'Hatterene', 'Mr. Rime',
  'Runerigus', 'Alcremie', 'Morpeko', 'Dragapult', 'Wyrdeer', 'Kleavor', 'Basculegion',
  'Basculegion-F', 'Sneasler',

  // Gen IX
  'Meowscarada', 'Skeledirge', 'Quaquaval', 'Maushold', 'Garganacl', 'Armarouge', 'Ceruledge',
  'Bellibolt', 'Scovillain', 'Espathra', 'Tinkaton', 'Palafin', 'Orthworm', 'Glimmora',
  'Farigiraf', 'Kingambit', 'Sinistcha', 'Archaludon', 'Hydrapple',
];

// Mega Evolution forms available in Pokemon Champions (subset of Gen 7 mega data)
export const CHAMPIONS_MEGAS: string[] = [
  'Abomasnow-Mega', 'Absol-Mega', 'Aerodactyl-Mega', 'Aggron-Mega', 'Alakazam-Mega',
  'Altaria-Mega', 'Ampharos-Mega', 'Audino-Mega', 'Banette-Mega', 'Beedrill-Mega',
  'Blastoise-Mega', 'Camerupt-Mega', 'Charizard-Mega-X', 'Charizard-Mega-Y',
  'Gallade-Mega', 'Garchomp-Mega', 'Gardevoir-Mega', 'Gengar-Mega', 'Glalie-Mega',
  'Gyarados-Mega', 'Heracross-Mega', 'Houndoom-Mega', 'Kangaskhan-Mega', 'Lopunny-Mega',
  'Lucario-Mega', 'Manectric-Mega', 'Medicham-Mega', 'Pidgeot-Mega', 'Pinsir-Mega',
  'Sableye-Mega', 'Scizor-Mega', 'Sharpedo-Mega', 'Slowbro-Mega', 'Steelix-Mega',
  'Tyranitar-Mega', 'Venusaur-Mega',
];

export const CHAMPIONS_ALL = [...CHAMPIONS_BASE, ...CHAMPIONS_MEGAS].sort();
