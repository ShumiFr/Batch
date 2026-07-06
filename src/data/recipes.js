/* ---------------------------------------------------------
   BIBLIOTHÈQUE DE RECETTES & PRÉPARATIONS MAISON
   -----------------------------------------------------------
   Base locale dans laquelle l'algorithme de planning pioche.
   Toutes les recettes respectent les règles du projet :
   - Aucun ingrédient interdit : aubergine, courgette, carotte,
     tomate cuite/chaude. (La tomate crue reste autorisée.)
   - Aucun NOVA 4, maximum 3 NOVA 3 par recette.
   - Tout est fait maison (bouillons, sauces, vinaigrettes, yaourts).
   Quantités prévues pour 2 personnes.

   Rayons utilisés pour la liste de courses :
   "Fruits & légumes", "Boucherie / Poissonnerie", "Crémerie",
   "Épicerie", "Boulangerie".
--------------------------------------------------------- */

// unit vaut "piece" pour les articles à l'unité (ex : 1 poulet), sinon
// une unité classique ("g", "kg", "ml", "cs", "cc", "botte", "gousse"...).
const ING = (name, amount, unit, aisle) => ({ name, amount, unit, aisle });

/* ---------- Préparations maison (bouillons, sauces...) ---------- */
export const PREPS = {
  bouillonVolaille: {
    id: "bouillonVolaille",
    name: "Bouillon de volaille maison",
    quantity: "≈ 1,5 L",
    storage: "Au frais 4 jours, ou congelé en portions",
    expiry: "4 jours au frais",
    ingredients: [
      ING("Oignon", 1, "piece", "Fruits & légumes"),
      ING("Céleri branche", 1, "branche", "Fruits & légumes"),
      ING("Laurier", 2, "feuille", "Épicerie"),
    ],
    steps: [
      "Mettre la carcasse de volaille dans un grand faitout avec l'oignon coupé en deux, le céleri et le laurier.",
      "Couvrir d'eau froide, porter à frémissement et laisser cuire 1 h à petit feu, écumer. Filtrer et réserver.",
    ],
  },
  bouillonLegumes: {
    id: "bouillonLegumes",
    name: "Bouillon de légumes maison",
    quantity: "≈ 1,5 L",
    storage: "Au frais 4 jours, ou congelé en portions",
    expiry: "4 jours au frais",
    ingredients: [
      ING("Oignon", 1, "piece", "Fruits & légumes"),
      ING("Poireau", 1, "piece", "Fruits & légumes"),
      ING("Laurier", 2, "feuille", "Épicerie"),
    ],
    steps: [
      "Couvrir d'eau froide l'oignon, le vert de poireau et le laurier.",
      "Porter à frémissement 40 min, filtrer et réserver.",
    ],
  },
  vinaigrette: {
    id: "vinaigrette",
    name: "Vinaigrette maison",
    quantity: "1 petit bocal",
    storage: "Au frais 1 semaine",
    expiry: "7 jours au frais",
    ingredients: [
      ING("Huile d'olive", 60, "ml", "Épicerie"),
      ING("Moutarde", 1, "cc", "Épicerie"),
      ING("Vinaigre", 20, "ml", "Épicerie"),
    ],
    steps: [
      "Fouetter la moutarde avec le vinaigre, une pincée de sel, puis émulsionner avec l'huile d'olive.",
    ],
  },
  bechamel: {
    id: "bechamel",
    name: "Béchamel maison",
    quantity: "≈ 500 ml",
    storage: "Au frais 3 jours",
    expiry: "3 jours au frais",
    ingredients: [
      ING("Beurre", 40, "g", "Crémerie"),
      ING("Farine", 40, "g", "Épicerie"),
      ING("Lait", 500, "ml", "Crémerie"),
    ],
    steps: [
      "Faire un roux : fondre le beurre, ajouter la farine, cuire 1 min.",
      "Verser le lait peu à peu en fouettant, cuire jusqu'à épaississement, saler et muscader.",
    ],
  },
  yaourt: {
    id: "yaourt",
    name: "Yaourts maison",
    quantity: "6 pots",
    storage: "Au frais 8 jours",
    expiry: "8 jours au frais",
    ingredients: [
      ING("Lait entier", 1, "L", "Crémerie"),
      ING("Yaourt nature (ferment)", 1, "piece", "Crémerie"),
    ],
    steps: [
      "Mélanger le lait tiédi avec le yaourt ferment, répartir en pots et lancer la yaourtière (ou four à 45 °C) 8 h.",
    ],
  },
};

/* ---------- Recettes ----------
   seasons : météo pour laquelle la recette est adaptée
             ("froid", "doux", "chaud").
   protein : pour varier les protéines sur la semaine.
   preps   : ids de préparations maison nécessaires.
--------------------------------------------------------- */
export const RECIPES = [
  {
    id: "poulet-roti",
    name: "Poulet rôti aux herbes & pommes de terre",
    seasons: ["froid", "doux"],
    protein: "poulet",
    fridgeLife: "3 jours au frais",
    nutritionNote: "Protéine maigre + féculent, accompagner d'une salade verte.",
    novaNote: "NOVA 1 : poulet fermier, légumes et herbes fraîches.",
    preps: ["bouillonVolaille"],
    ingredients: [
      ING("Poulet fermier entier", 1, "piece", "Boucherie / Poissonnerie"),
      ING("Pommes de terre", 800, "g", "Fruits & légumes"),
      ING("Oignon", 2, "piece", "Fruits & légumes"),
      ING("Thym", 1, "botte", "Fruits & légumes"),
      ING("Huile d'olive", 30, "ml", "Épicerie"),
    ],
    steps: [
      "Frotter le poulet d'huile, sel et thym ; enfourner 1 h 15 à 200 °C avec les pommes de terre et les oignons.",
      "Récupérer la carcasse et les sucs pour lancer le bouillon de volaille.",
    ],
  },
  {
    id: "blanquette-poulet",
    name: "Blanquette de poulet à l'ancienne",
    seasons: ["froid"],
    protein: "poulet",
    fridgeLife: "3 jours au frais",
    nutritionNote: "Plat mijoté réconfortant, servir avec du riz complet.",
    novaNote: "NOVA 1-2 : sauce liée à la crème, sans fond industriel.",
    preps: ["bouillonVolaille"],
    ingredients: [
      ING("Blancs de poulet", 500, "g", "Boucherie / Poissonnerie"),
      ING("Champignons de Paris", 250, "g", "Fruits & légumes"),
      ING("Poireau", 2, "piece", "Fruits & légumes"),
      ING("Crème fraîche", 20, "cl", "Crémerie"),
      ING("Riz complet", 200, "g", "Épicerie"),
    ],
    steps: [
      "Pocher le poulet et les poireaux dans le bouillon de volaille 25 min.",
      "Faire revenir les champignons, lier la sauce avec la crème, servir sur le riz.",
    ],
  },
  {
    id: "salade-poulet",
    name: "Salade de poulet croquante & vinaigrette",
    seasons: ["chaud", "doux"],
    protein: "poulet",
    fridgeLife: "2 jours au frais (assembler au dernier moment)",
    nutritionNote: "Repas froid complet : protéine, crudités et féculent.",
    novaNote: "NOVA 1 : tout frais, vinaigrette maison.",
    preps: ["vinaigrette"],
    ingredients: [
      ING("Blancs de poulet", 300, "g", "Boucherie / Poissonnerie"),
      ING("Salade verte", 1, "piece", "Fruits & légumes"),
      ING("Tomates", 3, "piece", "Fruits & légumes"),
      ING("Concombre", 1, "piece", "Fruits & légumes"),
      ING("Boulgour", 150, "g", "Épicerie"),
    ],
    steps: [
      "Cuire le poulet à la poêle, laisser refroidir puis émincer.",
      "Cuire le boulgour, assembler avec les crudités et napper de vinaigrette.",
    ],
  },
  {
    id: "cabillaud-poele",
    name: "Cabillaud, pommes de terre & beurre citron",
    seasons: ["froid", "doux"],
    protein: "poisson",
    fridgeLife: "2 jours au frais",
    nutritionNote: "Poisson blanc maigre riche en protéines, féculent.",
    novaNote: "NOVA 1 : poisson frais, beurre citronné maison.",
    preps: [],
    ingredients: [
      ING("Dos de cabillaud", 2, "piece", "Boucherie / Poissonnerie"),
      ING("Pommes de terre", 500, "g", "Fruits & légumes"),
      ING("Citron", 1, "piece", "Fruits & légumes"),
      ING("Persil", 1, "botte", "Fruits & légumes"),
      ING("Beurre", 40, "g", "Crémerie"),
    ],
    steps: [
      "Cuire les pommes de terre à l'eau ou vapeur.",
      "Saisir le cabillaud, monter un beurre citron-persil et napper.",
    ],
  },
  {
    id: "tartare-saumon",
    name: "Tartare de saumon, concombre & aneth",
    seasons: ["chaud"],
    protein: "poisson",
    fridgeLife: "1 jour au frais (à consommer rapidement)",
    nutritionNote: "Cru, léger et riche en oméga-3 ; idéal quand il fait chaud.",
    novaNote: "NOVA 1 : poisson extra-frais, assaisonnement maison.",
    preps: [],
    ingredients: [
      ING("Pavé de saumon très frais", 300, "g", "Boucherie / Poissonnerie"),
      ING("Concombre", 1, "piece", "Fruits & légumes"),
      ING("Citron vert", 1, "piece", "Fruits & légumes"),
      ING("Aneth", 1, "botte", "Fruits & légumes"),
      ING("Pain complet", 4, "tranche", "Boulangerie"),
    ],
    steps: [
      "Tailler le saumon et le concombre en petits dés, assaisonner citron vert-aneth-huile.",
      "Réserver au frais, servir avec le pain grillé au moment de passer à table.",
    ],
  },
  {
    id: "papillote-poisson",
    name: "Papillote de poisson blanc & poireaux",
    seasons: ["froid", "doux"],
    protein: "poisson",
    fridgeLife: "2 jours au frais",
    nutritionNote: "Cuisson douce sans matière grasse ajoutée, légumes fondants.",
    novaNote: "NOVA 1 : poisson et légumes frais.",
    preps: [],
    ingredients: [
      ING("Filets de lieu ou merlan", 2, "piece", "Boucherie / Poissonnerie"),
      ING("Poireau", 2, "piece", "Fruits & légumes"),
      ING("Citron", 1, "piece", "Fruits & légumes"),
      ING("Pommes de terre", 400, "g", "Fruits & légumes"),
      ING("Huile d'olive", 20, "ml", "Épicerie"),
    ],
    steps: [
      "Émincer les poireaux, les répartir dans les papillotes avec le poisson et des rondelles de citron.",
      "Enfourner 20 min à 190 °C, servir avec les pommes de terre vapeur.",
    ],
  },
  {
    id: "omelette-champignons",
    name: "Omelette aux champignons & salade verte",
    seasons: ["froid", "doux", "chaud"],
    protein: "oeuf",
    fridgeLife: "2 jours au frais",
    nutritionNote: "Protéine complète rapide, accompagnée de crudités.",
    novaNote: "NOVA 1 : œufs et champignons frais.",
    preps: ["vinaigrette"],
    ingredients: [
      ING("Œufs", 6, "piece", "Crémerie"),
      ING("Champignons de Paris", 250, "g", "Fruits & légumes"),
      ING("Salade verte", 1, "piece", "Fruits & légumes"),
      ING("Persil", 1, "botte", "Fruits & légumes"),
      ING("Beurre", 20, "g", "Crémerie"),
    ],
    steps: [
      "Faire revenir les champignons, verser les œufs battus, cuire l'omelette baveuse.",
      "Assaisonner la salade avec la vinaigrette maison.",
    ],
  },
  {
    id: "oeufs-cocotte",
    name: "Œufs cocotte aux épinards",
    seasons: ["froid", "doux"],
    protein: "oeuf",
    fridgeLife: "2 jours au frais",
    nutritionNote: "Légume vert + œuf + laitage, servir avec du pain complet.",
    novaNote: "NOVA 1-2 : épinards frais, crème et œufs.",
    preps: [],
    ingredients: [
      ING("Œufs", 4, "piece", "Crémerie"),
      ING("Épinards frais", 300, "g", "Fruits & légumes"),
      ING("Crème fraîche", 15, "cl", "Crémerie"),
      ING("Pain complet", 4, "tranche", "Boulangerie"),
      ING("Beurre", 15, "g", "Crémerie"),
    ],
    steps: [
      "Faire tomber les épinards au beurre, répartir dans des ramequins avec une cuillère de crème.",
      "Casser un œuf par ramequin, enfourner 12 min à 180 °C, servir avec le pain.",
    ],
  },
  {
    id: "curry-pois-chiches",
    name: "Curry de pois chiches maison",
    seasons: ["froid", "doux"],
    protein: "legumineuse",
    fridgeLife: "4 jours au frais",
    nutritionNote: "Légumineuse riche en fibres et protéines végétales, avec riz.",
    novaNote: "NOVA 1-2 : épices en poudre, lait de coco, aucun plat préparé.",
    preps: ["bouillonLegumes"],
    ingredients: [
      ING("Pois chiches secs", 250, "g", "Épicerie"),
      ING("Lait de coco", 400, "ml", "Épicerie"),
      ING("Oignon", 2, "piece", "Fruits & légumes"),
      ING("Épinards frais", 200, "g", "Fruits & légumes"),
      ING("Riz basmati complet", 200, "g", "Épicerie"),
      ING("Curry en poudre", 2, "cc", "Épicerie"),
    ],
    steps: [
      "Faire revenir l'oignon et le curry, ajouter les pois chiches trempés et le bouillon de légumes.",
      "Verser le lait de coco, mijoter 25 min, ajouter les épinards, servir sur le riz.",
    ],
  },
  {
    id: "salade-lentilles",
    name: "Salade de lentilles, feta & herbes",
    seasons: ["chaud", "doux"],
    protein: "legumineuse",
    fridgeLife: "3 jours au frais",
    nutritionNote: "Plat froid complet : légumineuse, fromage, herbes fraîches.",
    novaNote: "NOVA 1-2 : lentilles, feta, vinaigrette maison.",
    preps: ["vinaigrette"],
    ingredients: [
      ING("Lentilles vertes", 250, "g", "Épicerie"),
      ING("Feta", 150, "g", "Crémerie"),
      ING("Tomates", 3, "piece", "Fruits & légumes"),
      ING("Oignon rouge", 1, "piece", "Fruits & légumes"),
      ING("Menthe", 1, "botte", "Fruits & légumes"),
    ],
    steps: [
      "Cuire les lentilles 20 min, refroidir.",
      "Mélanger avec la feta émiettée, les tomates, l'oignon rouge et la vinaigrette.",
    ],
  },
  {
    id: "dahl-corail",
    name: "Dahl de lentilles corail",
    seasons: ["froid", "doux"],
    protein: "legumineuse",
    fridgeLife: "4 jours au frais",
    nutritionNote: "Protéines végétales, épices douces, servir avec du riz.",
    novaNote: "NOVA 1-2 : lentilles, lait de coco, épices en poudre.",
    preps: ["bouillonLegumes"],
    ingredients: [
      ING("Lentilles corail", 250, "g", "Épicerie"),
      ING("Lait de coco", 400, "ml", "Épicerie"),
      ING("Oignon", 1, "piece", "Fruits & légumes"),
      ING("Gingembre frais", 1, "morceau", "Fruits & légumes"),
      ING("Riz basmati complet", 200, "g", "Épicerie"),
      ING("Curcuma", 1, "cc", "Épicerie"),
    ],
    steps: [
      "Faire revenir oignon, gingembre et curcuma, ajouter les lentilles corail et le bouillon.",
      "Verser le lait de coco, mijoter 20 min, servir sur le riz.",
    ],
  },
  {
    id: "roti-porc-chou",
    name: "Rôti de porc, chou & pommes de terre",
    seasons: ["froid"],
    protein: "porc",
    fridgeLife: "3 jours au frais",
    nutritionNote: "Viande maigre + légume d'hiver + féculent, plat complet.",
    novaNote: "NOVA 1 : porc frais, légumes bruts.",
    preps: [],
    ingredients: [
      ING("Rôti de porc", 600, "g", "Boucherie / Poissonnerie"),
      ING("Chou vert", 1, "piece", "Fruits & légumes"),
      ING("Pommes de terre", 500, "g", "Fruits & légumes"),
      ING("Oignon", 2, "piece", "Fruits & légumes"),
      ING("Huile d'olive", 20, "ml", "Épicerie"),
    ],
    steps: [
      "Saisir le rôti, enfourner 1 h à 180 °C avec les oignons.",
      "Cuire le chou émincé et les pommes de terre à la vapeur, servir avec le jus.",
    ],
  },
  {
    id: "gratin-chou-fleur",
    name: "Gratin de chou-fleur, béchamel maison",
    seasons: ["froid", "doux"],
    protein: "vegetarien",
    fridgeLife: "3 jours au frais",
    nutritionNote: "Légume + laitage ; ajouter une source de protéine si repas unique.",
    novaNote: "NOVA 1-2 : chou-fleur, béchamel et fromage maison, zéro sachet.",
    preps: ["bechamel"],
    ingredients: [
      ING("Chou-fleur", 1, "piece", "Fruits & légumes"),
      ING("Gruyère râpé", 100, "g", "Crémerie"),
      ING("Pommes de terre", 300, "g", "Fruits & légumes"),
      ING("Muscade", 1, "pincee", "Épicerie"),
    ],
    steps: [
      "Cuire le chou-fleur et les pommes de terre à la vapeur.",
      "Disposer dans un plat, napper de béchamel, parsemer de gruyère et gratiner 20 min à 200 °C.",
    ],
  },
  {
    id: "poelee-haricots-oeuf",
    name: "Poêlée haricots verts, pommes de terre & œuf",
    seasons: ["doux", "chaud"],
    protein: "oeuf",
    fridgeLife: "2 jours au frais",
    nutritionNote: "Légume vert, féculent et œuf : repas équilibré rapide.",
    novaNote: "NOVA 1 : haricots frais, œufs, pommes de terre.",
    preps: [],
    ingredients: [
      ING("Haricots verts", 400, "g", "Fruits & légumes"),
      ING("Pommes de terre", 400, "g", "Fruits & légumes"),
      ING("Œufs", 4, "piece", "Crémerie"),
      ING("Oignon", 1, "piece", "Fruits & légumes"),
      ING("Huile d'olive", 20, "ml", "Épicerie"),
    ],
    steps: [
      "Cuire haricots et pommes de terre, puis les faire sauter avec l'oignon.",
      "Ajouter les œufs au plat (mollets ou au plat) et servir.",
    ],
  },
  {
    id: "soupe-froide-concombre",
    name: "Soupe froide concombre-yaourt & pain",
    seasons: ["chaud"],
    protein: "vegetarien",
    fridgeLife: "2 jours au frais",
    nutritionNote: "Fraîche et hydratante, compléter avec des œufs durs pour les protéines.",
    novaNote: "NOVA 1 : concombre, yaourt maison, herbes.",
    preps: ["yaourt"],
    ingredients: [
      ING("Concombre", 2, "piece", "Fruits & légumes"),
      ING("Menthe", 1, "botte", "Fruits & légumes"),
      ING("Ail", 1, "gousse", "Fruits & légumes"),
      ING("Œufs", 4, "piece", "Crémerie"),
      ING("Pain complet", 6, "tranche", "Boulangerie"),
    ],
    steps: [
      "Mixer les concombres avec les yaourts maison, la menthe et l'ail, saler et rafraîchir.",
      "Servir bien frais avec des œufs durs et du pain complet.",
    ],
  },
];

// Ordre d'affichage des rayons dans la liste de courses.
export const AISLE_ORDER = [
  "Fruits & légumes",
  "Boucherie / Poissonnerie",
  "Crémerie",
  "Boulangerie",
  "Épicerie",
];
