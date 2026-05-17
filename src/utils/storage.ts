const storage = {
  get: <T>(key: string): T | null => {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
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
