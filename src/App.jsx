import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  CalendarRange,
  ShoppingBasket,
  ListChecks,
  History,
  ChefHat,
  Check,
  Circle,
  Thermometer,
  Leaf,
  Loader2,
  AlertTriangle,
  Trash2,
  Soup,
  Clock,
} from "lucide-react";
import { generatePlan } from "./services/planner";

/* ---------------------------------------------------------
   TOKENS
--------------------------------------------------------- */
const COLORS = {
  paper: "#F6F1E6",
  paperDeep: "#EDE4D0",
  ink: "#231F16",
  inkSoft: "#5B5343",
  forest: "#2E4A3C",
  forestDeep: "#1E3229",
  mustard: "#C79A32",
  brick: "#A54A32",
  sage: "#AEBCA0",
  line: "#D9CDAF",
  white: "#FFFDF8",
};

function useGoogleFonts() {
  useEffect(() => {
    const id = "semainier-fonts";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap');`;
    document.head.appendChild(style);
  }, []);
}

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/* ---------------------------------------------------------
   STORAGE (window.storage : localStorage hors Claude Artifacts)
--------------------------------------------------------- */
async function saveWeek(week) {
  await window.storage.set(`week:${week.id}`, JSON.stringify(week));
  let index = [];
  try {
    const r = await window.storage.get("history-index");
    index = r ? JSON.parse(r.value) : [];
  } catch {
    index = [];
  }
  index = [
    { id: week.id, createdAt: week.createdAt, nights: week.meta.nights, season: week.meta.season },
    ...index.filter((w) => w.id !== week.id),
  ];
  await window.storage.set("history-index", JSON.stringify(index));
}

async function loadHistoryIndex() {
  try {
    const r = await window.storage.get("history-index");
    return r ? JSON.parse(r.value) : [];
  } catch {
    return [];
  }
}

async function loadWeek(id) {
  try {
    const r = await window.storage.get(`week:${id}`);
    return r ? JSON.parse(r.value) : null;
  } catch {
    return null;
  }
}

async function deleteWeek(id) {
  try {
    await window.storage.delete(`week:${id}`);
  } catch {}
  const index = await loadHistoryIndex();
  const next = index.filter((w) => w.id !== id);
  await window.storage.set("history-index", JSON.stringify(next));
}

/* ---------------------------------------------------------
   UI PRIMITIVES
--------------------------------------------------------- */
function Tag({ children, tone = "sage" }) {
  const bg = tone === "brick" ? COLORS.brick : tone === "mustard" ? COLORS.mustard : COLORS.sage;
  const color = tone === "sage" ? COLORS.ink : COLORS.white;
  return (
    <span
      style={{
        background: bg,
        color,
        fontFamily: "'Work Sans', sans-serif",
        fontSize: "0.68rem",
        fontWeight: 600,
        letterSpacing: "0.03em",
        padding: "0.2rem 0.55rem",
        borderRadius: "999px",
        display: "inline-block",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.line}`,
        borderRadius: "14px",
        padding: "1rem 1.1rem",
        boxShadow: "0 1px 0 rgba(35,31,22,0.03)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
      {Icon && <Icon size={18} color={COLORS.forest} strokeWidth={2.2} />}
      <h2
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "1.25rem",
          fontWeight: 600,
          color: COLORS.forestDeep,
          margin: 0,
        }}
      >
        {children}
      </h2>
    </div>
  );
}

/* ---------------------------------------------------------
   TABS
--------------------------------------------------------- */
const TABS = [
  { id: "generate", label: "Générer", icon: Sparkles },
  { id: "plan", label: "Planning", icon: CalendarRange },
  { id: "shopping", label: "Courses", icon: ShoppingBasket },
  { id: "steps", label: "Étapes", icon: ListChecks },
  { id: "homemade", label: "Maison", icon: Soup },
  { id: "history", label: "Historique", icon: History },
];

/* ---------------------------------------------------------
   MAIN APP
--------------------------------------------------------- */
export default function App() {
  useGoogleFonts();
  const [tab, setTab] = useState("generate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentWeek, setCurrentWeek] = useState(null);
  const [history, setHistory] = useState([]);

  const [nights, setNights] = useState(5);
  const [dislikes, setDislikes] = useState("aubergine, courgette, carotte, tomate chaude");
  const [tempHint, setTempHint] = useState("doux");

  const refreshHistory = useCallback(async () => {
    const idx = await loadHistoryIndex();
    setHistory(idx);
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const result = generatePlan({ nights, tempHint, dislikes });

      const week = {
        id: uid(),
        createdAt: new Date().toISOString(),
        meta: result.meta || { nights, season: tempHint, tempNote: "", pivotProducts: [] },
        recipes: result.recipes || [],
        homemadePreps: result.homemadePreps || [],
        shoppingList: (result.shoppingList || []).map((a) => ({
          ...a,
          items: a.items.map((it) => ({ ...it, checked: false, key: uid() })),
        })),
        prepSteps: (result.prepSteps || []).map((s) => ({ ...s, done: false, key: uid() })),
      };

      await saveWeek(week);
      setCurrentWeek(week);
      await refreshHistory();
      setTab("plan");
    } catch (e) {
      setError("Impossible de générer le planning (" + (e && e.message ? e.message : "erreur inconnue") + "). Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const toggleShoppingItem = async (aisleIdx, itemKey) => {
    if (!currentWeek) return;
    const updated = {
      ...currentWeek,
      shoppingList: currentWeek.shoppingList.map((aisle, i) =>
        i !== aisleIdx
          ? aisle
          : { ...aisle, items: aisle.items.map((it) => (it.key === itemKey ? { ...it, checked: !it.checked } : it)) }
      ),
    };
    setCurrentWeek(updated);
    try {
      await saveWeek(updated);
    } catch {}
  };

  const toggleStep = async (key) => {
    if (!currentWeek) return;
    const updated = {
      ...currentWeek,
      prepSteps: currentWeek.prepSteps.map((s) => (s.key === key ? { ...s, done: !s.done } : s)),
    };
    setCurrentWeek(updated);
    try {
      await saveWeek(updated);
    } catch {}
  };

  const openWeek = async (id) => {
    const w = await loadWeek(id);
    if (w) {
      setCurrentWeek(w);
      setTab("plan");
    }
  };

  const removeWeek = async (id) => {
    await deleteWeek(id);
    if (currentWeek && currentWeek.id === id) setCurrentWeek(null);
    await refreshHistory();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.paper,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Work Sans', sans-serif",
        color: COLORS.ink,
      }}
    >
      <header style={{ padding: "1.4rem 1.2rem 1.1rem", background: COLORS.forestDeep, borderBottom: `4px solid ${COLORS.mustard}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <ChefHat size={26} color={COLORS.mustard} strokeWidth={2} />
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 700, color: COLORS.white, margin: 0 }}>
            Le Semainier
          </h1>
        </div>
        <p style={{ margin: "0.3rem 0 0", color: COLORS.sage, fontSize: "0.82rem" }}>Batchcooking maison, sans détour, pour deux.</p>
      </header>

      <main style={{ flex: 1, padding: "1.1rem", paddingBottom: "5.5rem", maxWidth: "560px", width: "100%", margin: "0 auto" }}>
        {tab === "generate" && (
          <GenerateTab
            nights={nights}
            setNights={setNights}
            dislikes={dislikes}
            setDislikes={setDislikes}
            tempHint={tempHint}
            setTempHint={setTempHint}
            loading={loading}
            error={error}
            onGenerate={generate}
          />
        )}
        {tab === "plan" && <PlanTab week={currentWeek} />}
        {tab === "shopping" && <ShoppingTab week={currentWeek} onToggle={toggleShoppingItem} />}
        {tab === "steps" && <StepsTab week={currentWeek} onToggle={toggleStep} />}
        {tab === "homemade" && <HomemadeTab week={currentWeek} />}
        {tab === "history" && <HistoryTab history={history} onOpen={openWeek} onDelete={removeWeek} currentId={currentWeek?.id} />}
      </main>

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: COLORS.white,
          borderTop: `1px solid ${COLORS.line}`,
          display: "flex",
          justifyContent: "space-around",
          padding: "0.5rem 0.2rem calc(0.5rem + env(safe-area-inset-bottom))",
        }}
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.15rem",
                padding: "0.3rem 0.4rem",
                cursor: "pointer",
                color: active ? COLORS.forest : COLORS.inkSoft,
                flex: 1,
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              <span style={{ fontSize: "0.62rem", fontWeight: active ? 700 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ---------------------------------------------------------
   TAB: GENERATE
--------------------------------------------------------- */
function GenerateTab({ nights, setNights, dislikes, setDislikes, tempHint, setTempHint, loading, error, onGenerate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Card>
        <SectionTitle icon={Sparkles}>Nouvelle semaine</SectionTitle>

        <Field label="Nombre de soirs">
          <input type="number" min={1} max={7} value={nights} onChange={(e) => setNights(Number(e.target.value))} style={inputStyle} />
        </Field>

        <Field label="Ingrédients non aimés / à exclure">
          <textarea value={dislikes} onChange={(e) => setDislikes(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
        </Field>

        <Field label="Météo de la semaine">
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[
              { id: "froid", label: "Froid", icon: Thermometer },
              { id: "doux", label: "Doux", icon: Leaf },
              { id: "chaud", label: "Chaud", icon: Thermometer },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTempHint(opt.id)}
                style={{
                  flex: 1,
                  padding: "0.55rem 0.4rem",
                  borderRadius: "10px",
                  border: `1.5px solid ${tempHint === opt.id ? COLORS.forest : COLORS.line}`,
                  background: tempHint === opt.id ? COLORS.forest : COLORS.white,
                  color: tempHint === opt.id ? COLORS.white : COLORS.ink,
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        <button onClick={onGenerate} disabled={loading} style={primaryButtonStyle(loading)}>
          {loading ? (
            <>
              <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />
              Génération en cours…
            </>
          ) : (
            <>
              <Sparkles size={17} />
              Générer le planning
            </>
          )}
        </button>

        {error && (
          <div style={{ display: "flex", gap: "0.4rem", color: COLORS.brick, marginTop: "0.7rem", fontSize: "0.82rem" }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
            <span>{error}</span>
          </div>
        )}
      </Card>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: COLORS.inkSoft, marginBottom: "0.3rem" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.55rem 0.7rem",
  borderRadius: "9px",
  border: `1.5px solid ${COLORS.line}`,
  fontFamily: "'Work Sans', sans-serif",
  fontSize: "0.9rem",
  background: COLORS.paper,
  color: COLORS.ink,
};

function primaryButtonStyle(disabled) {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    borderRadius: "10px",
    border: "none",
    background: disabled ? COLORS.sage : COLORS.forest,
    color: COLORS.white,
    fontWeight: 700,
    fontSize: "0.92rem",
    cursor: disabled ? "default" : "pointer",
  };
}

function EmptyState({ text }) {
  return (
    <Card style={{ textAlign: "center", padding: "2rem 1rem", color: COLORS.inkSoft }}>
      <ChefHat size={28} color={COLORS.sage} style={{ marginBottom: "0.5rem" }} />
      <p style={{ margin: 0, fontSize: "0.88rem" }}>{text}</p>
    </Card>
  );
}

function PlanTab({ week }) {
  if (!week) return <EmptyState text="Aucun planning pour l'instant. Génère ta première semaine dans l'onglet « Générer »." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
      {week.meta?.pivotProducts?.length > 0 && (
        <Card style={{ background: COLORS.paperDeep, border: "none" }}>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: COLORS.forestDeep }}>Produits pivots :</span>
            {week.meta.pivotProducts.map((p, i) => (
              <Tag key={i} tone="mustard">{p}</Tag>
            ))}
          </div>
        </Card>
      )}
      {week.recipes.map((r, i) => (
        <Card key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: COLORS.mustard, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.day}</span>
            {r.fridgeLife && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: COLORS.inkSoft }}>
                <Clock size={12} /> {r.fridgeLife}
              </span>
            )}
          </div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", margin: "0 0 0.5rem", color: COLORS.ink }}>{r.name}</h3>
          <ul style={{ margin: "0 0 0.6rem", paddingLeft: "1.1rem", fontSize: "0.85rem", color: COLORS.inkSoft }}>
            {r.ingredients?.map((ing, j) => (
              <li key={j}>{ing.name} — {ing.qty}</li>
            ))}
          </ul>
          {r.nutritionNote && <p style={{ margin: "0 0 0.3rem", fontSize: "0.78rem", color: COLORS.forest }}>{r.nutritionNote}</p>}
          {r.novaNote && <p style={{ margin: 0, fontSize: "0.75rem", color: COLORS.inkSoft, fontStyle: "italic" }}>{r.novaNote}</p>}
        </Card>
      ))}
    </div>
  );
}

function ShoppingTab({ week, onToggle }) {
  if (!week) return <EmptyState text="Pas encore de liste de courses. Génère un planning pour la voir apparaître ici." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
      {week.shoppingList.map((aisle, ai) => (
        <Card key={ai}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", margin: "0 0 0.6rem", color: COLORS.forestDeep }}>{aisle.aisle}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {aisle.items.map((item) => (
              <button
                key={item.key}
                onClick={() => onToggle(ai, item.key)}
                style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", opacity: item.checked ? 0.5 : 1 }}
              >
                {item.checked ? <Check size={18} color={COLORS.forest} /> : <Circle size={18} color={COLORS.line} />}
                <span style={{ fontSize: "0.88rem", textDecoration: item.checked ? "line-through" : "none", color: COLORS.ink }}>
                  {item.name} <span style={{ color: COLORS.inkSoft }}>— {item.qty}</span>
                </span>
              </button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function StepsTab({ week, onToggle }) {
  if (!week) return <EmptyState text="Les étapes de préparation apparaîtront ici après génération d'un planning." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {week.prepSteps.map((step, i) => (
        <Card key={step.key} style={{ opacity: step.done ? 0.55 : 1 }}>
          <button onClick={() => onToggle(step.key)} style={{ display: "flex", gap: "0.7rem", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", width: "100%" }}>
            <div style={{ flexShrink: 0, marginTop: "0.1rem" }}>{step.done ? <Check size={18} color={COLORS.forest} /> : <Circle size={18} color={COLORS.line} />}</div>
            <div>
              <p style={{ margin: 0, fontSize: "0.88rem", textDecoration: step.done ? "line-through" : "none" }}>
                <strong style={{ color: COLORS.mustard }}>{i + 1}.</strong> {step.text}
              </p>
              {step.refs?.length > 0 && (
                <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
                  {step.refs.map((ref, j) => (
                    <Tag key={j}>{ref}</Tag>
                  ))}
                </div>
              )}
            </div>
          </button>
        </Card>
      ))}
    </div>
  );
}

function HomemadeTab({ week }) {
  if (!week || !week.homemadePreps?.length) return <EmptyState text="Les bouillons, sauces et autres préparations maison de la semaine apparaîtront ici." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      {week.homemadePreps.map((p, i) => (
        <Card key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <Soup size={17} color={COLORS.forest} />
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", margin: 0 }}>{p.name}</h3>
          </div>
          <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: COLORS.inkSoft }}>Quantité : {p.quantity}</p>
          <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: COLORS.inkSoft }}>Utilisé dans : {p.usedIn}</p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
            <Tag tone="mustard">{p.expiry}</Tag>
            <Tag>{p.storage}</Tag>
          </div>
        </Card>
      ))}
    </div>
  );
}

function HistoryTab({ history, onOpen, onDelete, currentId }) {
  if (!history.length) return <EmptyState text="Aucune semaine enregistrée pour l'instant." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {history.map((w) => (
        <Card key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: w.id === currentId ? `1.5px solid ${COLORS.forest}` : `1px solid ${COLORS.line}` }}>
          <button onClick={() => onOpen(w.id)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", flex: 1, padding: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem" }}>
              {new Date(w.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: COLORS.inkSoft }}>{w.nights} soirs · {w.season}</p>
          </button>
          <button onClick={() => onDelete(w.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.3rem" }} aria-label="Supprimer">
            <Trash2 size={17} color={COLORS.brick} />
          </button>
        </Card>
      ))}
    </div>
  );
}
