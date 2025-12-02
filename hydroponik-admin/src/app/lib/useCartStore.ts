import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  selected: boolean;
}

interface CartState {
  items: CartItem[];
  
  // Slot VIP (Beli Langsung)
  directCheckoutItem: CartItem | null; 
  setDirectCheckoutItem: (item: CartItem) => void;
  clearDirectCheckoutItem: () => void;

  // --- FUNGSI YANG HILANG (TAMBAHKAN INI) ---
  buyNow: (item: Omit<CartItem, 'quantity' | 'selected'>, quantity: number) => void;
  // ------------------------------------------

  addItem: (item: Omit<CartItem, 'quantity' | 'selected'>, isSelected?: boolean) => void;
  removeItem: (id: number) => void;
  decreaseItem: (id: number) => void;
  toggleItem: (id: number) => void;
  deselectAllItems: () => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      directCheckoutItem: null,
      setDirectCheckoutItem: (item) => set({ directCheckoutItem: item }),
      clearDirectCheckoutItem: () => set({ directCheckoutItem: null }),

      // Implementasi buyNow
      buyNow: (newItem, quantity) => {
        set({
          directCheckoutItem: {
            ...newItem,
            quantity: quantity,
            selected: true
          }
        });
      },

      addItem: (newItem, isSelected = false) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === newItem.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1, selected: isSelected ? true : item.selected }
                : item
            ),
          });
        } else {
          set({ 
            items: [...currentItems, { ...newItem, quantity: 1, selected: isSelected }] 
          });
        }
      },

      deselectAllItems: () => {
        set({ items: get().items.map(item => ({ ...item, selected: false })) });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      decreaseItem: (id) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === id);
        if (existingItem) {
          if (existingItem.quantity > 1) {
            set({
              items: currentItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
              ),
            });
          } else {
            set({ items: currentItems.filter((item) => item.id !== id) });
          }
        }
      },

      toggleItem: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      totalPrice: () => get().items
        .filter(item => item.selected)
        .reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    { name: 'cart-storage' }
  )
);