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
      className="relative w-full py-5 md:py-6 overflow-hidden"
      style={{
        background: 'rgb(26, 26, 26)',
      }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-lg md:text-xl lg:text-2xl leading-relaxed font-montserrat"
          style={{
            color: '#FFFFFF',
            fontWeight: 300,
            letterSpacing: '0.05em',
            lineHeight: 1.4
          }}
        >
          {t('text')}
        </motion.p>
      </div>
    </section>
  );
}
