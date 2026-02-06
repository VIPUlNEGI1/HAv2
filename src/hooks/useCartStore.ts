import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/Helpers/AppStorage';

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, delta) => {
        const items = get().items;
        set({
          items: items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
          ).filter(item => item.quantity > 0),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: (state) => {
        console.log('🛒 Cart hydration started');
        return (state, error) => {
          if (error) {
            console.log('❌ Cart hydration error:', error);
          } else {
            console.log('✅ Cart hydration finished');
          }
        };
      },
    }
  )
);
