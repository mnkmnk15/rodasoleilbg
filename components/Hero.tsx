'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Parallax effect - video zooms out (moves away) as user scrolls
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // Parallax effect for background logo - stronger scale and movement
  const logoScale = useTransform(scrollYProgress, [0, 1], [1.2, 0.5]);
  const logoLeftY = useTransform(scrollYProgress, [0, 1], ['-15%', '40%']); // Left logo starts higher, moves down
  const logoRightY = useTransform(scrollYProgress, [0, 1], ['15%', '-40%']); // Right logo starts lower, moves up
  const logoRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden md:h-screen">
      {/* Desktop Hero - Full Screen */}
      <div className="hidden md:block h-screen relative">
        {/* Video Background - Desktop */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ scale: videoScale, y: videoY }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/images/hero-poster.jpg"
            style={{ filter: 'brightness(0.7)' }}
          >
            <source src="/videos/rodasoleilbghero.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Background Logo Layer with Parallax - Desktop только */}
        {/* Left Logo - starts centered, moves down on scroll, extends beyond screen vertically */}
        <motion.div
          className="absolute left-0 w-1/2 flex items-center justify-start pointer-events-none z-[5] pl-0"
          style={{
            top: '-15%',
            height: '130%',
            scale: logoScale,
            y: logoLeftY,
            rotate: useTransform(scrollYProgress, [0, 1], [0, -3]),
            opacity: 0.3
          }}
        >
          <div className="relative w-[50%] h-[50%]">
            <Image
              src="/images/logosvg.svg"
              alt="RODA Soleil Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Right Logo - starts centered, moves up on scroll, extends beyond screen vertically */}
        <motion.div
          className="absolute right-0 w-1/2 flex items-center justify-end pointer-events-none z-[5] pr-0"
          style={{
            top: '-15%',
            height: '130%',
            scale: logoScale,
            y: logoRightY,
            rotate: useTransform(scrollYProgress, [0, 1], [0, 3]),
            opacity: 0.3
          }}
        >
          <div className="relative w-[50%] h-[50%]">
            <Image
              src="/images/logosvg.svg"
              alt="RODA Soleil Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Теплый haze overlay 10-15% для читабельности текста */}
        <div
          className="absolute inset-0 z-[8] pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(208, 102, 52, 0.12) 0%, rgba(208, 102, 52, 0.08) 40%, rgba(255, 246, 233, 0.05) 70%, transparent 100%)',
          }}
        />

        {/* Desktop Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-6" style={{ paddingTop: '12vh' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'linear' }}
            className="max-w-7xl w-full"
          >
            {/* Main Heading - RODA Soleil */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-cormorant whitespace-pre-line"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.55, 0.07, 0.31, 0.98] }}
              style={{
                letterSpacing: '0.03em',
                lineHeight: 1.1,
                marginBottom: '-0.5rem',
                color: '#FFFFFF',
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.4)',
              }}
            >
              <span style={{ fontWeight: 600 }}>RODA</span>{' '}
              <span style={{ fontWeight: 300 }}>Soleil</span>
            </motion.h1>

            {/* First line of subtitle */}
            <motion.p
              className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-cormorant mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontWeight: 500,
                letterSpacing: '0.05em',
                lineHeight: 1.5,
                color: '#FFFFFF',
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.4)',
              }}
            >
              {locale === 'bg' ? 'Умни бански' : locale === 'ru' ? 'Умные купальники' : 'Smart Swimwear'}
            </motion.p>

            {/* Decorative Divider */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100px', opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-[2px] mx-auto my-6 md:my-10"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 246, 233, 0.7) 50%, transparent 100%)',
              }}
            />

            {/* Rest of subtitle */}
            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl mx-auto font-montserrat whitespace-pre-line mb-12 md:mb-16 lg:mb-20 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontWeight: 300,
                letterSpacing: '0.08em',
                lineHeight: 1.7,
                color: '#FFFFFF',
                textShadow: '0 3px 18px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.4)',
              }}
            >
              {locale === 'bg'
                ? 'Технологичност и красота в едно\nУникални бански с tan-through технология'
                : locale === 'ru'
                ? 'Технологичность и красота в одном\nУникальные купальники с tan-through технологией'
                : 'Technology and beauty combined\nUnique swimwear with tan-through technology'}
            </motion.p>

            {/* CTA: Elegant minimalist button */}
            <motion.a
              href={`/${locale}/catalog`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block px-8 py-3 md:px-12 md:py-4 cursor-pointer relative group font-montserrat"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.85)',
                borderRadius: '32px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
                transform: 'scale(1)',
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.15), 0 4px 16px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)';
                e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.25), 0 6px 20px rgba(0, 0, 0, 0.25)';
                e.currentTarget.style.textShadow = '0 2px 16px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.12), 0 4px 16px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.textShadow = '0 2px 12px rgba(0, 0, 0, 0.3)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(1.01) translateY(-0.5px)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)';
              }}
            >
              {locale === 'bg' ? 'Разгледай Колекцията' : locale === 'ru' ? 'Посмотреть Коллекцию' : 'View Collection'}
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Mobile Hero - компактная высота */}
      <div className="md:hidden relative w-full" style={{ height: '350px' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero-poster.jpg"
          style={{ filter: 'brightness(0.75)' }}
        >
          <source src="/videos/rodasoleilbghero.mp4" type="video/mp4" />
        </video>

        {/* Mobile Content - накладывается поверх видео */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)'
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'linear' }}
            className="w-full"
          >
            {/* Mobile Heading */}
            <motion.h2
              className="text-3xl font-cormorant font-light mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                letterSpacing: '0.05em',
                lineHeight: 1.3,
                color: '#FFFFFF',
                textShadow: '0 3px 16px rgba(0, 0, 0, 0.5)',
                fontWeight: 300
              }}
            >
              {locale === 'bg' ? 'Бански, който дарява' : locale === 'ru' ? 'Купальник, который дарит' : 'Swimwear that gives you'}
              <br />
              {locale === 'bg' ? 'равномерен тен' : locale === 'ru' ? 'равномерный загар' : 'an even tan'}
            </motion.h2>

            {/* Mobile Button */}
            <motion.a
              href={`/${locale}/catalog`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-block px-8 py-3 cursor-pointer font-montserrat"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.85)',
                borderRadius: '32px',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.15), 0 4px 16px rgba(0, 0, 0, 0.3)',
              }}
            >
              {locale === 'bg' ? 'Виж Колекцията' : locale === 'ru' ? 'Смотреть Коллекцию' : 'SHOP COLLECTION'}
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
