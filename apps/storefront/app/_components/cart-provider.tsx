"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, CartItemInput } from "@beads-bonita/core";

const CART_STORAGE_KEY = "beads-bonita-cart";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: CartItemInput) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart() {
  if (typeof window === "undefined") {
    return [] as CartItem[];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [] as CartItem[];
    }

    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as CartItem[];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    setItems(readStoredCart());
    hasHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextValue = {
    items,
    totalItems,
    subtotal,
    addItem(item) {
      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (currentItem) => currentItem.productId === item.productId,
        );

        if (existingItem) {
          return currentItems.map((currentItem) =>
            currentItem.productId === item.productId
              ? {
                  ...currentItem,
                  quantity: currentItem.quantity + (item.quantity ?? 1),
                }
              : currentItem,
          );
        }

        return [
          ...currentItems,
          {
            ...item,
            quantity: item.quantity ?? 1,
          },
        ];
      });
    },
    updateQuantity(productId, quantity) {
      if (quantity <= 0) {
        setItems((currentItems) =>
          currentItems.filter((currentItem) => currentItem.productId !== productId),
        );
        return;
      }

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.productId === productId ? { ...currentItem, quantity } : currentItem,
        ),
      );
    },
    removeItem(productId) {
      setItems((currentItems) =>
        currentItems.filter((currentItem) => currentItem.productId !== productId),
      );
    },
    clearCart() {
      setItems([]);
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
