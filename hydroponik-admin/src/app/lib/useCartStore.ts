// src/lib/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipe data item di keranjang
export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Fungsi Tambah Item
      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === newItem.id);

        if (existingItem) {
          // Jika barang sudah ada, tambah quantity-nya saja
          set({
            items: currentItems.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Jika barang baru, masukkan ke array dengan quantity 1
          set({ items: [...currentItems, { ...newItem, quantity: 1 }] });
        }
      },

      // Fungsi Hapus Item (Opsional untuk nanti)
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      clearCart: () => set({ items: [] }),

      // Hitung total item untuk Badge Navbar
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: 'cart-storage', // Nama key di LocalStorage
    }
  )
);