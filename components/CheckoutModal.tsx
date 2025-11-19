'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/sanity/config';
import { useTranslations } from 'next-intl';
import {
  CheckoutFormData,
  PaymentMethod,
  DeliveryMethod,
  EcontOffice,
  EcontCity,
  DELIVERY_PRICES,
} from '@/types/checkout';

interface CartItem {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: any;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onSubmit: (data: CheckoutFormData) => void;
  isLoading?: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onSubmit,
  isLoading = false,
}: CheckoutModalProps) {
  const t = useTranslations('checkout');
  const tCart = useTranslations('cart');
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: 'cash_on_delivery',
    deliveryMethod: 'econt_office',
    notes: '',
  });

  // Валидация
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [deliveryError, setDeliveryError] = useState('');

  // Данные для селектов
  const [cities, setCities] = useState<EcontCity[]>([]);
  const [offices, setOffices] = useState<EcontOffice[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingOffices, setLoadingOffices] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [officeSearch, setOfficeSearch] = useState('');

  // Dropdown states
  const [showOfficeDropdown, setShowOfficeDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const officeDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Загрузка городов и офисов при открытии модалки
  useEffect(() => {
    if (isOpen) {
      fetchCities();
      // Для офисов загружаем сразу все
      if (formData.deliveryMethod === 'econt_office') {
        fetchAllOffices();
      }
    }
  }, [isOpen, formData.deliveryMethod]);

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        officeDropdownRef.current &&
        !officeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowOfficeDropdown(false);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCities = async () => {
    setLoadingCities(true);
    try {
      const response = await fetch('/api/econt/cities');
      const data = await response.json();
      if (data.cities) {
        setCities(data.cities);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchAllOffices = async () => {
    setLoadingOffices(true);
    try {
      const response = await fetch('/api/econt/offices');
      const data = await response.json();
      if (data.offices) {
        setOffices(data.offices);
      }
    } catch (error) {
      console.error('Error fetching offices:', error);
    } finally {
      setLoadingOffices(false);
    }
  };

  // Фильтрация городов по поиску с лимитом для производительности
  const filteredCities = useMemo(() => {
    if (!citySearch || citySearch.length < 2) {
      // Показываем только первые 50 городов если нет поиска
      return cities.slice(0, 50);
    }
    const search = citySearch.toLowerCase();
    const filtered = cities.filter(
      (city) =>
        city.name.toLowerCase().includes(search) ||
        city.nameEn.toLowerCase().includes(search) ||
        city.postCode.includes(search)
    );
    // Ограничиваем до 100 результатов
    return filtered.slice(0, 100);
  }, [cities, citySearch]);

  // Фильтрация офисов по поиску с лимитом
  const filteredOffices = useMemo(() => {
    if (!officeSearch || officeSearch.length < 2) {
      // Показываем только первые 50 офисов если нет поиска
      return offices.slice(0, 50);
    }
    const search = officeSearch.toLowerCase();
    const filtered = offices.filter(
      (office) =>
        office.name.toLowerCase().includes(search) ||
        office.address.city.name.toLowerCase().includes(search) ||
        office.address.fullAddress.toLowerCase().includes(search) ||
        office.code.toLowerCase().includes(search)
    );
    // Ограничиваем до 100 результатов
    return filtered.slice(0, 100);
  }, [offices, officeSearch]);

  // Валидация email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('');
      return true;
    }
    if (!emailRegex.test(email)) {
      setEmailError(t('invalidEmail'));
      return false;
    }
    setEmailError('');
    return true;
  };

  // Валидация телефона (болгарский формат)
  const validatePhone = (phone: string) => {
    if (!phone) {
      setPhoneError('');
      return true;
    }

    // Убираем пробелы и дефисы
    const cleanPhone = phone.replace(/[\s-]/g, '');

    // Болгарский номер: 10 цифр с 0 или 12 цифр с +359
    const phoneRegex1 = /^0\d{9}$/; // 0888123456
    const phoneRegex2 = /^\+359\d{9}$/; // +359888123456

    if (!phoneRegex1.test(cleanPhone) && !phoneRegex2.test(cleanPhone)) {
      setPhoneError(t('invalidPhone'));
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Валидация в реальном времени
    if (name === 'email') {
      validateEmail(value);
    }
    if (name === 'phone') {
      validatePhone(value);
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handleDeliveryMethodChange = (method: DeliveryMethod) => {
    setFormData((prev) => ({ ...prev, deliveryMethod: method }));
    // При смене метода доставки сбрасываем поиск
    setCitySearch('');
    setOfficeSearch('');
    setShowOfficeDropdown(false);
    setShowCityDropdown(false);

    // Загружаем офисы если выбран метод "офис"
    if (method === 'econt_office' && offices.length === 0) {
      fetchAllOffices();
    }
  };

  const handleCitySelect = (city: EcontCity) => {
    setFormData((prev) => ({
      ...prev,
      cityId: city.id,
      city: city.name,
      postalCode: city.postCode,
    }));
    setCitySearch(city.name);
    setShowCityDropdown(false);
    setDeliveryError('');
  };

  const handleOfficeSelect = (office: EcontOffice) => {
    setFormData((prev) => ({
      ...prev,
      econtOfficeId: office.id,
      econtOfficeCode: office.code,
      econtOfficeName: office.name,
      city: office.address.city.name,
      cityId: office.address.city.id,
    }));
    setOfficeSearch(
      `${office.address.city.name} - ${office.name}`
    );
    setShowOfficeDropdown(false);
    setDeliveryError('');
  };

  const calculateTotal = () => {
    const deliveryPrice =
      DELIVERY_PRICES[formData.deliveryMethod as keyof typeof DELIVERY_PRICES];
    return cartTotal + deliveryPrice;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Финальная валидация
    const isEmailValid = validateEmail(formData.email);
    const isPhoneValid = validatePhone(formData.phone);

    if (!isEmailValid || !isPhoneValid) {
      return;
    }

    // Валидация выбора офиса или адреса
    if (formData.deliveryMethod === 'econt_office') {
      if (!formData.econtOfficeId || !formData.econtOfficeCode) {
        setDeliveryError('Моля, изберете офис за доставка');
        return;
      }
    } else if (formData.deliveryMethod === 'econt_address') {
      if (!formData.city || !formData.address) {
        setDeliveryError('Моля, попълнете град и адрес за доставка');
        return;
      }
    }

    setDeliveryError('');
    onSubmit(formData);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  if (!mounted) return null;

  const deliveryPrice =
    DELIVERY_PRICES[formData.deliveryMethod as keyof typeof DELIVERY_PRICES];

  const content = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[9999] overflow-y-auto"
            onClick={onClose}
          >
            <div className="min-h-screen px-4 flex items-center justify-center py-8">
              <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Правая часть - Товары и итого */}
                  <div className="bg-gray-50 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-neutral-900">
                        {t('yourCart')}
                      </h2>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        disabled={isLoading}
                      >
                        <X className="w-5 h-5 text-neutral-700" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.id}-${item.size || ''}-${item.color || ''}`}
                          className="flex gap-3 p-3 bg-white rounded-lg"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                            {item.image ? (
                              <Image
                                src={
                                  typeof item.image === 'string'
                                    ? item.image
                                    : urlFor(item.image).url()
                                }
                                alt={item.name}
                                fill
                                className="object-cover object-top"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="text-xs">No image</span>
                              </div>
                            )}
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-neutral-900 truncate">
                              {item.name}
                            </h4>
                            {(item.size || item.color) && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.size && <span>{tCart('size')}: {item.size}</span>}
                                {item.size && item.color && <span className="mx-1">·</span>}
                                {item.color && <span>{tCart('color')}: {item.color}</span>}
                              </p>
                            )}
                            <p className="text-sm font-semibold text-neutral-900 mt-1">
                              {formatPrice(
                                (item.discountedPrice || item.price) * item.quantity
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Итого */}
                    <div className="space-y-2 pt-4 border-t border-gray-300">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t('subtotal')}:</span>
                        <span className="font-medium">{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t('delivery')}:</span>
                        <span className="font-medium">{formatPrice(deliveryPrice)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                        <span>{t('total')}:</span>
                        <span>{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>

                  {/* Левая часть - Форма */}
                  <div className="p-6 lg:p-8 overflow-y-auto max-h-[80vh]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Личные данные */}
                      <div>
                        <h3 className="text-base font-semibold mb-4">{t('yourDetails')}</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            placeholder={t('firstName')}
                            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                          />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            placeholder={t('lastName')}
                            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                          />
                          <div className="col-span-2">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              placeholder={t('email')}
                              className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                                emailError ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {emailError && (
                              <p className="text-xs text-red-600 mt-1">{emailError}</p>
                            )}
                          </div>
                          <div className="col-span-2">
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              placeholder={t('phonePlaceholder')}
                              className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                                phoneError ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {phoneError && (
                              <p className="text-xs text-red-600 mt-1">{phoneError}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Метод доставки */}
                      <div>
                        <h3 className="text-base font-semibold mb-3">{t('deliveryMethod')}</h3>
                        <div className="space-y-2">
                          <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors has-[:checked]:border-neutral-900 has-[:checked]:bg-gray-50">
                            <input
                              type="radio"
                              name="deliveryMethod"
                              checked={formData.deliveryMethod === 'econt_office'}
                              onChange={() => handleDeliveryMethodChange('econt_office')}
                              className="w-4 h-4 accent-neutral-900"
                            />
                            <div className="flex-1 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Image
                                  src="/images/econtLogo.png"
                                  alt="Econt"
                                  width={1200}
                                  height={323}
                                  className="h-5 w-auto object-contain"
                                  quality={100}
                                  priority
                                />
                                <span className="text-sm font-medium">
                                  {t('econtOffice')}
                                </span>
                              </div>
                              <span className="text-sm font-semibold">
                                {formatPrice(DELIVERY_PRICES.econt_office)}
                              </span>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors has-[:checked]:border-neutral-900 has-[:checked]:bg-gray-50">
                            <input
                              type="radio"
                              name="deliveryMethod"
                              checked={formData.deliveryMethod === 'econt_address'}
                              onChange={() => handleDeliveryMethodChange('econt_address')}
                              className="w-4 h-4 accent-neutral-900"
                            />
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-sm font-medium">{t('toAddress')}</span>
                              <span className="text-sm font-semibold">
                                {formatPrice(DELIVERY_PRICES.econt_address)}
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Выбор офиса/адреса */}
                      {formData.deliveryMethod === 'econt_office' ? (
                        <div ref={officeDropdownRef} className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('selectOffice')}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder={t('searchOffice')}
                              value={officeSearch}
                              onChange={(e) => {
                                setOfficeSearch(e.target.value);
                                setDeliveryError('');
                              }}
                              onFocus={() => setShowOfficeDropdown(true)}
                              className={`w-full px-4 py-2.5 pr-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                                deliveryError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                              }`}
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                          {deliveryError && (
                            <p className="text-xs text-red-600 mt-1">{deliveryError}</p>
                          )}

                          {/* Custom Dropdown */}
                          <AnimatePresence>
                            {showOfficeDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto"
                              >
                                {loadingOffices ? (
                                  <div className="px-4 py-3 text-sm text-gray-500">
                                    {t('loading')}
                                  </div>
                                ) : officeSearch.length < 2 ? (
                                  <div className="px-4 py-3 text-sm text-gray-500">
                                    {t('minChars')}
                                  </div>
                                ) : filteredOffices.length === 0 ? (
                                  <div className="px-4 py-3 text-sm text-gray-500">
                                    {t('noOffices')}
                                  </div>
                                ) : (
                                  <>
                                    {filteredOffices.map((office) => (
                                      <button
                                        key={office.id}
                                        type="button"
                                        onClick={() => handleOfficeSelect(office)}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                                      >
                                        <div className="flex items-start gap-2">
                                          <span className="text-base">
                                            {office.isAPS ? '📦' : '🏢'}
                                          </span>
                                          <div className="flex-1">
                                            <div className="font-medium text-neutral-900">
                                              {office.address.city.name} - {office.name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                              {office.address.fullAddress}
                                            </div>
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                    {filteredOffices.length === 100 && (
                                      <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
                                        {t('showingFirst100')}
                                      </div>
                                    )}
                                  </>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div ref={cityDropdownRef} className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('selectCity')}
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder={t('searchCity')}
                                value={citySearch}
                                onChange={(e) => {
                                  setCitySearch(e.target.value);
                                  setDeliveryError('');
                                }}
                                onFocus={() => setShowCityDropdown(true)}
                                className={`w-full px-4 py-2.5 pr-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                                  deliveryError && !formData.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                              />
                              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Custom Dropdown */}
                            <AnimatePresence>
                              {showCityDropdown && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto"
                                >
                                  {loadingCities ? (
                                    <div className="px-4 py-3 text-sm text-gray-500">
                                      {t('loading')}
                                    </div>
                                  ) : citySearch.length < 2 ? (
                                    <div className="px-4 py-3 text-sm text-gray-500">
                                      {t('minChars')}
                                    </div>
                                  ) : filteredCities.length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-gray-500">
                                      {t('noCities')}
                                    </div>
                                  ) : (
                                    <>
                                      {filteredCities.map((city) => (
                                        <button
                                          key={city.id}
                                          type="button"
                                          onClick={() => handleCitySelect(city)}
                                          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                                        >
                                          <div className="font-medium text-neutral-900">
                                            {city.name}
                                          </div>
                                          <div className="text-xs text-gray-500 mt-0.5">
                                            {t('postalCode')}: {city.postCode}
                                          </div>
                                        </button>
                                      ))}
                                      {filteredCities.length === 100 && (
                                        <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
                                          {t('showingFirst100')}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <div>
                            <input
                              type="text"
                              name="address"
                              value={formData.address || ''}
                              onChange={(e) => {
                                handleInputChange(e);
                                setDeliveryError('');
                              }}
                              required
                              placeholder={t('address')}
                              className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
                                deliveryError && !formData.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                              }`}
                            />
                            {deliveryError && (
                              <p className="text-xs text-red-600 mt-1">{deliveryError}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Начин на плащане */}
                      <div>
                        <h3 className="text-base font-semibold mb-3">{t('paymentMethod')}</h3>
                        <div className="space-y-2">
                          <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors has-[:checked]:border-neutral-900 has-[:checked]:bg-gray-50">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={formData.paymentMethod === 'cash_on_delivery'}
                              onChange={() => handlePaymentMethodChange('cash_on_delivery')}
                              className="w-4 h-4 accent-neutral-900"
                            />
                            <span className="text-sm font-medium">{t('cashOnDelivery')}</span>
                          </label>
                          <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors has-[:checked]:border-neutral-900 has-[:checked]:bg-gray-50">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={formData.paymentMethod === 'card'}
                              onChange={() => handlePaymentMethodChange('card')}
                              className="w-4 h-4 accent-neutral-900"
                            />
                            <span className="text-sm font-medium">{t('card')}</span>
                          </label>
                        </div>
                      </div>

                      {/* Примечания */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('notes')}
                        </label>
                        <textarea
                          name="notes"
                          value={formData.notes || ''}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                          placeholder={t('notesPlaceholder')}
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading || !!emailError || !!phoneError}
                        className="w-full py-3.5 bg-neutral-900 text-white text-base font-bold rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? t('processing') : t('completeOrder')}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
