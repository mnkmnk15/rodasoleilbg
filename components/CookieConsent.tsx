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
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Content */}
                <div className="flex-1 flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#FFE1AF] flex items-center justify-center">
                      <Cookie className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {content.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {content.description}{' '}
                      <a
                        href={`/${locale}/privacy`}
                        className="text-gray-900 underline hover:text-gray-700"
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
                    className="flex-1 md:flex-none px-6 py-3 border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    {content.decline}
                  </button>
                  <button
                    onClick={handleAccept}
                    className="flex-1 md:flex-none px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
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
