'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingCart, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'bg', name: 'BG', flag: '🇧🇬' },
  { code: 'ru', name: 'RU', flag: '🇷🇺' },
  { code: 'en', name: 'EN', flag: '🇬🇧' }
];

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isInHero, setIsInHero] = useState(true);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Проверяем позицию скролла при монтировании компонента
  useEffect(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 0) {
      setIsInHero(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Отменяем предыдущий таймер если он есть
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Если в самом верху - всегда прозрачный и видимый
      if (currentScrollY === 0) {
        setIsInHero(true);
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Скроллим вниз - сначала скрываем хедер, потом меняем цвет
        setIsVisible(false);
        timeoutRef.current = setTimeout(() => {
          setIsInHero(false); // Затемняем после того как хедер скрылся
        }, 500); // Ждем завершения анимации скрытия
      } else if (currentScrollY < lastScrollY) {
        // Скроллим вверх - темный хедер, показываем сразу
        setIsInHero(false);
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [lastScrollY]);

  const switchLanguage = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsLangOpen(false);
  };

  const currentLang = languages.find(lang => lang.code === locale);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: isInHero ? 'transparent' : 'rgba(249, 246, 243, 0.95)',
        backdropFilter: isInHero ? 'none' : 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: isInHero ? 'none' : 'blur(20px) saturate(180%)',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'background 0.3s linear, transform 0.5s linear, backdrop-filter 0.3s linear',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[75px]">
          {/* Left Navigation */}
          <nav className="hidden md:flex items-center space-x-12 flex-1">
            <a
              href={`/${locale}`}
              className="hover:opacity-100 font-light cursor-pointer text-[17px] tracking-[0.08em] py-2 uppercase"
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
              className="hover:opacity-100 font-light cursor-pointer text-[17px] tracking-[0.08em] py-2 uppercase"
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
              className="hover:opacity-100 font-light cursor-pointer text-[17px] tracking-[0.08em] py-2 uppercase"
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
          </nav>

          {/* Center Logo */}
          <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2">
            <a href={`/${locale}`} className="flex flex-col items-center cursor-pointer gap-0.5 group">
              <h1 className="text-[32px] md:text-[42px] leading-none font-cormorant" style={{ letterSpacing: '0.02em' }}>
                <span className="font-semibold group-hover:opacity-100" style={{ fontWeight: 600, color: isInHero ? '#fff6e9' : '#d06634', transition: 'all 0.5s linear' }}>RODA</span>
                <span className="font-light group-hover:opacity-100 ml-2" style={{ fontWeight: 300, color: isInHero ? '#fff6e9' : '#d06634', transition: 'all 0.5s linear' }}>Soleil</span>
              </h1>
              <span
                className="text-[13px] md:text-[14px] font-light group-hover:opacity-100 uppercase font-raleway -mt-0.5"
                style={{ letterSpacing: '0.35em', fontWeight: 300, color: isInHero ? 'rgba(255, 255, 255, 0.7)' : 'rgba(208, 102, 52, 0.6)', transition: 'all 0.5s linear' }}
              >
                Bulgaria
              </span>
            </a>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3 flex-1 justify-end">
            {/* Language Selector with Glassmorphism */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all cursor-pointer"
                style={{
                  background: 'rgba(229, 217, 207, 0.1)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(208, 102, 52, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(208, 102, 52, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(229, 217, 207, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                aria-label="Select language"
              >
                <Globe className="w-[17px] h-[17px]" style={{ color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }} />
                <span className="font-light text-[14px]" style={{ letterSpacing: '0.05em', color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }}>{currentLang?.name}</span>
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'linear' }}
                    className="absolute right-0 mt-3 w-44 rounded-2xl overflow-hidden"
                    style={{
                      background: 'rgb(51 51 51 / 55%)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 12px 40px rgba(208, 102, 52, 0.15), inset 0 1px 2px rgba(255, 245, 236, 0.3)',
                    }}
                  >
                    {languages.map((lang, index) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        className={`w-full text-left px-4 py-3 cursor-pointer text-sm ${
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
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm" style={{ letterSpacing: '0.03em' }}>{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Icon */}
            <button
              className="p-2.5 rounded-full transition-all cursor-pointer"
              style={{
                background: 'rgba(229, 217, 207, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(208, 102, 52, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.3)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(208, 102, 52, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(229, 217, 207, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="Search"
            >
              <Search className="w-[20px] h-[20px]" style={{ color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }} />
            </button>

            {/* Cart Icon with Counter */}
            <button
              className="p-2.5 rounded-full transition-all relative cursor-pointer"
              style={{
                background: 'rgba(229, 217, 207, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(208, 102, 52, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.3)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(208, 102, 52, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(229, 217, 207, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-[20px] h-[20px]" style={{ color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }} />
              <span
                className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #E89970 0%, #d06634 100%)',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(208, 102, 52, 0.3)',
                }}
              >
                0
              </span>
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
    </header>
  );
}
