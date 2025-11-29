// Типы данных для формы оформления заказа

export type PaymentMethod = 'card' | 'cash_on_delivery';
export type DeliveryMethod = 'econt_office' | 'econt_address' | 'pickup_burgas';

export interface EcontOffice {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  address: {
    city: {
      id: number;
      name: string;
      nameEn: string;
      postCode: string;
    };
    fullAddress: string;
    fullAddressEn: string;
  };
  isOffice: boolean;
  isAPS: boolean; // Automated Parcel Station (автомат)
}

export interface EcontCity {
  id: number;
  name: string;
  nameEn: string;
  postCode: string;
  countryCode: string;
}

export interface CheckoutFormData {
  // Личные данные
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Способ оплаты
  paymentMethod: PaymentMethod;

  // Способ доставки
  deliveryMethod: DeliveryMethod;

  // Для доставки в офис/автомат Econt
  econtOfficeId?: number;
  econtOfficeCode?: string;
  econtOfficeName?: string;

  // Для доставки на адрес
  city?: string;
  cityId?: number;
  postalCode?: string;
  address?: string;

  // Примечания к заказу
  notes?: string;

  // Промокод
  promoCode?: string;

  // Honeypot (защита от ботов)
  honeypot?: string;
}

export interface OrderData extends CheckoutFormData {
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    image?: any;
  }>;
  total: number;
  deliveryPrice: number;
  grandTotal: number;
}

// Константы цен доставки (в EUR)
export const DELIVERY_PRICES = {
  econt_office: 3.0, // EUR
  econt_address: 3.5, // EUR
  pickup_burgas: 0, // Безплатно - самовивоз в Бургасе
} as const;
