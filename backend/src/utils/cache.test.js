const { MemoryCache } = require('./cache');

describe('MemoryCache', () => {
  let cache;

  beforeEach(() => {
    cache = new MemoryCache(1000); // 1s TTL for tests
  });

  test('returns null for missing key', () => {
    expect(cache.get('nonexistent')).toBeNull();
  });

  test('stores and retrieves a value', () => {
    cache.set('key1', { data: 'hello' });
    expect(cache.get('key1')).toEqual({ data: 'hello' });
  });

  test('returns null after TTL expires', async () => {
    cache.set('expiring', 'value', 50); // 50ms TTL
    expect(cache.get('expiring')).toBe('value');

    await new Promise(r => setTimeout(r, 60));
    expect(cache.get('expiring')).toBeNull();
  });

  test('invalidate removes a specific key', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.invalidate('a');
    expect(cache.get('a')).toBeNull();
    expect(cache.get('b')).toBe(2);
  });

  test('clear removes all keys', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();
    expect(cache.get('a')).toBeNull();
    expect(cache.get('b')).toBeNull();
  });

  test('overwrites existing key', () => {
    cache.set('key', 'first');
    cache.set('key', 'second');
    expect(cache.get('key')).toBe('second');
  });
});
