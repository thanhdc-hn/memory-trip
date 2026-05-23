const _get = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  try {
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return value as T;
  }
};

const _set = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const storage = {
  set: <T>(key: string, value: T) => {
    _set(key, value);
  },

  get: <T>(key: string): T | null => _get<T>(key),

  remove: (key: string) => {
    localStorage.removeItem(key);
  },

  clear: (options?: { keep?: string[] }): void => {
    if (options?.keep && options.keep.length > 0) {
      const keepKeys = options.keep;
      const keysToKeep: Record<string, string | null> = {};

      keepKeys.forEach((key) => {
        keysToKeep[key] = localStorage.getItem(key);
      });

      localStorage.clear();

      Object.entries(keysToKeep).forEach(([key, value]) => {
        if (value !== null) {
          localStorage.setItem(key, value);
        }
      });
    } else {
      localStorage.clear();
    }
  },
};

export default storage;
