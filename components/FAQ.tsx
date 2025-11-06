'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface FAQItem {
  questionKey: string;
  answerKey: string;
}

export default function FAQ() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      questionKey: 'tanSpeed.question',
      answerKey: 'tanSpeed.answer',
    },
    {
      questionKey: 'transparent.question',
      answerKey: 'transparent.answer',
    },
    {
      questionKey: 'serviceLife.question',
      answerKey: 'serviceLife.answer',
    }
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative py-16 md:py-20 overflow-hidden"
      style={{
        background: '#F7F5F0'
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
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

        {/* FAQ Items */}
        <div className="space-y-1">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-b"
              style={{
                borderColor: 'rgba(42, 36, 34, 0.1)',
              }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-left py-5 flex items-center justify-between gap-4 cursor-pointer group"
              >
                <h3 className="text-lg md:text-xl font-light font-cormorant transition-colors"
                  style={{ color: openIndex === index ? '#d06634' : '#2A2422' }}
                >
                  {t(item.questionKey)}
                </h3>
                <motion.span
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 text-2xl font-light transition-colors"
                  style={{ color: openIndex === index ? '#d06634' : 'rgba(42, 36, 34, 0.4)' }}
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 pr-12">
                      <p className="text-sm md:text-base font-raleway leading-relaxed"
                        style={{
                          color: 'rgba(42, 36, 34, 0.7)',
                        }}
                      >
                        {t(item.answerKey)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-sm font-raleway"
            style={{
              color: 'rgba(42, 36, 34, 0.5)',
            }}
          >
            {t('moreQuestions')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
