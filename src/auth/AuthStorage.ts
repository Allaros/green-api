import type { GreenApiConfig } from '../api/types/greenApiTypes';

const STORAGE_KEY = 'green-api-config';

export const authStorage = {
   get(): GreenApiConfig | null {
      const value = sessionStorage.getItem(STORAGE_KEY);

      if (!value) return null;

      try {
         return JSON.parse(value) as GreenApiConfig;
      } catch {
         sessionStorage.removeItem(STORAGE_KEY);
         return null;
      }
   },

   set(config: GreenApiConfig) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
   },

   clear() {
      sessionStorage.removeItem(STORAGE_KEY);
   },
};
