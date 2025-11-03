'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Waves, Sparkles, Sun } from 'lucide-react';

export default function LifestyleSection() {
  const t = useTranslations('lifestyle');
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const features = [
    {
      icon: Waves,
      title: locale === 'bg' ? 'Плажна Елегантност' : locale === 'ru' ? 'Пляжная Элегантность' : 'Beach Elegance',
      description: locale === 'bg' ? 'Съвършен дизайн за всяка плажна емоция' : locale === 'ru' ? 'Идеальный дизайн для любой пляжной эмоции' : 'Perfect design for every beach moment'
    },
    {
      icon: Sparkles,
      title: locale === 'bg' ? 'Премиум Качество' : locale === 'ru' ? 'Премиум Качество' : 'Premium Quality',
      description: locale === 'bg' ? 'Висококачествени материали и изработка' : locale === 'ru' ? 'Высококачественные материалы и изготовление' : 'High-quality materials and craftsmanship'
    },
    {
      icon: Sun,
      title: locale === 'bg' ? 'Целогодишен Стил' : locale === 'ru' ? 'Круглогодичный Стиль' : 'Year-Round Style',
      description: locale === 'bg' ? 'За плаж, басейн и всяка слънчева дестинация' : locale === 'ru' ? 'Для пляжа, бассейна и любой солнечной локации' : 'For beach, pool and any sunny destination'
    }
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden py-20 lg:py-32"
      style={{
        background: 'linear-gradient(to bottom, #fdfaf6 0%, #ffffff 50%, #fdfaf6 100%)'
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(224, 196, 129, 0.3) 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(245, 212, 184, 0.25) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left - Images Grid */}
          <motion.div
            ref={ref}
            className="relative h-[600px] lg:h-[700px]"
            style={{ y: imageY }}
          >
            {/* Main large image */}
            <motion.div
              className="absolute top-0 left-0 w-[70%] h-[60%] rounded-[2.5rem] overflow-hidden"
              initial={{ opacity: 0, x: -40, rotate: -3 }}
              animate={inView ? { opacity: 1, x: 0, rotate: -2 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                boxShadow: '0 20px 60px rgba(207, 173, 91, 0.2)',
                scale: imageScale
              }}
            >
              <img
                src="https://mysmartswimwear.com/cdn/shop/files/IMG-0539.webp?v=1760640223&width=550%20550w,//mysmartswimwear.com/cdn/shop/files/IMG-0539.webp?v=1760640223%20853w"
                alt="Lifestyle 1"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, rgba(207, 173, 91, 0.08) 0%, transparent 50%)'
              }} />
            </motion.div>

            {/* Smaller image bottom right */}
            <motion.div
              className="absolute bottom-0 right-0 w-[55%] h-[50%] rounded-[2.5rem] overflow-hidden"
              initial={{ opacity: 0, x: 40, rotate: 3 }}
              animate={inView ? { opacity: 1, x: 0, rotate: 2 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                boxShadow: '0 20px 60px rgba(207, 173, 91, 0.25)'
              }}
            >
              <img
                src="https://mysmartswimwear.com/cdn/shop/files/IMG-0539.webp?v=1760640223&width=550%20550w,//mysmartswimwear.com/cdn/shop/files/IMG-0539.webp?v=1760640223%20853w"
                alt="Lifestyle 2"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to top, rgba(224, 196, 129, 0.1) 0%, transparent 50%)'
              }} />
            </motion.div>

            {/* Floating badge */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-2xl p-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
              style={{
                background: 'linear-gradient(135deg, rgba(207, 173, 91, 0.95) 0%, rgba(224, 196, 129, 0.97) 100%)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 20px 60px rgba(207, 173, 91, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
              }}
            >
              <div className="text-center">
                <div className="text-5xl font-light text-white font-cormorant mb-2" style={{ fontWeight: 400 }}>
                  {locale === 'bg' ? '100%' : locale === 'ru' ? '100%' : '100%'}
                </div>
                <div className="text-sm text-white/95 uppercase tracking-wider font-semibold font-raleway">
                  {locale === 'bg' ? 'Задоволство' : locale === 'ru' ? 'Удовлетворение' : 'Satisfaction'}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            ref={ref}
            className="space-y-8 lg:pl-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(207, 173, 91, 0.15) 0%, rgba(224, 196, 129, 0.18) 100%)',
                border: '1px solid rgba(207, 173, 91, 0.25)'
              }}
            >
              <Sparkles className="w-4 h-4 text-[#cfad5b]" fill="#cfad5b" />
              <span className="text-sm font-medium text-[#b8984d] uppercase tracking-wider">
                {locale === 'bg' ? 'Начин на живот' : locale === 'ru' ? 'Образ жизни' : 'Lifestyle'}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight font-cormorant"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                color: '#3a2f28',
                fontWeight: 300,
                letterSpacing: '0.01em'
              }}
            >
              {locale === 'bg'
                ? 'Вашият Слънчев Стил'
                : locale === 'ru'
                ? 'Ваш Солнечный Стиль'
                : 'Your Sunny Style'}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl leading-relaxed font-raleway"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                color: 'rgba(58, 47, 40, 0.75)',
                fontWeight: 300,
                letterSpacing: '0.01em',
                lineHeight: 1.8
              }}
            >
              {locale === 'bg'
                ? 'Открийте перфектния баланс между комфорт, стил и функционалност. Нашите бански са създадени за съвременната жена, която цени качеството и елегантността във всеки момент.'
                : locale === 'ru'
                ? 'Откройте идеальный баланс между комфортом, стилем и функциональностью. Наши купальники созданы для современной женщины, которая ценит качество и элегантность в каждом моменте.'
                : 'Discover the perfect balance between comfort, style and functionality. Our swimwear is designed for the modern woman who values quality and elegance in every moment.'}
            </motion.p>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-1 gap-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-5 group"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(207, 173, 91, 0.15) 0%, rgba(224, 196, 129, 0.2) 100%)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <feature.icon className="w-6 h-6 text-[#cfad5b]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#3a2f28] mb-2 font-raleway group-hover:text-[#cfad5b]"
                      style={{ transition: 'color 0.3s ease' }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-[#3a2f28]/70 font-raleway leading-relaxed" style={{ fontSize: '15px' }}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="pt-4"
            >
              <button
                className="px-12 py-4 rounded-full font-medium text-lg cursor-pointer font-raleway"
                style={{
                  background: 'linear-gradient(135deg, #cfad5b 0%, #e0c481 100%)',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(207, 173, 91, 0.25)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(207, 173, 91, 0.35)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(207, 173, 91, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {locale === 'bg' ? 'Разгледай колекцията' : locale === 'ru' ? 'Смотреть коллекцию' : 'Explore Collection'}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
