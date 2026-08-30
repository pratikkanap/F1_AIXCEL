// In-memory cache — lives only as long as the JS runtime does.
// Survives React Router navigation (SPA never reloads JS).
// Automatically clears on a real browser refresh (JS re-executes from scratch).
const _store = new Map();

export async function withCache(key, fetchFn) {
  if (_store.has(key)) {
    return _store.get(key);
  }
  const result = await fetchFn();
  _store.set(key, result);
  return result;
}

export function clearClientCache() {
  _store.clear();
}