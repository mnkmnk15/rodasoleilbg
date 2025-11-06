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
        background: isInHero ? 'transparent' : '#ffffff',
        backdropFilter: isInHero ? 'none' : 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: isInHero ? 'none' : 'blur(20px) saturate(180%)',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'background 0.3s linear, transform 0.5s linear, backdrop-filter 0.3s linear',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-[80px]">
          {/* Left Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10 flex-1">
            <a
              href={`/${locale}`}
              className="hover:opacity-100 font-light cursor-pointer text-[15px] xl:text-[16px] tracking-[0.08em] py-2 uppercase whitespace-nowrap"
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
              className="hover:opacity-100 font-light cursor-pointer text-[15px] xl:text-[16px] tracking-[0.08em] py-2 uppercase whitespace-nowrap"
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
              className="hover:opacity-100 font-light cursor-pointer text-[15px] xl:text-[16px] tracking-[0.08em] py-2 uppercase whitespace-nowrap"
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
              className="hover:opacity-100 font-light cursor-pointer text-[15px] xl:text-[16px] tracking-[0.08em] py-2 uppercase whitespace-nowrap"
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

          {/* Center Logo - абсолютное центрирование */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <a
              href={`/${locale}`}
              className="flex flex-col items-center cursor-pointer gap-1 group relative"
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
              <h1 className="text-[36px] md:text-[44px] leading-none font-cormorant" style={{ letterSpacing: '0.03em' }}>
                <span className="logo-roda font-semibold" style={{ fontWeight: 600, color: isInHero ? '#fff6e9' : '#d06634', transition: 'all 0.4s ease-out' }}>RODA</span>
                <span className="logo-soleil font-light ml-2.5" style={{ fontWeight: 300, color: isInHero ? '#fff6e9' : '#d06634', transition: 'all 0.4s ease-out' }}>Soleil</span>
              </h1>
              <span
                className="logo-bulgaria text-[12px] md:text-[13px] font-light uppercase font-raleway"
                style={{ letterSpacing: '0.38em', fontWeight: 300, color: isInHero ? 'rgba(255, 255, 255, 0.7)' : 'rgba(208, 102, 52, 0.6)', transition: 'all 0.4s ease-out' }}
              >
                Bulgaria
              </span>
            </a>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3 flex-1 justify-end">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-full transition-all cursor-pointer"
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
                <Globe className="w-4 h-4" style={{ color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }} />
                <span className="font-light text-[13px]" style={{ letterSpacing: '0.05em', color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }}>{currentLang?.name}</span>
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
              className="p-2 rounded-full transition-all cursor-pointer"
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
              <Search className="w-[18px] h-[18px]" style={{ color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }} />
            </button>

            {/* Cart Icon with Counter */}
            <button
              className="p-2 rounded-full transition-all relative cursor-pointer"
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
              <ShoppingCart className="w-[18px] h-[18px]" style={{ color: isInHero ? '#FFFFFF' : '#d06634', transition: 'color 0.3s linear' }} />
              <span
                className="absolute -top-1 -right-1 text-white text-[10px] rounded-full w-[18px] h-[18px] flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #E89970 0%, #d06634 100%)',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(208, 102, 52, 0.3)',
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
