import { create } from 'zustand';
import { CartItem, ShopItem, Character } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: ShopItem, character?: Character) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  updateCharacter: (itemId: number, character: Character) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item, character) => {
    const { items } = get();
    const existingItem = items.find(i => i.item.id === item.id);

    if (existingItem) {
      set({
        items: items.map(i =>
          i.item.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      });
    } else {
      set({
        items: [...items, { item, quantity: 1, selectedCharacter: character }],
      });
    }
  },

  removeItem: (itemId) => {
    set({
      items: get().items.filter(i => i.item.id !== itemId),
    });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set({
      items: get().items.map(i =>
        i.item.id === itemId ? { ...i, quantity } : i
      ),
    });
  },

  updateCharacter: (itemId, character) => {
    set({
      items: get().items.map(i =>
        i.item.id === itemId ? { ...i, selectedCharacter: character } : i
      ),
    });
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.item.price * item.quantity,
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));