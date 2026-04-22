import { create } from "zustand";
import { persist } from "zustand/middleware";

// ✅ Product type
export interface Product {
  id: string;
  title: string;
  name: string;
  price: number;
  discount_price?: number | null;
  image?: string;
  images?: string[];
  category?: string;
}

// ✅ Cart item
export interface CartItem extends Product {
  quantity: number;
}

// ✅ Store type
interface CartStore {
  items: CartItem[];

  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  decreaseQuantity: (id: string) => void;

  // 🔥 الحل الأساسي للمشكلة
  updateQuantity: (id: string, quantity: number) => void;

  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      decreaseQuantity: (id) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      // 🔥 الجديد: updateQuantity
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          }));
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((acc, item) => {
          const finalPrice =
            item.discount_price && item.discount_price > 0
              ? item.discount_price
              : item.price;

          return acc + finalPrice * item.quantity;
        }, 0),
    }),
    {
      name: "cart-storage",
    }
  )
);