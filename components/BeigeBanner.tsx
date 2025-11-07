'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function BeigeBanner() {
  const t = useTranslations('beigeBanner');
  const locale = useLocale();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  return (
    <section
      ref={ref}
      className="relative w-full py-6 md:py-8 lg:py-10 overflow-hidden"
      style={{
        background: '#FFFFFF',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.55, 0.07, 0.31, 0.98] }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-montserrat"
          style={{
            color: '#2A2422',
            fontWeight: 400,
            letterSpacing: '0.04em',
            lineHeight: 1.8
          }}
        >
          {t('text')}
        </motion.p>
      </div>
    </section>
  );
}
