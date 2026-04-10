import { create } from 'zustand';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  login: (user, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

interface CartItem {
  skuId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (skuId: string) => void;
  updateQuantity: (skuId: string, quantity: number) => void;
  clear: () => void;
  total: number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  total: 0,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.skuId === item.skuId);
      let updated;

      if (existing) {
        updated = state.items.map((i) =>
          i.skuId === item.skuId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        updated = [...state.items, item];
      }

      localStorage.setItem('cart', JSON.stringify(updated));
      return { items: updated };
    }),

  removeItem: (skuId) =>
    set((state) => {
      const updated = state.items.filter((i) => i.skuId !== skuId);
      localStorage.setItem('cart', JSON.stringify(updated));
      return { items: updated };
    }),

  updateQuantity: (skuId, quantity) =>
    set((state) => {
      const updated = state.items.map((i) =>
        i.skuId === skuId ? { ...i, quantity } : i
      ).filter(i => i.quantity > 0);
      localStorage.setItem('cart', JSON.stringify(updated));
      return { items: updated };
    }),

  clear: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },
}));
