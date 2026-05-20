import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, CartItemPayload } from "@/types/cart";

const CART_STORAGE_KEY = "icore-cart";

type CartContextValue = {
  items: CartItem[];
  cartCount: number;
  addItem: (item: CartItemPayload) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredCart(items: CartItem[]) {
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    writeStoredCart(next);
  }, []);

  const addItem = useCallback(
    (item: CartItemPayload) => {
      setItems((prev) => {
        const existing = prev.find((entry) => entry.id === item.id);
        const next = existing
          ? prev.map((entry) =>
              entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
            )
          : [...prev, { ...item, quantity: 1 }];
        writeStoredCart(next);
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      writeStoredCart(next);
      return next;
    });
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      );
      writeStoredCart(next);
      return next;
    });
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.flatMap((item) => {
        if (item.id !== id) return [item];
        if (item.quantity <= 1) return [];
        return [{ ...item, quantity: item.quantity - 1 }];
      });
      writeStoredCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      cartCount,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    }),
    [items, cartCount, addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
