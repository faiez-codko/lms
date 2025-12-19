import { create } from "zustand";
import axios from "axios";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useUser = create<UserStore>((set) => ({
  user: null,
  isLoading: true,
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get("/api/auth/me");
      set({ user: res.data.user });
    } catch (error) {
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },
  setUser: (user) => set({ user }),
  logout: async () => {
    try {
      await axios.post("/api/auth/logout");
      set({ user: null });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
}));
