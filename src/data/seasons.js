/* ---------------------------------------------------------
   SAISONS & PRODUITS DE SAISON
   -----------------------------------------------------------
   Détecte la saison en cours (calendrier), fournit une identité
   visuelle pour la bannière hero, la météo associée (pour filtrer
   les recettes via leur tag `seasons`), et la liste des fruits &
   légumes de saison (avec emoji pour les pastilles rondes).

   Chaque produit porte `match` : mots-clés normalisés cherchés dans
   les noms d'ingrédients des recettes pour le filtre "clic sur une
   pastille → recettes contenant ce produit".
--------------------------------------------------------- */

export const SEASONS = {
  printemps: {
    key: "printemps",
    label: "Printemps",
    emoji: "🌸",
    weather: "doux", // tag météo des recettes correspondantes
    tagline: "Légumes tendres, herbes fraîches et premières salades.",
    hero: { from: "#AEBCA0", to: "#2E4A3C" },
    produce: [
      // Légumes
      { name: "Asperge", emoji: "🌱", match: ["asperge"] },
      { name: "Épinard", emoji: "🥬", match: ["épinard", "epinard"] },
      { name: "Petits pois", emoji: "🫛", match: ["petits pois", "petit pois"] },
      { name: "Radis", emoji: "🔴", match: ["radis"] },
      { name: "Artichaut", emoji: "🌿", match: ["artichaut"] },
      { name: "Blette", emoji: "🥬", match: ["blette", "bette"] },
      { name: "Navet", emoji: "🥔", match: ["navet"] },
      { name: "Oignon nouveau", emoji: "🧅", match: ["oignon"] },
      { name: "Salade", emoji: "🥗", match: ["salade", "romaine", "laitue"] },
      { name: "Betterave", emoji: "🟣", match: ["betterave"] },
      { name: "Concombre", emoji: "🥒", match: ["concombre"] },
      // Fruits
      { name: "Fraise", emoji: "🍓", match: ["fraise"] },
      { name: "Rhubarbe", emoji: "🌿", match: ["rhubarbe"] },
      { name: "Cerise", emoji: "🍒", match: ["cerise"] },
    ],
  },
  ete: {
    key: "ete",
    label: "Été",
    emoji: "☀️",
    weather: "chaud",
    tagline: "Plats frais, crudités et couleurs du soleil.",
    hero: { from: "#C79A32", to: "#A54A32" },
    produce: [
      // Légumes
      { name: "Tomate", emoji: "🍅", match: ["tomate"] },
      { name: "Concombre", emoji: "🥒", match: ["concombre"] },
      { name: "Poivron", emoji: "🫑", match: ["poivron"] },
      { name: "Haricots verts", emoji: "🫛", match: ["haricot vert", "haricots vert"] },
      { name: "Salade", emoji: "🥗", match: ["salade", "romaine", "laitue"] },
      { name: "Basilic", emoji: "🌿", match: ["basilic"] },
      { name: "Fenouil", emoji: "🌿", match: ["fenouil"] },
      { name: "Maïs", emoji: "🌽", match: ["maïs", "mais"] },
      // Fruits
      { name: "Melon", emoji: "🍈", match: ["melon"] },
      { name: "Pastèque", emoji: "🍉", match: ["pastèque", "pasteque"] },
      { name: "Pêche", emoji: "🍑", match: ["pêche", "peche"] },
      { name: "Abricot", emoji: "🟠", match: ["abricot"] },
      { name: "Cerise", emoji: "🍒", match: ["cerise"] },
      { name: "Framboise", emoji: "🍇", match: ["framboise"] },
    ],
  },
  automne: {
    key: "automne",
    label: "Automne",
    emoji: "🍂",
    weather: "doux",
    tagline: "Courges, champignons et légumes réconfortants.",
    hero: { from: "#C79A32", to: "#1E3229" },
    produce: [
      // Légumes
      { name: "Potiron", emoji: "🎃", match: ["potiron", "potimarron", "courge"] },
      { name: "Champignon", emoji: "🍄", match: ["champignon"] },
      { name: "Brocoli", emoji: "🥦", match: ["brocoli"] },
      { name: "Chou-fleur", emoji: "🥬", match: ["chou-fleur", "chou fleur"] },
      { name: "Poireau", emoji: "🧅", match: ["poireau"] },
      { name: "Épinard", emoji: "🥬", match: ["épinard", "epinard"] },
      { name: "Endive", emoji: "🥬", match: ["endive"] },
      { name: "Betterave", emoji: "🟣", match: ["betterave"] },
      // Fruits
      { name: "Raisin", emoji: "🍇", match: ["raisin"] },
      { name: "Pomme", emoji: "🍎", match: ["pomme "] }, // évite "pomme de terre"
      { name: "Poire", emoji: "🍐", match: ["poire"] },
      { name: "Châtaigne", emoji: "🌰", match: ["châtaigne", "chataigne", "marron"] },
      { name: "Coing", emoji: "🍏", match: ["coing"] },
      { name: "Figue", emoji: "🫐", match: ["figue"] },
    ],
  },
  hiver: {
    key: "hiver",
    label: "Hiver",
    emoji: "❄️",
    weather: "froid",
    tagline: "Mijotés, gratins et légumes d'hiver.",
    hero: { from: "#2E4A3C", to: "#1E3229" },
    produce: [
      // Légumes
      { name: "Poireau", emoji: "🧅", match: ["poireau"] },
      { name: "Chou", emoji: "🥬", match: ["chou"] },
      { name: "Chou-fleur", emoji: "🥦", match: ["chou-fleur", "chou fleur"] },
      { name: "Potiron", emoji: "🎃", match: ["potiron", "courge"] },
      { name: "Pomme de terre", emoji: "🥔", match: ["pomme de terre", "pommes de terre"] },
      { name: "Champignon", emoji: "🍄", match: ["champignon"] },
      { name: "Endive", emoji: "🥬", match: ["endive"] },
      { name: "Mâche", emoji: "🥬", match: ["mâche", "mache"] },
      { name: "Navet", emoji: "🥔", match: ["navet"] },
      { name: "Panais", emoji: "🥔", match: ["panais"] },
      // Fruits
      { name: "Citron", emoji: "🍋", match: ["citron"] },
      { name: "Orange", emoji: "🍊", match: ["orange"] },
      { name: "Clémentine", emoji: "🍊", match: ["clémentine", "clementine", "mandarine"] },
      { name: "Poire", emoji: "🍐", match: ["poire"] },
      { name: "Pomme", emoji: "🍎", match: ["pomme "] },
    ],
  },
};

// Saison calendaire courante à partir du mois (hémisphère nord).
export function getSeason(date = new Date()) {
  const m = date.getMonth(); // 0 = janvier
  if (m === 11 || m <= 1) return SEASONS.hiver; // déc, jan, fév
  if (m <= 4) return SEASONS.printemps; // mar, avr, mai
  if (m <= 7) return SEASONS.ete; // juin, juil, août
  return SEASONS.automne; // sep, oct, nov
}

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

// Une recette contient-elle le produit (via ses mots-clés) ?
export function recipeHasProduce(recipe, produce) {
  const keys = produce.match.map(normalize);
  return recipe.ingredients.some((ing) => {
    const n = normalize(ing.name);
    return keys.some((k) => n.includes(k));
  });
}
