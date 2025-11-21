// Validation utilities for API endpoints

import { CheckoutFormData, DeliveryMethod, PaymentMethod } from '@/types/checkout';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation - позволяем международные форматы
const PHONE_REGEX = /^[\d\s+\-()]{6,20}$/;

// Sanitize string input to prevent XSS
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 500); // Limit length
}

// Validate cart item
export interface CartItemValidation {
  id: string;
  quantity: number;
  name?: string;
  size?: string;
  color?: string;
  price?: number;
}

export function validateCartItem(item: unknown): CartItemValidation | null {
  if (!item || typeof item !== 'object') return null;

  const obj = item as Record<string, unknown>;

  // id is required and must be a non-empty string
  if (typeof obj.id !== 'string' || obj.id.trim() === '') return null;

  // quantity must be a positive integer
  const quantity = Number(obj.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return null;

  return {
    id: sanitizeString(obj.id as string),
    quantity,
    name: typeof obj.name === 'string' ? sanitizeString(obj.name) : undefined,
    size: typeof obj.size === 'string' ? sanitizeString(obj.size) : undefined,
    color: typeof obj.color === 'string' ? sanitizeString(obj.color) : undefined,
    price: typeof obj.price === 'number' && obj.price > 0 ? obj.price : undefined,
  };
}

// Validate cart items array
export function validateCartItems(items: unknown): CartItemValidation[] | null {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return null;
  }

  const validatedItems: CartItemValidation[] = [];

  for (const item of items) {
    const validated = validateCartItem(item);
    if (!validated) return null;
    validatedItems.push(validated);
  }

  return validatedItems;
}

// Validate checkout form data
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedData?: CheckoutFormData;
}

export function validateCheckoutForm(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid form data'] };
  }

  const form = data as Record<string, unknown>;

  // Required string fields
  const firstName = typeof form.firstName === 'string' ? sanitizeString(form.firstName) : '';
  const lastName = typeof form.lastName === 'string' ? sanitizeString(form.lastName) : '';
  const email = typeof form.email === 'string' ? form.email.trim().toLowerCase() : '';
  const phone = typeof form.phone === 'string' ? sanitizeString(form.phone) : '';

  // Validate required fields
  if (!firstName || firstName.length < 2) {
    errors.push('First name is required (min 2 characters)');
  }
  if (!lastName || lastName.length < 2) {
    errors.push('Last name is required (min 2 characters)');
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push('Valid email is required');
  }
  if (!phone || !PHONE_REGEX.test(phone)) {
    errors.push('Valid phone number is required');
  }

  // Validate payment method
  const paymentMethod = form.paymentMethod as string;
  if (!['card', 'cash_on_delivery'].includes(paymentMethod)) {
    errors.push('Invalid payment method');
  }

  // Validate delivery method
  const deliveryMethod = form.deliveryMethod as string;
  if (!['econt_office', 'econt_address'].includes(deliveryMethod)) {
    errors.push('Invalid delivery method');
  }

  // Validate delivery-specific fields
  if (deliveryMethod === 'econt_office') {
    if (!form.econtOfficeId || !form.econtOfficeName) {
      errors.push('Econt office selection is required');
    }
  } else if (deliveryMethod === 'econt_address') {
    if (!form.city || !form.address) {
      errors.push('City and address are required for address delivery');
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Return sanitized data
  const sanitizedData: CheckoutFormData = {
    firstName,
    lastName,
    email,
    phone,
    paymentMethod: paymentMethod as PaymentMethod,
    deliveryMethod: deliveryMethod as DeliveryMethod,
    econtOfficeId: typeof form.econtOfficeId === 'number' ? form.econtOfficeId : undefined,
    econtOfficeCode: typeof form.econtOfficeCode === 'string' ? sanitizeString(form.econtOfficeCode) : undefined,
    econtOfficeName: typeof form.econtOfficeName === 'string' ? sanitizeString(form.econtOfficeName) : undefined,
    city: typeof form.city === 'string' ? sanitizeString(form.city) : undefined,
    cityId: typeof form.cityId === 'number' ? form.cityId : undefined,
    postalCode: typeof form.postalCode === 'string' ? sanitizeString(form.postalCode) : undefined,
    address: typeof form.address === 'string' ? sanitizeString(form.address) : undefined,
    notes: typeof form.notes === 'string' ? sanitizeString(form.notes) : undefined,
  };

  return { valid: true, errors: [], sanitizedData };
}
