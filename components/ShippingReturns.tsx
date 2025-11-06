'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function ShippingReturns() {
  const t = useTranslations('shippingReturns');

  return (
    <section
      id="shipping-returns"
      className="relative py-16 md:py-20 overflow-hidden"
      style={{
        background: '#FFFFFF'
      }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3 font-cormorant tracking-wide"
            style={{ color: '#2A2422' }}
          >
            {t('title')}
          </h2>
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#d06634] to-transparent mx-auto" />
        </motion.div>

        {/* Основной контент - три колонки */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 md:gap-12 mb-10"
        >
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-light mb-3 font-cormorant"
              style={{ color: '#2A2422' }}
            >
              {t('freeBulgaria.title')}
            </h3>
            <p className="text-sm md:text-base font-raleway leading-relaxed"
              style={{ color: 'rgba(42, 36, 34, 0.7)' }}
            >
              {t('freeBulgaria.description')}
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-light mb-3 font-cormorant"
              style={{ color: '#2A2422' }}
            >
              {t('tryOn.title')}
            </h3>
            <p className="text-sm md:text-base font-raleway leading-relaxed"
              style={{ color: 'rgba(42, 36, 34, 0.7)' }}
            >
              {t('tryOn.description')}
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-light mb-3 font-cormorant"
              style={{ color: '#2A2422' }}
            >
              {t('returns.title')}
            </h3>
            <p className="text-sm md:text-base font-raleway leading-relaxed"
              style={{ color: 'rgba(42, 36, 34, 0.7)' }}
            >
              {t('returns.description')}
            </p>
          </div>
        </motion.div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center border-t pt-8"
          style={{ borderColor: 'rgba(42, 36, 34, 0.1)' }}
        >
          <p className="text-sm font-raleway max-w-3xl mx-auto"
            style={{ color: 'rgba(42, 36, 34, 0.5)' }}
          >
            {t('details.description')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
