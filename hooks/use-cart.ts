import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Course {
  id: number | string;
  title: string;
  author: string;
  thumbnail: string;
  price: string;
  rating: number;
  students: number;
  category: string;
}

interface CartStore {
  items: Course[];
  addItem: (item: Course) => void;
  removeItem: (id: number | string) => void;
  clearCart: () => void;
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Course) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return; // Item already in cart
        }

        set({ items: [...get().items, data] });
      },
      removeItem: (id: number | string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
