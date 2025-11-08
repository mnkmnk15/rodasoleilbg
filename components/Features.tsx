'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface FeatureItem {
  title: string;
  description: string;
  side: 'left' | 'right';
  scrollRange: [number, number];
  hotspot?: { x: string; y: string }; // Позиция точки на мобильной версии
}

export default function Features() {
  const t = useTranslations('features');
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Плавное увеличение центрального изображения
  const scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [1.05, 1.1, 1.15]);

  const features: FeatureItem[] = [
    {
      title: t('tanThrough.title'),
      description: t('tanThrough.description'),
      side: 'left',
      scrollRange: [0.15, 0.5],
      hotspot: { x: '72%', y: '48%' }
    },
    {
      title: t('fastDrying.title'),
      description: t('fastDrying.description'),
      side: 'right',
      scrollRange: [0.3, 0.65],
      hotspot: { x: '28%', y: '52%' }
    },
    {
      title: t('uvProtection.title'),
      description: t('uvProtection.description'),
      side: 'left',
      scrollRange: [0.45, 0.8],
      hotspot: { x: '68%', y: '32%' }
    },
    {
      title: t('exclusivePrints.title'),
      description: t('exclusivePrints.description'),
      side: 'right',
      scrollRange: [0.6, 0.9],
      hotspot: { x: '32%', y: '68%' }
    }
  ];

  return (
    <section
      ref={containerRef}
      className="relative pt-16 md:pt-24 lg:pt-32 pb-0 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #FFFFFF 0%, #F7F5F0 50%, #FFFFFF 100%)'
      }}
    >
      {/* Мягкое свечение золотистых акцентов */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(208, 102, 52, 0.3) 0%, transparent 70%)' }}
        />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(208, 102, 52, 0.3) 0%, transparent 70%)' }}
        />
      </div>

      {/* Элегантный заголовок */}
      <div className="relative z-10 text-center mb-12 md:mb-16 lg:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-3 md:mb-4 font-cormorant tracking-wide px-4"
            style={{ color: '#2A2422' }}
          >
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-raleway max-w-2xl mx-auto px-4"
            style={{
              color: 'rgba(42, 36, 34, 0.7)',
              lineHeight: 1.8
            }}
          >
            {t('subtitle')}
          </p>
        </motion.div>
      </div>

      {/* Контейнер для контента */}
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 lg:px-12">

        {/* Десктоп версия: центральное изображение + боковые тексты */}
        <div className="hidden lg:block relative">

          <div className="grid grid-cols-[1fr_650px_1fr] xl:grid-cols-[1fr_750px_1fr] gap-8 xl:gap-12 items-start">

            {/* Левая колонка с текстами */}
            <div className="space-y-[25vh] mt-[15vh]">
              {features.filter(f => f.side === 'left').map((feature, index) => (
                <motion.div
                  key={`left-${index}`}
                  initial={{ opacity: 0, y: 50, x: -30 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="text-right pr-8"
                >
                  <h3 className="text-3xl xl:text-[2.75rem] font-light mb-4 font-cormorant tracking-wide leading-tight"
                    style={{ color: '#2A2422' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-lg xl:text-xl font-raleway"
                    style={{
                      color: 'rgba(42, 36, 34, 0.8)',
                      lineHeight: 1.8
                    }}
                  >
                    {feature.description}
                  </p>
                  <div className="h-[1px] w-20 bg-gradient-to-l from-[#d06634] to-transparent ml-auto mt-6" />
                </motion.div>
              ))}
            </div>

            {/* Центральное изображение модели - sticky */}
            <div className="relative min-h-[100vh]">
              <div className="sticky top-20">
                <motion.div
                  style={{ scale }}
                  className="relative w-[650px] h-[1020px] xl:w-[750px] xl:h-[1160px] mx-auto"
                >
                  <Image
                    src="/images/features/MODEL.png"
                    alt="RoDaSoleil Model"
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 1280px) 650px, 750px"
                    priority
                  />
                </motion.div>
              </div>
            </div>

            {/* Правая колонка с текстами */}
            <div className="space-y-[25vh] mt-[27vh]"> {/* Сдвиг вниз для ступенчатости */}
              {features.filter(f => f.side === 'right').map((feature, index) => (
                <motion.div
                  key={`right-${index}`}
                  initial={{ opacity: 0, y: 50, x: 30 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                  className="text-left pl-8"
                >
                  <h3 className="text-3xl xl:text-[2.75rem] font-light mb-4 font-cormorant tracking-wide leading-tight"
                    style={{ color: '#2A2422' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-lg xl:text-xl font-raleway"
                    style={{
                      color: 'rgba(42, 36, 34, 0.8)',
                      lineHeight: 1.8
                    }}
                  >
                    {feature.description}
                  </p>
                  <div className="h-[1px] w-20 bg-gradient-to-r from-[#d06634] to-transparent mt-6" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Мобильная версия - интерактивные точки */}
        <div className="lg:hidden py-10">
          {/* Подсказка */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5 }}
            className="text-center text-sm font-raleway px-6 mb-6"
            style={{ color: 'rgba(42, 36, 34, 0.5)' }}
          >
            {activeHotspot === null ? t('clickDots') : t('clickToHide')}
          </motion.p>

          {/* Центральное изображение с интерактивными точками */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-md mx-auto h-[600px]"
            style={{ overflow: 'visible' }}
          >
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
              <Image
                src="/images/features/MODEL.png"
                alt="RoDaSoleil Model"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 448px"
                priority
              />
            </div>

            {/* Интерактивные точки на модели */}
            {features.map((feature, index) => (
              <div
                key={`hotspot-container-${index}`}
                className="absolute"
                style={{
                  left: feature.hotspot?.x,
                  top: feature.hotspot?.y,
                  width: '48px',
                  height: '48px',
                  marginLeft: '-24px',
                  marginTop: '-24px',
                  zIndex: 50
                }}
              >
                {/* Пульсирующий эффект - одинаковая анимация для всех */}
                <motion.div
                  key={`pulse-${index}`}
                  className="absolute inset-0 rounded-full pointer-events-none will-change-transform"
                  style={{
                    backgroundColor: 'rgba(208, 102, 52, 0.3)',
                    zIndex: 1
                  }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "loop"
                  }}
                />

                {/* Кликабельная кнопка */}
                <motion.button
                  onClick={() => setActiveHotspot(activeHotspot === index ? null : index)}
                  className="relative w-full h-full cursor-pointer group z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + index * 0.15, duration: 0.4 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Основная точка */}
                  <div className={`relative w-full h-full rounded-full border-2 transition-all duration-300 ${
                    activeHotspot === index
                      ? 'bg-[#d06634] border-[#d06634] scale-110'
                      : 'bg-white/90 border-white/90 group-hover:bg-[#d06634] group-hover:border-[#d06634]'
                  }`}>
                    {/* Внутренний круг */}
                    <div className="absolute inset-[6px] rounded-full" style={{ backgroundColor: '#FAF8F4' }} />
                    {/* Номер фичи */}
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: '#2A2422' }}>
                      {index + 1}
                    </span>
                  </div>
                </motion.button>
              </div>
            ))}
          </motion.div>

          {/* Информационная карточка - фиксированное положение по центру экрана */}
          <AnimatePresence mode="wait">
            {activeHotspot !== null && (
              <>
                {/* Прозрачный оверлей для закрытия по клику */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 lg:hidden"
                  onClick={() => setActiveHotspot(null)}
                />

                {/* Карточка */}
                <motion.div
                  key={activeHotspot}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50 lg:hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-white rounded-2xl p-6 border shadow-2xl"
                    style={{
                      borderColor: 'rgba(208, 102, 52, 0.2)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <h3 className="text-2xl md:text-3xl font-light mb-4 font-cormorant"
                      style={{ color: '#2A2422' }}
                    >
                      {features[activeHotspot].title}
                    </h3>
                    <p className="text-base md:text-lg font-raleway"
                      style={{
                        color: 'rgba(42, 36, 34, 0.8)',
                        lineHeight: 1.8
                      }}
                    >
                      {features[activeHotspot].description}
                    </p>
                    <div className="h-[1px] w-20 bg-gradient-to-r from-[#d06634] to-transparent mt-6" />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
