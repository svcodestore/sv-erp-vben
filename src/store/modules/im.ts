import { defineStore } from 'pinia';
import { store } from '/@/store';

type IMState = { onlineUsers: Record<string, string> };

export const useIMStore = defineStore({
  id: 'app-im',
  state: (): IMState => ({ onlineUsers: {} }),
  getters: {
    getOnlineUsers(): Record<string, string> {
      return this.onlineUsers;
    },
  },
  actions: {
    setOnlineUsers(users: Record<string, string>) {
      this.onlineUsers = users;
    },
  },
});

export function useIMStoreWithOut() {
  return useIMStore(store);
}
