import { useState, useEffect } from 'react';
import { storage } from '@/lib/utils';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

/**
 * Custom hook for shopping cart management
 */
export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = storage.get<Cart>('cart', {
      items: [],
      total: 0,
      itemCount: 0,
    });
    setCart(savedCart);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    storage.set('cart', cart);
  }, [cart]);

  // Add item to cart
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existingItem = prev.items.find(
        (i) =>
          i.id === item.id &&
          i.size === item.size &&
          i.color === item.color
      );

      let newItems: CartItem[];

      if (existingItem) {
        newItems = prev.items.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...prev.items, { ...item, quantity: 1 }];
      }

      const total = newItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

      return { items: newItems, total, itemCount };
    });
  };

  // Remove item from cart
  const removeItem = (id: string, size?: string, color?: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter(
        (i) => !(i.id === id && i.size === size && i.color === color)
      );

      const total = newItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

      return { items: newItems, total, itemCount };
    });
  };

  // Update item quantity
  const updateQuantity = (
    id: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity <= 0) {
      removeItem(id, size, color);
      return;
    }

    setCart((prev) => {
      const newItems = prev.items.map((i) =>
        i.id === id && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      );

      const total = newItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

      return { items: newItems, total, itemCount };
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart({ items: [], total: 0, itemCount: 0 });
  };

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
