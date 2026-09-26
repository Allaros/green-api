import type { Chat } from './types';

const STORAGE_KEY = 'green-api-chats';

export const chatStorage = {
   getChats(): Chat[] {
      try {
         const data = localStorage.getItem(STORAGE_KEY);
         return data ? (JSON.parse(data) as Chat[]) : [];
      } catch {
         return [];
      }
   },

   saveChats(chats: Chat[]): void {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
   },
};
