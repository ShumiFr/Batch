/* ---------------------------------------------------------
   VIGNETTE ILLUSTRÉE D'UNE RECETTE
   -----------------------------------------------------------
   Génère une identité visuelle (emoji + dégradé de couleur) pour
   chaque recette, à partir de son nom et de sa protéine. 100% local.

   Si une recette porte un champ `image` (ex. "/recipes/poulet-roti.jpg"),
   l'UI l'affiche à la place de la vignette générée — la vignette sert
   alors de repli en attendant la vraie photo.
--------------------------------------------------------- */

// Emoji choisi selon des mots-clés du nom (ordre = priorité).
const EMOJI_RULES = [
  [/moule|fruits de mer/, "🦪"],
  [/poke/, "🍣"],
  [/tartare/, "🐟"],
  [/saumon|truite|cabillaud|sardine|morue|poisson|papillote/, "🐟"],
  [/risotto/, "🍚"],
  [/curry|dahl/, "🍛"],
  [/gaspacho/, "🥣"],
  [/velout|soupe|potiron|brocoli/, "🍲"],
  [/dauphinois|gratin/, "🧀"],
  [/quiche/, "🥧"],
  [/omelette|frittata|cocotte|galette|croque|œuf|oeuf/, "🍳"],
  [/houmous|mezze/, "🧆"],
  [/salade|taboul|buddha|cesar|césar|quinoa/, "🥗"],
  [/boulette|steak|bourguignon|pot-au-feu|boeuf|bœuf/, "🥩"],
  [/navarin|agneau/, "🍖"],
  [/porc|cotes|côtes/, "🥓"],
  [/veau|blanquette/, "🍖"],
  [/poulet|dinde|escalope/, "🍗"],
  [/lentilles|pois chiches/, "🍛"],
];

// Emoji de repli selon la protéine.
const EMOJI_BY_PROTEIN = {
  poulet: "🍗",
  dinde: "🍗",
  boeuf: "🥩",
  veau: "🍖",
  agneau: "🍖",
  porc: "🥓",
  poisson: "🐟",
  "fruits de mer": "🦪",
  oeuf: "🍳",
  legumineuse: "🍛",
  vegetarien: "🥗",
};

// Catégorie de couleur selon la protéine.
function categoryOf(protein) {
  if (["boeuf", "veau", "agneau", "porc"].includes(protein)) return "viande";
  if (protein === "poisson" || protein === "fruits de mer") return "mer";
  if (protein === "poulet" || protein === "dinde") return "volaille";
  if (protein === "oeuf") return "oeuf";
  return "vegetal"; // legumineuse, vegetarien
}

const CATEGORY_BG = {
  viande: { from: "#B5573C", to: "#7D3826" },
  volaille: { from: "#CE9B3A", to: "#9C6E1E" },
  mer: { from: "#3F7D77", to: "#244A43" },
  oeuf: { from: "#D8B24A", to: "#B5852A" },
  vegetal: { from: "#8FA97C", to: "#3B5B3E" },
};

// Renvoie { emoji, from, to } pour une recette.
export function recipeVisual(recipe) {
  const name = (recipe.name || "").toLowerCase();
  let emoji = null;
  for (const [re, e] of EMOJI_RULES) {
    if (re.test(name)) {
      emoji = e;
      break;
    }
  }
  if (!emoji) emoji = EMOJI_BY_PROTEIN[recipe.protein] || "🍽️";
  const bg = CATEGORY_BG[categoryOf(recipe.protein)] || CATEGORY_BG.vegetal;
  return { emoji, from: bg.from, to: bg.to };
}
