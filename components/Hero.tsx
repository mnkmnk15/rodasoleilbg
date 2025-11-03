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
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
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

      {/* Background Logo Layer with Parallax - Two logos on sides */}
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

      {/* Subtle gradient overlay for depth - Dior/Jacquemus style */}
      <div
        className="absolute inset-0 z-[8] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.05) 30%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6" style={{ paddingTop: '18vh' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'linear' }}
          className="max-w-7xl w-full"
        >
          {/* Main Heading - RODA Soleil */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-cormorant whitespace-pre-line"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              letterSpacing: '0.06em',
              lineHeight: 1.1,
              marginBottom: '-0.5rem',
              color: '#FFFFFF',
              textShadow: '0 4px 24px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            <span style={{ fontWeight: 600 }}>RODA</span>{' '}
            <span style={{ fontWeight: 300 }}>Soleil</span>
          </motion.h1>

          {/* First line of subtitle - larger, under title with more breathing space */}
          <motion.p
            className="text-3xl md:text-5xl lg:text-6xl font-cormorant mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontWeight: 500,
              letterSpacing: '0.05em',
              lineHeight: 1.5,
              color: '#FFFFFF',
              textShadow: '0 4px 24px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            {locale === 'bg' ? 'Загар без линии' : locale === 'ru' ? 'Загар без линий' : 'Tan Without Lines'}
          </motion.p>

          {/* Decorative Divider - Less transparent */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '120px', opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-[2px] mx-auto my-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 246, 233, 0.7) 50%, transparent 100%)',
            }}
          />

          {/* Rest of subtitle - Thin and Elegant with more breathing space */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto font-montserrat whitespace-pre-line mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontWeight: 300,
              letterSpacing: '0.10em',
              lineHeight: 1.8,
              color: '#FFFFFF',
              textShadow: '0 3px 18px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            {locale === 'bg'
              ? 'Технологичност и красота в едно\nУникални бански с tan-through технология'
              : locale === 'ru'
              ? 'Технологичность и красота в одном\nУникальные купальники с tan-through технологией'
              : 'Technology and beauty combined\nUnique swimwear with tan-through technology'}
          </motion.p>

          {/* Luxury Tan-Gold CTA Button */}
          <motion.a
            href={`/${locale}/catalog`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'linear' }}
            className="inline-block px-14 py-5 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(219, 202, 162, 0.35) 0%, rgba(207, 190, 150, 0.4) 100%)',
              backdropFilter: 'blur(20px) saturate(130%)',
              WebkitBackdropFilter: 'blur(20px) saturate(130%)',
              border: '1px solid rgba(219, 202, 162, 0.3)',
              borderRadius: '48px',
              color: '#FFFFFF',
              fontSize: '17px',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              boxShadow: '0 8px 32px rgba(219, 202, 162, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              transform: 'scale(1)',
              transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out, background 0.5s ease-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(200, 165, 100, 0.55) 0%, rgba(185, 150, 85, 0.6) 100%)';
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(200, 165, 100, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(219, 202, 162, 0.35) 0%, rgba(207, 190, 150, 0.4) 100%)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(219, 202, 162, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
          >
            {locale === 'bg' ? 'Каталог' : locale === 'ru' ? 'Каталог' : 'Catalog'}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
