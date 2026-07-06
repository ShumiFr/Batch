/* ---------------------------------------------------------
   ALGORITHME DE GÉNÉRATION DU PLANNING (100% local, gratuit)
   -----------------------------------------------------------
   Remplace l'appel à l'IA. Compose une semaine à partir de la
   bibliothèque locale (src/data/recipes.js) :
     1. filtre les recettes selon la météo et les ingrédients exclus ;
     2. choisit `nights` recettes en variant les protéines ;
     3. agrège la liste de courses par rayon (préps maison incluses) ;
     4. rassemble les préparations maison (bouillons, sauces...) ;
     5. bâtit les étapes : préparations maison d'abord, puis recettes.

   Le résultat suit exactement le même schéma que l'ancienne réponse
   IA, pour que les onglets Planning / Courses / Étapes / Maison ne
   changent pas.
--------------------------------------------------------- */
import { RECIPES, PREPS, AISLE_ORDER } from "../data/recipes";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const SEASON_LABEL = { froid: "Froid", doux: "Doux", chaud: "Chaud" };

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // enlève les accents
    .trim();
}

// Découpe la saisie "aubergine, courgette" en mots-clés normalisés.
function parseDislikes(dislikes) {
  return (dislikes || "")
    .split(/[,;\n]/)
    .map((s) => normalize(s))
    .filter(Boolean);
}

// Une recette est écartée si l'un de ses ingrédients contient un mot exclu.
function hasDisliked(recipe, disliked) {
  if (!disliked.length) return false;
  return recipe.ingredients.some((ing) => {
    const n = normalize(ing.name);
    return disliked.some((d) => n.includes(d));
  });
}

// Mélange (Fisher–Yates) pour varier les plannings d'une génération à l'autre.
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Sélection gloutonne privilégiant la variété des protéines : on n'ajoute
// pas une protéine déjà utilisée tant qu'il reste d'autres choix.
function pickRecipes(pool, nights) {
  const chosen = [];
  const usedProteins = {};
  let candidates = shuffle(pool);

  while (chosen.length < nights && candidates.length) {
    // D'abord une protéine encore non utilisée, sinon la moins fréquente.
    let idx = candidates.findIndex((r) => !usedProteins[r.protein]);
    if (idx === -1) {
      idx = 0;
      candidates.sort(
        (a, b) => (usedProteins[a.protein] || 0) - (usedProteins[b.protein] || 0)
      );
    }
    const [r] = candidates.splice(idx, 1);
    chosen.push(r);
    usedProteins[r.protein] = (usedProteins[r.protein] || 0) + 1;
  }
  return chosen;
}

// Formate une quantité { amount, unit } en texte lisible.
export function formatQty(amount, unit) {
  if (unit === "piece") return `${amount}`;
  return `${amount} ${unit}`;
}

// Pas de décrémentation/incrémentation selon l'unité (utilisé par l'onglet
// Maison pour retirer de quoi consommer une préparation).
export function stepFor(unit) {
  if (unit === "ml" || unit === "g") return 10;
  if (unit === "L" || unit === "kg") return 0.5;
  return 1; // unités dénombrables : pot, pâte, bocal...
}

// Unités dénombrables qui se mettent au pluriel (pas les unités de mesure).
const COUNTABLE_UNITS = ["pot", "pâte", "bocal", "part", "portion", "piece"];

// Formate une quantité de préparation maison pour l'affichage, avec pluriel
// simple pour les unités dénombrables (8 pots, 1 pâte...).
export function formatUnitQty(amount, unit) {
  const n = Math.round(amount * 100) / 100; // évite les flottants disgracieux
  if (!COUNTABLE_UNITS.includes(unit)) return `${n} ${unit}`;
  let label = unit;
  if (n > 1) label = unit === "bocal" ? "bocaux" : `${unit}s`;
  return `${n} ${label}`;
}

// Agrège tous les ingrédients (recettes + préps) par rayon, en fusionnant
// les doublons de même nom + même unité (les quantités s'additionnent).
function buildShoppingList(recipes, preps) {
  const byKey = {}; // "rayon|nom|unite" -> { name, amount, unit, aisle }
  const allIngredients = [
    ...recipes.flatMap((r) => r.ingredients),
    ...preps.flatMap((p) => p.ingredients),
  ];

  for (const ing of allIngredients) {
    const key = `${ing.aisle}|${normalize(ing.name)}|${ing.unit}`;
    if (!byKey[key]) {
      byKey[key] = { name: ing.name, amount: 0, unit: ing.unit, aisle: ing.aisle };
    }
    byKey[key].amount += Number(ing.amount) || 0;
  }

  // Regroupe par rayon dans l'ordre défini.
  const aisles = {};
  for (const item of Object.values(byKey)) {
    if (!aisles[item.aisle]) aisles[item.aisle] = [];
    aisles[item.aisle].push({ name: item.name, qty: formatQty(item.amount, item.unit) });
  }

  return AISLE_ORDER.filter((a) => aisles[a]).map((a) => ({
    aisle: a,
    items: aisles[a].sort((x, y) => x.name.localeCompare(y.name, "fr")),
  }));
}

// Étapes de la semaine : préparations maison d'abord (elles doivent exister
// avant les recettes), puis les étapes de chaque recette avec sa référence.
function buildPrepSteps(recipes, preps) {
  const steps = [];
  for (const p of preps) {
    for (const text of p.steps) {
      steps.push({ text, refs: [p.name] });
    }
  }
  for (const r of recipes) {
    for (const text of r.steps) {
      steps.push({ text, refs: [r.name] });
    }
  }
  return steps;
}

// Produits pivots : ingrédients (hors épicerie de base) présents dans au
// moins deux recettes, valorisés sur la semaine.
function findPivots(recipes) {
  const count = {};
  const label = {};
  for (const r of recipes) {
    const seen = new Set();
    for (const ing of r.ingredients) {
      const k = normalize(ing.name);
      if (seen.has(k)) continue;
      seen.add(k);
      count[k] = (count[k] || 0) + 1;
      label[k] = ing.name;
    }
  }
  return Object.keys(count)
    .filter((k) => count[k] >= 2)
    .sort((a, b) => count[b] - count[a])
    .slice(0, 3)
    .map((k) => label[k]);
}

/* ---------- Point d'entrée ----------
   Reproduit le schéma renvoyé auparavant par l'IA :
   { meta, recipes, homemadePreps, shoppingList, prepSteps }
--------------------------------------------------------- */
export function generatePlan({ nights = 5, tempHint = "doux", dislikes = "", seasonAware = true }) {
  const disliked = parseDislikes(dislikes);

  // 1. Filtrer sur les exclusions, et sur la météo/saison si demandé.
  let pool = RECIPES.filter(
    (r) => !hasDisliked(r, disliked) && (!seasonAware || r.seasons.includes(tempHint))
  );
  // Repli : si trop peu de recettes pour la saison, on élargit à toutes.
  if (pool.length < nights) {
    pool = RECIPES.filter((r) => !hasDisliked(r, disliked));
  }

  // 2. Choisir les recettes en variant les protéines.
  const chosen = pickRecipes(pool, nights);

  // 3. Rassembler les préparations maison uniques.
  const prepIds = [...new Set(chosen.flatMap((r) => r.preps || []))];
  const preps = prepIds.map((id) => PREPS[id]).filter(Boolean);

  // 4. Construire les sorties.
  const recipes = chosen.map((r, i) => ({
    day: DAYS[i] || `Soir ${i + 1}`,
    name: r.name,
    ingredients: r.ingredients.map((ing) => ({
      name: ing.name,
      qty: formatQty(ing.amount, ing.unit),
    })),
    fridgeLife: r.fridgeLife,
    nutritionNote: r.nutritionNote,
    novaNote: r.novaNote,
  }));

  const tempNote = !seasonAware
    ? "Toutes saisons : plats piochés dans l'ensemble du répertoire."
    : tempHint === "chaud"
    ? "Semaine chaude : plats froids, tièdes et légers privilégiés."
    : tempHint === "froid"
    ? "Semaine froide : plats chauds et mijotés bienvenus."
    : "Météo douce : plats variés.";

  return {
    meta: {
      nights: chosen.length,
      season: seasonAware ? SEASON_LABEL[tempHint] || tempHint : "Toutes saisons",
      tempNote,
      pivotProducts: findPivots(chosen),
    },
    recipes,
    homemadePreps: preps.map((p) => ({
      name: p.name,
      qty: p.qty, // { amount, unit } : quantité produite
      remaining: p.qty.amount, // stock restant, décrémentable dans l'onglet Maison
      usedIn: chosen
        .filter((r) => (r.preps || []).includes(p.id))
        .map((r) => r.name)
        .join(", "),
      expiry: p.expiry,
      storage: p.storage,
    })),
    shoppingList: buildShoppingList(chosen, preps),
    prepSteps: buildPrepSteps(chosen, preps),
  };
}
