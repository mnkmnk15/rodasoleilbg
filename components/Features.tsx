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
  const [imageLoaded, setImageLoaded] = useState(false);

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
        <div className="lg:hidden py-10 relative">
          {/* Overlay для закрытия по клику вне области */}
          {activeHotspot !== null && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setActiveHotspot(null)}
              style={{ background: 'transparent' }}
            />
          )}

          {/* Подсказка */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm font-raleway px-6 mb-6"
            style={{ color: 'rgba(42, 36, 34, 0.5)' }}
          >
            {t('clickDots')}
          </motion.p>

          {/* Контейнер для изображения и табличек */}
          <div className="relative">
            {/* Центральное изображение с интерактивными точками */}
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              className="relative w-full max-w-md mx-auto h-[600px] mb-8"
            >
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
              <Image
                src="/images/features/MODEL.png"
                alt="RoDaSoleil Model"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 448px"
                style={{
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out'
                }}
                priority
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Интерактивные точки на модели */}
            {imageLoaded && features.map((feature, index) => {
              return (
                <div
                  key={`hotspot-container-${index}`}
                  className="absolute"
                  style={{
                    left: feature.hotspot?.x,
                    top: feature.hotspot?.y,
                    zIndex: activeHotspot === index ? 100 : 50
                  }}
                >
                  {/* Контейнер точки и таблички */}
                  <div className="relative" style={{
                    marginLeft: '-24px',
                    marginTop: '-24px',
                  }}>

                    {/* Пульсирующий эффект */}
                    {activeHotspot !== index && (
                      <motion.div
                        key={`pulse-${index}`}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                          backgroundColor: 'rgba(208, 102, 52, 0.3)',
                          width: '48px',
                          height: '48px',
                          willChange: 'transform, opacity'
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
                    )}

                    {/* Кликабельная кнопка */}
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveHotspot(activeHotspot === index ? null : index);
                      }}
                      className="relative cursor-pointer group touch-manipulation z-50"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.08, duration: 0.4, ease: 'easeOut' }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                        width: '48px',
                        height: '48px',
                      }}
                    >
                      {/* Основная точка */}
                      <div className={`relative w-full h-full rounded-full border-2 transition-all duration-300 ${
                        activeHotspot === index
                          ? 'bg-[#d06634] border-[#d06634]'
                          : 'bg-white/90 border-white/90'
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
                </div>
              );
            })}
          </motion.div>

          {/* Всплывающая табличка - одна на все точки */}
          <AnimatePresence mode="wait">
            {activeHotspot !== null && (
              <motion.div
                key={activeHotspot}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{
                  duration: 0.25,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                className="absolute left-1/2 -translate-x-1/2 px-4"
                style={{
                  top: '400px',
                  width: '100%',
                  maxWidth: '360px',
                  zIndex: 200,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Карточка */}
                <div className="bg-white rounded-xl p-5 border shadow-xl w-full"
                  style={{
                    borderColor: 'rgba(208, 102, 52, 0.2)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-light font-cormorant pr-2"
                      style={{ color: '#2A2422' }}
                    >
                      {features[activeHotspot].title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(null);
                      }}
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Закрыть"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4L12 12" stroke="#2A2422" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm font-raleway"
                    style={{
                      color: 'rgba(42, 36, 34, 0.75)',
                      lineHeight: 1.6
                    }}
                  >
                    {features[activeHotspot].description}
                  </p>
                  <div className="h-[1px] w-12 bg-gradient-to-r from-[#d06634] to-transparent mt-3" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>
    </section>
  );
}
