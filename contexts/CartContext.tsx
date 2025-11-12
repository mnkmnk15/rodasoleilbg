'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useCart as useCartHook, Cart, CartItem } from '@/hooks/useCart';

interface CartContextType {
  cart: Cart;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartHook = useCartHook();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Обертка для addItem, которая автоматически открывает корзину
  const addItemAndOpenCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    cartHook.addItem(item);
    setIsCartOpen(true);
  }, [cartHook]);

  return (
    <CartContext.Provider value={{
      ...cartHook,
      addItem: addItemAndOpenCart, // Переопределяем addItem
      isCartOpen,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
