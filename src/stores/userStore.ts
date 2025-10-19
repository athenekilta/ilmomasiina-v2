import { create } from "zustand";
import { persist } from "zustand/middleware";

type StoredUser = {
  name?: string;
  email?: string;
};

type UserStore = {
  user?: StoredUser | null;
  setUser: (user: StoredUser) => void;
  clearUser: () => void;
};

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      user: null,
      setUser: (user: StoredUser) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "User", onRehydrateStorage: () => {
      console.log('hydrated')
    } },
  ),
);

export default useUserStore;
