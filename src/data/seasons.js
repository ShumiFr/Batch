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
      { name: "Épinard", emoji: "🥬", match: ["épinard", "epinard"] },
      { name: "Petits pois", emoji: "🫛", match: ["petits pois", "petit pois"] },
      { name: "Radis", emoji: "🌶️", match: ["radis"] },
      { name: "Salade", emoji: "🥗", match: ["salade", "romaine", "laitue"] },
      { name: "Navet", emoji: "🥔", match: ["navet"] },
      { name: "Menthe", emoji: "🌿", match: ["menthe"] },
      { name: "Fraise", emoji: "🍓", match: ["fraise"] },
      { name: "Asperge", emoji: "🌱", match: ["asperge"] },
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
      { name: "Tomate", emoji: "🍅", match: ["tomate"] },
      { name: "Concombre", emoji: "🥒", match: ["concombre"] },
      { name: "Poivron", emoji: "🫑", match: ["poivron"] },
      { name: "Haricots verts", emoji: "🫛", match: ["haricot vert", "haricots vert"] },
      { name: "Salade", emoji: "🥗", match: ["salade", "romaine", "laitue"] },
      { name: "Basilic", emoji: "🌿", match: ["basilic"] },
      { name: "Melon", emoji: "🍈", match: ["melon"] },
      { name: "Pêche", emoji: "🍑", match: ["pêche", "peche"] },
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
      { name: "Potiron", emoji: "🎃", match: ["potiron", "potimarron", "courge"] },
      { name: "Champignon", emoji: "🍄", match: ["champignon"] },
      { name: "Brocoli", emoji: "🥦", match: ["brocoli"] },
      { name: "Chou-fleur", emoji: "🥬", match: ["chou-fleur", "chou fleur"] },
      { name: "Poireau", emoji: "🧅", match: ["poireau"] },
      { name: "Épinard", emoji: "🥬", match: ["épinard", "epinard"] },
      { name: "Raisin", emoji: "🍇", match: ["raisin"] },
      { name: "Pomme", emoji: "🍎", match: ["pomme "] }, // évite "pomme de terre"
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
      { name: "Poireau", emoji: "🧅", match: ["poireau"] },
      { name: "Chou", emoji: "🥬", match: ["chou vert", "chou rouge", "chou-fleur"] },
      { name: "Potiron", emoji: "🎃", match: ["potiron", "courge"] },
      { name: "Pomme de terre", emoji: "🥔", match: ["pomme de terre", "pommes de terre"] },
      { name: "Champignon", emoji: "🍄", match: ["champignon"] },
      { name: "Navet", emoji: "🧆", match: ["navet"] },
      { name: "Orange", emoji: "🍊", match: ["orange"] },
      { name: "Endive", emoji: "🥬", match: ["endive"] },
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
