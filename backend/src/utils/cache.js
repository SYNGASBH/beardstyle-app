/**
 * Simple in-memory cache with TTL.
 * Suitable for caching DB query results that don't change often.
 */
class MemoryCache {
  constructor(defaultTTL = 5 * 60 * 1000) {
    this.store = new Map();
    this.defaultTTL = defaultTTL;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value, ttl) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + (ttl || this.defaultTTL),
    });
  }

  invalidate(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

// Shared cache instances
const stylesCache = new MemoryCache(5 * 60 * 1000);  // 5 min for styles
const popularCache = new MemoryCache(10 * 60 * 1000); // 10 min for popular

module.exports = { MemoryCache, stylesCache, popularCache };
