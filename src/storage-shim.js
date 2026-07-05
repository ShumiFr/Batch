// En dehors des Artifacts Claude, window.storage n'existe pas.
// Ce shim reproduit la même API (get/set/delete/list) au-dessus de localStorage
// pour que le code de l'application reste identique entre les deux environnements.
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      if (value === null) {
        throw new Error(`Key not found: ${key}`);
      }
      return { key, value, shared: false };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value, shared: false };
    },
    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    },
    async list(prefix = "") {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
      return { keys, prefix, shared: false };
    },
  };
}
