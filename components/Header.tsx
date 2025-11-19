'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { Search, ShoppingCart, Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import CartSidebar from './CartSidebar';
import SearchModal from './SearchModal';

const languages = [
  { code: 'bg', name: 'BG', flag: '🇧🇬' },
  { code: 'ru', name: 'RU', flag: '🇷🇺' },
  { code: 'en', name: 'EN', flag: '🇬🇧' }
];

interface HeaderProps {
  forceWhite?: boolean;
}

export default function Header({ forceWhite = false }: HeaderProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { cart, isCartOpen, openCart, closeCart } = useCart();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isWhite, setIsWhite] = useState(forceWhite);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const langDropdownRefMobile = React.useRef<HTMLDivElement>(null);
  const langDropdownRefDesktop = React.useRef<HTMLDivElement>(null);
  const langButtonRefMobile = React.useRef<HTMLButtonElement>(null);

  // Проверяем размер экрана и позицию скролла при монтировании компонента
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Устанавливаем начальные значения только на клиенте
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    setLastScrollY(currentScrollY);
    if (!forceWhite && currentScrollY > 300) {
      setIsWhite(true);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [forceWhite]);

  // Обработчик клика вне выпадающего меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isMobileDropdown = langDropdownRefMobile.current && !langDropdownRefMobile.current.contains(event.target as Node);
      const isDesktopDropdown = langDropdownRefDesktop.current && !langDropdownRefDesktop.current.contains(event.target as Node);

      if (isMobileDropdown && isDesktopDropdown) {
        setIsLangOpen(false);
      }
    };

    const updateButtonRect = () => {
      if (isLangOpen && langButtonRefMobile.current) {
        setButtonRect(langButtonRefMobile.current.getBoundingClientRect());
      }
    };

    if (isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updateButtonRect);
      window.addEventListener('resize', updateButtonRect);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateButtonRect);
      window.removeEventListener('resize', updateButtonRect);
    };
  }, [isLangOpen]);

  useEffect(() => {
    const handleScroll = () => {
      // Игнорируем скролл на мобильных устройствах
      if (isMobile) return;

      // Если forceWhite активен, пропускаем логику изменения цвета
      if (forceWhite) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Управляем видимостью хедера
      if (currentScrollY <= 300) {
        // В hero зоне (0-300px) - всегда видимый и прозрачный
        setIsVisible(true);
        setIsWhite(false);
      } else {
        // За пределами hero зоны - управляем видимостью по направлению скролла
        if (currentScrollY > lastScrollY) {
          // Скроллим вниз - скрываем хедер
          setIsVisible(false);
          // Меняем цвет на белый ПОСЛЕ того как хедер полностью скрылся (500ms - время анимации)
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setIsWhite(true);
          }, 500);
        } else if (currentScrollY < lastScrollY) {
          // Скроллим вверх - СНАЧАЛА меняем цвет на белый (пока хедер скрыт), ПОТОМ показываем
          setIsWhite(true);
          // Даем время чтобы состояние обновилось, потом показываем
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [lastScrollY, isMobile, forceWhite]);

  const switchLanguage = (newLocale: string) => {
    // Убираем текущую локаль из начала пути
    const pathWithoutLocale = pathname.startsWith(`/${locale}`)
      ? pathname.slice(`/${locale}`.length) || '/'
      : pathname;

    // Используем роутер из next-intl для переключения языка
    router.replace(pathWithoutLocale, { locale: newLocale });
    setIsLangOpen(false);
  };

  const currentLang = languages.find(lang => lang.code === locale);

  // Вычисляем прогресс перехода от белого к прозрачному в зоне 0-300px
  const getOpacity = () => {
    if (forceWhite) return 1; // Всегда непрозрачный белый для страниц с forceWhite
    if (scrollY <= 300 && isWhite) {
      // Плавный переход от белого (1) к прозрачному (0) в диапазоне 300-0px
      return Math.max(0, scrollY / 300);
    }
    return isWhite ? 1 : 0;
  };

  const opacity = getOpacity();
  const backgroundColor = `rgba(255, 255, 255, ${opacity})`;
  const blurAmount = Math.round(opacity * 20);
  const isInHero = forceWhite ? false : opacity < 0.5;

  return (
    <header
      className="lg:fixed top-0 left-0 right-0 relative lg:relative-none"
      style={{
        background: backgroundColor,
        backdropFilter: opacity === 1 ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: opacity === 1 ? 'blur(20px) saturate(180%)' : 'none',
        transform: !isMobile && isVisible ? 'translateY(0)' : !isMobile ? 'translateY(-100%)' : 'translateY(0)',
        transition: !isMobile ? 'transform 0.5s linear, background 0.15s ease-out, backdrop-filter 0.15s ease-out' : 'none',
        zIndex: 100,
      }}
    >
      {/* Mobile Header - белая часть с кнопками в 2 ряда */}
      <div className="lg:hidden bg-white" style={{ position: 'relative', zIndex: 100 }}>
        {/* Логотип сверху */}
        <div className="flex flex-col items-center py-6 border-b border-gray-100">
          <a href={`/${locale}`} className="flex flex-col items-center">
            <h1 className="text-[32px] leading-none font-cormorant" style={{ letterSpacing: '0.05em' }}>
              <span className="font-semibold" style={{ fontWeight: 600, color: '#d06634' }}>RODA</span>
              <span className="font-light" style={{ fontWeight: 300, color: '#d06634' }}>SOLEIL</span>
            </h1>
            <span className="text-[11px] font-light uppercase font-raleway mt-2" style={{ letterSpacing: '0.35em', color: '#d06634', opacity: 0.7 }}>
              Smart Swimwear
            </span>
          </a>
        </div>

        {/* Первый ряд кнопок */}
        <div className="flex items-center justify-center gap-16 px-6 py-4 border-b border-gray-100">
          <a
            href={`/${locale}`}
            className="text-[15px] uppercase font-raleway"
            style={{ letterSpacing: '0.08em', color: 'rgba(0, 0, 0, 0.9)', fontWeight: 400, marginRight: 'auto', marginLeft: '10%' }}
          >
            {locale === 'bg' ? 'Начало' : locale === 'ru' ? 'Главная' : 'SHOP'}
          </a>
          <a
            href={`/${locale}/catalog`}
            className="text-[15px] uppercase font-raleway"
            style={{ letterSpacing: '0.08em', color: 'rgba(0, 0, 0, 0.9)', fontWeight: 400 }}
          >
            {locale === 'bg' ? 'Каталог' : locale === 'ru' ? 'Каталог' : 'CATALOG'}
          </a>
          {/* Language Selector - Mobile */}
          <div ref={langDropdownRefMobile} className="relative" style={{ marginLeft: 'auto', marginRight: '10%' }}>
            <button
              ref={langButtonRefMobile}
              onClick={() => {
                if (langButtonRefMobile.current) {
                  setButtonRect(langButtonRefMobile.current.getBoundingClientRect());
                }
                setIsLangOpen(!isLangOpen);
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full transition-all"
              style={{
                background: 'rgba(229, 217, 207, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(208, 102, 52, 0.15)',
              }}
              aria-label="Select language"
            >
              <Globe className="w-3.5 h-3.5" style={{ color: '#d06634' }} />
              <span className="text-[12px]" style={{ letterSpacing: '0.05em', color: '#d06634', fontWeight: 500 }}>{currentLang?.name}</span>
            </button>

            {/* Mobile Language Dropdown */}
            <AnimatePresence>
              {isLangOpen && buttonRect && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'linear' }}
                  className="w-36 rounded-xl overflow-hidden"
                  style={{
                    position: 'fixed',
                    top: `${buttonRect.bottom + 8}px`,
                    right: `${window.innerWidth - buttonRect.right + (buttonRect.width - 144) / 2}px`,
                    background: 'rgb(51 51 51 / 55%)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 12px 40px rgba(208, 102, 52, 0.15), inset 0 1px 2px rgba(255, 245, 236, 0.3)',
                    zIndex: 110,
                  }}
                >
                  {languages.map((lang, index) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className={`w-full text-left px-3 py-2 cursor-pointer text-sm ${
                        locale === lang.code
                          ? 'font-medium'
                          : ''
                      } ${index !== languages.length - 1 ? 'border-b border-white/10' : ''}`}
                      style={{
                        background: locale === lang.code ? 'rgba(208, 102, 52, 0.12)' : 'transparent',
                        color: '#FFFFFF',
                        fontWeight: locale === lang.code ? 500 : 300,
                        transition: 'all 0.3s linear'
                      }}
                      onMouseEnter={(e) => {
                        if (locale !== lang.code) {
                          e.currentTarget.style.background = 'rgba(208, 102, 52, 0.08)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (locale !== lang.code) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{lang.flag}</span>
                        <span className="text-xs" style={{ letterSpacing: '0.03em' }}>{lang.name}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Второй ряд кнопок */}
        <div className="flex items-center justify-center gap-16 px-6 py-4">
          <a
            href={`/${locale}/about`}
            className="text-[15px] uppercase font-raleway"
            style={{ letterSpacing: '0.08em', color: 'rgba(0, 0, 0, 0.9)', fontWeight: 400, marginRight: 'auto', marginLeft: '15%', whiteSpace: 'nowrap' }}
          >
            {locale === 'bg' ? 'За нас' : locale === 'ru' ? 'О нас' : 'ABOUT'}
          </a>
          <a
            href={`/${locale}/contacts`}
            className="text-[15px] uppercase font-raleway"
            style={{ letterSpacing: '0.08em', color: 'rgba(0, 0, 0, 0.9)', fontWeight: 400 }}
          >
            {locale === 'bg' ? 'Контакти' : locale === 'ru' ? 'Контакты' : 'CONTACTS'}
          </a>
          <button
            onClick={openCart}
            className="relative p-1.5"
            style={{ marginLeft: 'auto', marginRight: '10%' }}
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" style={{ color: '#d06634' }} />
            {cart.itemCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center"
                style={{
                  background: '#d06634',
                  fontWeight: 600,
                  fontSize: '9px'
                }}
              >
                {cart.itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-[70px] md:h-[80px]">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full transition-all z-50"
            style={{
              background: 'rgba(229, 217, 207, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" style={{ color: isInHero ? '#FFFFFF' : '#d06634' }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: isInHero ? '#FFFFFF' : '#d06634' }} />
            )}
          </button>

          {/* Left Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-4 lg:space-x-5 xl:space-x-10 flex-1 max-w-[45%]">
            <a
              href={`/${locale}`}
              className="hover:opacity-100 font-light cursor-pointer text-[13px] lg:text-[14px] xl:text-[16px] tracking-[0.08em] py-2 uppercase whitespace-nowrap"
              style={{ fontWeight: 300, color: isInHero ? '#FFFFFF' : '#d06634', transition: 'all 0.3s linear' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isInHero ? 'rgba(208, 102, 52, 0.9)' : '#E89970';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isInHero ? '#FFFFFF' : '#d06634';
                e.currentTarget.style.opacity = '1';
              }}
            >
              {locale === 'bg' ? 'Начало' : locale === 'ru' ? 'Главная' : 'Home'}
            </a>
            <a
              href={`/${locale}/catalog`}
              className="hover:opacity-100 font-light cursor-pointer text-[13px] lg:text-[14px] xl:text-[16px] tracking-[0.08em] py-2 uppercase whitespace-nowrap"
              style={{ fontWeight: 300, color: isInHero ? '#FFFFFF' : '#d06634', transition: 'all 0.3s linear' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isInHero ? 'rgba(208, 102, 52, 0.9)' : '#E89970';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isInHero ? '#FFFFFF' : '#d06634';
                e.currentTarget.style.opacity = '1';
              }}
            >
              {locale === 'bg' ? 'Каталог' : locale === 'ru' ? 'Каталог' : 'Catalog'}
            </a>
            <a
              href={`/${locale}/about`}
              className="hover:opacity-100 font-light cursor-pointer text-[13px] lg:text-[14px] xl:text-[16px] tracking-[0.08em] py-2 uppercase whitespace-nowrap"
              style={{ fontWeight: 300, color: isInHero ? '#FFFFFF' : '#d06634', transition: 'all 0.3s linear' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isInHero ? 'rgba(208, 102, 52, 0.9)' : '#E89970';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isInHero ? '#FFFFFF' : '#d06634';
                e.currentTarget.style.opacity = '1';
              }}
            >
              {locale === 'bg' ? 'За нас' : locale === 'ru' ? 'О нас' : 'About'}
            </a>
            <a
              href={`/${locale}/contacts`}
              className="hover:opacity-100 font-light cursor-pointer text-[13px] lg:text-[14px] xl:text-[16px] tracking-[0.08em] py-2 uppercase whitespace-nowrap"
              style={{ fontWeight: 300, color: isInHero ? '#FFFFFF' : '#d06634', transition: 'all 0.3s linear' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isInHero ? 'rgba(208, 102, 52, 0.9)' : '#E89970';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isInHero ? '#FFFFFF' : '#d06634';
                e.currentTarget.style.opacity = '1';
              }}
            >
              {locale === 'bg' ? 'Контакти' : locale === 'ru' ? 'Контакты' : 'Contacts'}
            </a>
          </nav>

          {/* Center Logo - абсолютное центрирование, адаптивный размер */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <a
              href={`/${locale}`}
              className="flex flex-col items-center cursor-pointer gap-0.5 md:gap-1 group relative"
              style={{ transition: 'transform 0.3s ease-out' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                const roda = e.currentTarget.querySelector('.logo-roda') as HTMLElement;
                const soleil = e.currentTarget.querySelector('.logo-soleil') as HTMLElement;
                const bulgaria = e.currentTarget.querySelector('.logo-bulgaria') as HTMLElement;

                if (roda) {
                  roda.style.color = isInHero ? 'rgba(208, 102, 52, 0.95)' : '#E89970';
                  roda.style.textShadow = isInHero
                    ? '0 0 20px rgba(208, 102, 52, 0.4), 0 0 40px rgba(208, 102, 52, 0.2)'
                    : '0 0 15px rgba(232, 153, 112, 0.5)';
                }
                if (soleil) {
                  soleil.style.color = isInHero ? 'rgba(208, 102, 52, 0.9)' : '#E89970';
                  soleil.style.textShadow = isInHero
                    ? '0 0 20px rgba(208, 102, 52, 0.3), 0 0 40px rgba(208, 102, 52, 0.15)'
                    : '0 0 15px rgba(232, 153, 112, 0.4)';
                }
                if (bulgaria) {
                  bulgaria.style.color = isInHero ? 'rgba(208, 102, 52, 0.85)' : 'rgba(232, 153, 112, 0.9)';
                  bulgaria.style.textShadow = '0 0 12px rgba(208, 102, 52, 0.3)';
                  bulgaria.style.letterSpacing = '0.40em';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                const roda = e.currentTarget.querySelector('.logo-roda') as HTMLElement;
                const soleil = e.currentTarget.querySelector('.logo-soleil') as HTMLElement;
                const bulgaria = e.currentTarget.querySelector('.logo-bulgaria') as HTMLElement;

                if (roda) {
                  roda.style.color = isInHero ? '#fff6e9' : '#d06634';
                  roda.style.textShadow = 'none';
                }
                if (soleil) {
                  soleil.style.color = isInHero ? '#fff6e9' : '#d06634';
                  soleil.style.textShadow = 'none';
                }
                if (bulgaria) {
                  bulgaria.style.color = isInHero ? 'rgba(255, 255, 255, 0.7)' : 'rgba(208, 102, 52, 0.6)';
                  bulgaria.style.textShadow = 'none';
                  bulgaria.style.letterSpacing = '0.38em';
                }
              }}
            >
              <h1 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[38px] xl:text-[44px] leading-none font-cormorant" style={{ letterSpacing: '0.03em' }}>
                <span className="logo-roda font-semibold" style={{ fontWeight: 600, color: isInHero ? '#fff6e9' : '#d06634', transition: 'all 0.4s ease-out' }}>RODA</span>
                <span className="logo-soleil font-light ml-1.5 md:ml-2" style={{ fontWeight: 300, color: isInHero ? '#fff6e9' : '#d06634', transition: 'all 0.4s ease-out' }}>Soleil</span>
              </h1>
              <span
                className="logo-bulgaria text-[10px] sm:text-[11px] md:text-[12px] lg:text-[12px] xl:text-[13px] font-light uppercase font-raleway"
                style={{ letterSpacing: '0.38em', fontWeight: 300, color: isInHero ? 'rgba(255, 255, 255, 0.7)' : 'rgba(208, 102, 52, 0.6)', transition: 'all 0.4s ease-out' }}
              >
                Bulgaria
              </span>
            </a>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 lg:space-x-2.5 xl:space-x-3 flex-1 justify-end max-w-[45%]">
            {/* Language Selector */}
            <div ref={langDropdownRefDesktop} className="relative" style={{ zIndex: 50 }}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 lg:space-x-1.5 px-2 lg:px-2.5 xl:px-3 py-1.5 lg:py-2 rounded-full transition-all cursor-pointer"
                style={{
                  background: 'rgba(229, 217, 207, 0.08)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(208, 102, 52, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.25)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(208, 102, 52, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(229, 217, 207, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                aria-label="Select language"
              >
                <Globe className="w-3.5 lg:w-4 h-3.5 lg:h-4" style={{ color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }} />
                <span className="font-light text-[12px] lg:text-[13px]" style={{ letterSpacing: '0.05em', color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }}>{currentLang?.name}</span>
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'linear' }}
                    className="absolute right-0 mt-2 w-36 rounded-xl overflow-hidden"
                    style={{
                      background: 'rgb(51 51 51 / 55%)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 12px 40px rgba(208, 102, 52, 0.15), inset 0 1px 2px rgba(255, 245, 236, 0.3)',
                      zIndex: 60,
                    }}
                  >
                    {languages.map((lang, index) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        className={`w-full text-left px-3 py-2 cursor-pointer text-sm ${
                          locale === lang.code
                            ? 'font-medium'
                            : ''
                        } ${index !== languages.length - 1 ? 'border-b border-white/10' : ''}`}
                        style={{
                          background: locale === lang.code ? 'rgba(208, 102, 52, 0.12)' : 'transparent',
                          color: '#FFFFFF',
                          fontWeight: locale === lang.code ? 500 : 300,
                          transition: 'all 0.3s linear'
                        }}
                        onMouseEnter={(e) => {
                          if (locale !== lang.code) {
                            e.currentTarget.style.background = 'rgba(208, 102, 52, 0.08)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (locale !== lang.code) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-base">{lang.flag}</span>
                          <span className="text-xs" style={{ letterSpacing: '0.03em' }}>{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 lg:p-2 rounded-full transition-all cursor-pointer"
              style={{
                background: 'rgba(229, 217, 207, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(208, 102, 52, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.25)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(208, 102, 52, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(229, 217, 207, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="Search"
            >
              <Search className="w-4 lg:w-[18px] h-4 lg:h-[18px]" style={{ color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }} />
            </button>

            {/* Cart Icon with Counter */}
            <button
              onClick={openCart}
              className="p-1.5 lg:p-2 rounded-full transition-all relative cursor-pointer"
              style={{
                background: 'rgba(229, 217, 207, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(208, 102, 52, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.25)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(208, 102, 52, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(229, 217, 207, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 lg:w-[18px] h-4 lg:h-[18px]" style={{ color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }} />
              {cart.itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-[10px] rounded-full w-[18px] h-[18px] flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #E89970 0%, #d06634 100%)',
                    fontWeight: 600,
                    boxShadow: '0 2px 6px rgba(208, 102, 52, 0.3)',
                  }}
                >
                  {cart.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Elegant separator line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 245, 236, 0.22) 20%, rgba(255, 245, 236, 0.22) 80%, transparent 100%)',
        }}
      />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 top-[70px] lg:hidden z-40"
            style={{
              background: 'rgba(250, 248, 244, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <nav className="flex flex-col p-6 space-y-6">
              <a
                href={`/${locale}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-light py-3 border-b border-[#d06634]/20 uppercase tracking-wider"
                style={{ color: '#d06634', fontWeight: 300 }}
              >
                {locale === 'bg' ? 'Начало' : locale === 'ru' ? 'Главная' : 'Home'}
              </a>
              <a
                href={`/${locale}/catalog`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-light py-3 border-b border-[#d06634]/20 uppercase tracking-wider"
                style={{ color: '#d06634', fontWeight: 300 }}
              >
                {locale === 'bg' ? 'Каталог' : locale === 'ru' ? 'Каталог' : 'Catalog'}
              </a>
              <a
                href={`/${locale}/about`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-light py-3 border-b border-[#d06634]/20 uppercase tracking-wider"
                style={{ color: '#d06634', fontWeight: 300 }}
              >
                {locale === 'bg' ? 'За нас' : locale === 'ru' ? 'О нас' : 'About'}
              </a>
              <a
                href={`/${locale}/contacts`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-light py-3 border-b border-[#d06634]/20 uppercase tracking-wider"
                style={{ color: '#d06634', fontWeight: 300 }}
              >
                {locale === 'bg' ? 'Контакти' : locale === 'ru' ? 'Контакты' : 'Contacts'}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
