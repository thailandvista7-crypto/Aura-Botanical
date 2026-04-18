import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { trpc } from "@/trpc/client";

interface CartItem {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  } | null;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  sessionId: string;
  addToCart: (productId: number, quantity?: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState<string>(() => {
    const stored = localStorage.getItem("cart_session_id");
    if (stored) return stored;
    const newId = crypto.randomUUID();
    localStorage.setItem("cart_session_id", newId);
    return newId;
  });

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.cart.get.useQuery({ sessionId });
  const addMutation = trpc.cart.add.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });
  const updateMutation = trpc.cart.update.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });
  const removeMutation = trpc.cart.remove.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });
  const clearMutation = trpc.cart.clear.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });

  const addToCart = useCallback(
    (productId: number, quantity = 1) => {
      addMutation.mutate({ sessionId, productId, quantity });
    },
    [sessionId, addMutation]
  );

  const updateQuantity = useCallback(
    (itemId: number, quantity: number) => {
      updateMutation.mutate({ sessionId, itemId, quantity });
    },
    [sessionId, updateMutation]
  );

  const removeItem = useCallback(
    (itemId: number) => {
      removeMutation.mutate({ sessionId, itemId });
    },
    [sessionId, removeMutation]
  );

  const clearCart = useCallback(() => {
    clearMutation.mutate({ sessionId });
  }, [sessionId, clearMutation]);

  const items = data?.items || [];
  const total = data?.total || 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        sessionId,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
