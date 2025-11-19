import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/utils';
import { sanityClient } from '@/sanity/config';

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
  const [isSyncing, setIsSyncing] = useState(false);

  // Синхронизация цен с Sanity
  const syncPrices = useCallback(async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      // Получаем актуальное состояние корзины из setCart
      let currentItems: CartItem[] = [];
      setCart((prev) => {
        currentItems = prev.items;
        return prev;
      });

      if (currentItems.length === 0) {
        setIsSyncing(false);
        return;
      }

      console.log('Syncing prices for', currentItems.length, 'items');

      // Получаем ID всех товаров в корзине
      const productIds = [...new Set(currentItems.map(item => item.id))];

      // Запрашиваем актуальные цены из Sanity
      const products = await sanityClient.fetch(
        `*[_type == "product" && _id in $ids]{ _id, price }`,
        { ids: productIds }
      );

      console.log('Received prices from Sanity:', products);

      // Создаем мапу ID -> цена
      const priceMap = new Map(products.map((p: any) => [p._id, p.price]));

      // Обновляем цены в корзине
      setCart((prev) => {
        let hasChanges = false;
        const updatedItems = prev.items.map((item): CartItem => {
          const newPrice = priceMap.get(item.id);
          if (newPrice !== undefined && typeof newPrice === 'number' && newPrice !== item.price) {
            hasChanges = true;
            console.log(`Price updated for ${item.name}: ${item.price} → ${newPrice}`);
            return { ...item, price: newPrice };
          }
          return item;
        });

        // Если цены не изменились, не обновляем state
        if (!hasChanges) {
          console.log('No price changes detected');
          return prev;
        }

        // Пересчитываем total и itemCount
        const total = updatedItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        const itemCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);

        const updatedCart = {
          items: updatedItems,
          total,
          itemCount,
        };

        console.log('Cart prices synced, new total:', total);

        // Явно сохраняем обновленную корзину в localStorage
        storage.set('cart', updatedCart);

        return updatedCart;
      });
    } catch (error) {
      console.error('Error syncing cart prices:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = storage.get<Cart>('cart', {
      items: [],
      total: 0,
      itemCount: 0,
    });
    setCart(savedCart);

    // Если есть товары, запускаем синхронизацию цен
    if (savedCart.items.length > 0) {
      // Небольшая задержка, чтобы state успел обновиться
      setTimeout(() => {
        syncPrices();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Запускаем только один раз при монтировании

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
    syncPrices,
  };
}
