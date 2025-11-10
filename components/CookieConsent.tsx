'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import Cookies from 'js-cookie';

export default function CookieConsent() {
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookie-consent', 'accepted', { expires: 365 });
    setIsVisible(false);
  };

  const handleDecline = () => {
    Cookies.set('cookie-consent', 'declined', { expires: 365 });
    setIsVisible(false);
  };

  const text = {
    bg: {
      title: 'Ние използваме бисквитки',
      description: 'Използваме бисквитки, за да подобрим вашето изживяване на нашия сайт и да анализираме трафика.',
      accept: 'Приемам',
      decline: 'Отказвам',
      learnMore: 'Научи повече'
    },
    ru: {
      title: 'Мы используем cookie',
      description: 'Мы используем файлы cookie для улучшения вашего опыта на нашем сайте и анализа трафика.',
      accept: 'Принять',
      decline: 'Отклонить',
      learnMore: 'Узнать больше'
    },
    en: {
      title: 'We use cookies',
      description: 'We use cookies to improve your experience on our site and analyze traffic.',
      accept: 'Accept',
      decline: 'Decline',
      learnMore: 'Learn more'
    }
  };

  const content = text[locale as keyof typeof text] || text.en;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div
              className="bg-white rounded-3xl shadow-2xl p-6 md:p-8"
              style={{
                border: '1px solid rgba(208, 102, 52, 0.15)',
                backdropFilter: 'blur(20px)',
                background: 'rgba(255, 255, 255, 0.98)'
              }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Content */}
                <div className="flex-1 flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(208, 102, 52, 0.1)' }}
                    >
                      <Cookie className="w-7 h-7" style={{ color: '#d06634' }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-raleway mb-2" style={{ color: '#d06634', fontWeight: 600 }}>
                      {content.title}
                    </h3>
                    <p className="font-raleway text-sm md:text-base leading-relaxed" style={{ color: '#2A2422', opacity: 0.8 }}>
                      {content.description}{' '}
                      <a
                        href={`/${locale}/privacy`}
                        className="font-raleway underline transition-colors"
                        style={{ color: '#d06634', fontWeight: 500 }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#E89970';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#d06634';
                        }}
                      >
                        {content.learnMore}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button
                    onClick={handleDecline}
                    className="flex-1 md:flex-none px-6 py-3 rounded-full font-raleway font-medium transition-all"
                    style={{
                      border: '2px solid rgba(208, 102, 52, 0.3)',
                      color: '#d06634',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(208, 102, 52, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.3)';
                    }}
                  >
                    {content.decline}
                  </button>
                  <button
                    onClick={handleAccept}
                    className="flex-1 md:flex-none px-6 py-3 rounded-full text-white font-raleway font-medium transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #d06634 0%, #E89970 100%)',
                      boxShadow: '0 4px 16px rgba(208, 102, 52, 0.3)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 24px rgba(208, 102, 52, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(208, 102, 52, 0.3)';
                    }}
                  >
                    {content.accept}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
