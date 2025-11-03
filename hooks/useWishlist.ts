import { useState, useEffect } from 'react';
import { storage } from '@/lib/utils';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

/**
 * Custom hook for wishlist management
 */
export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = storage.get<WishlistItem[]>('wishlist', []);
    setWishlist(savedWishlist);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    storage.set('wishlist', wishlist);
  }, [wishlist]);

  // Add item to wishlist
  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  // Toggle item in wishlist
  const toggleWishlist = (item: WishlistItem) => {
    const exists = wishlist.some((i) => i.id === item.id);
    if (exists) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (id: string): boolean => {
    return wishlist.some((i) => i.id === id);
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([]);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
}
