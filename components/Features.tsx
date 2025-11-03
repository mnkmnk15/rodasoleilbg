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
      hotspot: { x: '65%', y: '35%' }
    },
    {
      title: t('fastDrying.title'),
      description: t('fastDrying.description'),
      side: 'right',
      scrollRange: [0.3, 0.65],
      hotspot: { x: '45%', y: '50%' }
    },
    {
      title: t('uvProtection.title'),
      description: t('uvProtection.description'),
      side: 'left',
      scrollRange: [0.45, 0.8],
      hotspot: { x: '55%', y: '25%' }
    },
    {
      title: t('madeInItaly.title'),
      description: t('madeInItaly.description'),
      side: 'right',
      scrollRange: [0.6, 0.9],
      hotspot: { x: '50%', y: '70%' }
    }
  ];

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-0 bg-gradient-to-b from-[#1a1a1a] via-[#252525] to-[#1a1a1a] overflow-hidden"
    >
      {/* Элегантное свечение */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(201, 152, 106, 0.4) 0%, transparent 70%)' }}
        />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(201, 152, 106, 0.4) 0%, transparent 70%)' }}
        />
      </div>

      {/* Элегантный заголовок */}
      <div className="relative z-10 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 font-cormorant tracking-wide">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-raleway max-w-2xl mx-auto px-4">
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
                  <h3 className="text-3xl xl:text-[2.75rem] font-light text-white mb-4 font-cormorant tracking-wide leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-lg xl:text-xl text-white/90 leading-relaxed font-raleway">
                    {feature.description}
                  </p>
                  <div className="h-[1px] w-20 bg-gradient-to-l from-[#c9986a] to-transparent ml-auto mt-6" />
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
                    src="/images/features/MODEL.PNG"
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
                  <h3 className="text-3xl xl:text-[2.75rem] font-light text-white mb-4 font-cormorant tracking-wide leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-lg xl:text-xl text-white/90 leading-relaxed font-raleway">
                    {feature.description}
                  </p>
                  <div className="h-[1px] w-20 bg-gradient-to-r from-[#c9986a] to-transparent mt-6" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Мобильная версия - интерактивные точки */}
        <div className="lg:hidden py-10">
          {/* Заголовок для мобильной версии */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-light text-white mb-8 font-cormorant text-center"
          >
            {t('title')}
          </motion.h2>

          {/* Центральное изображение с интерактивными точками */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-md mx-auto h-[600px] mb-8"
          >
            <Image
              src="/images/features/MODEL.PNG"
              alt="RoDaSoleil Model"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 100vw, 448px"
              priority
            />

            {/* Интерактивные точки на модели */}
            {features.map((feature, index) => (
              <motion.button
                key={`hotspot-${index}`}
                onClick={() => setActiveHotspot(activeHotspot === index ? null : index)}
                className="absolute w-12 h-12 -ml-6 -mt-6 cursor-pointer group"
                style={{
                  left: feature.hotspot?.x,
                  top: feature.hotspot?.y,
                }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.15, duration: 0.4 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Пульсирующий эффект */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#c9986a]/30"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Основная точка */}
                <div className={`relative w-full h-full rounded-full border-2 transition-all duration-300 ${
                  activeHotspot === index
                    ? 'bg-[#c9986a] border-[#c9986a] scale-110'
                    : 'bg-white/90 border-white/90 group-hover:bg-[#c9986a] group-hover:border-[#c9986a]'
                }`}>
                  {/* Внутренний круг */}
                  <div className="absolute inset-[6px] rounded-full bg-[#1a1a1a]" />
                  {/* Номер фичи */}
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Информационная карточка при клике на точку */}
          <AnimatePresence mode="wait">
            {activeHotspot !== null && (
              <motion.div
                key={activeHotspot}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="px-6 mb-8"
              >
                <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl p-6 border border-[#c9986a]/20 shadow-2xl">
                  <h3 className="text-2xl md:text-3xl font-light text-white mb-4 font-cormorant">
                    {features[activeHotspot].title}
                  </h3>
                  <p className="text-base md:text-lg text-white/80 leading-relaxed font-raleway">
                    {features[activeHotspot].description}
                  </p>
                  <div className="h-[1px] w-20 bg-gradient-to-r from-[#c9986a] to-transparent mt-6" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Подсказка */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5 }}
            className="text-center text-white/50 text-sm font-raleway px-6"
          >
            {activeHotspot === null ? 'Нажмите на точки, чтобы узнать больше' : 'Нажмите еще раз, чтобы скрыть'}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
