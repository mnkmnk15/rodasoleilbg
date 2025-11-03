'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Sun } from 'lucide-react';

export default function ParallaxSection() {
  const t = useTranslations('parallax');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Enhanced parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const modelScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.08, 1.15]);
  const modelY = useTransform(scrollYProgress, [0, 1], ['8%', '-18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15
  });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden py-24 lg:py-32"
      style={{
        background: 'linear-gradient(to bottom, #ffffff 0%, #fdfaf7 50%, #ffffff 100%)'
      }}
    >
      {/* Subtle Decorative Glows - Barely Visible */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, rgba(212, 165, 116, 0.15) 0%, transparent 70%)',
          y: backgroundY
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.02]"
        style={{
          background: 'radial-gradient(circle, rgba(232, 212, 184, 0.1) 0%, transparent 70%)',
          y: useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
        }}
      />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Text Content - Left Side */}
            <motion.div
              ref={ref}
              className="space-y-10 lg:pr-8"
              style={{ y: textY }}
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full"
                style={{
                  background: 'rgba(248, 245, 242, 0.6)',
                  border: '1px solid rgba(201, 152, 106, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <Sparkles className="w-4 h-4 text-[#c9986a]" />
                <span className="text-sm font-medium text-[#b89968] uppercase tracking-wider">
                  {t('badge') || 'Premium Technology'}
                </span>
              </motion.div>

              {/* Decorative Line */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={inView ? { width: '140px', opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-[2px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #c9986a 0%, rgba(201, 152, 106, 0.2) 100%)'
                }}
              />

              {/* Title */}
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight font-cormorant"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
                style={{
                  color: '#1a1a1a',
                  fontWeight: 300,
                  letterSpacing: '0.01em'
                }}
              >
                {t('title')}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-lg md:text-xl leading-relaxed font-raleway"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 }}
                style={{
                  color: 'rgba(26, 26, 26, 0.7)',
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  lineHeight: 1.8
                }}
              >
                {t('description')}
              </motion.p>

              {/* Feature Cards - Redesigned */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                {[
                  { icon: Sparkles, text: t('feature1') },
                  { icon: Sun, text: t('feature2') }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="group relative p-6 rounded-2xl cursor-pointer flex items-start space-x-4"
                    style={{
                      background: '#ffffff',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
                      borderColor: 'rgba(201, 152, 106, 0.2)'
                    }}
                  >
                    <div className="p-3 rounded-xl" style={{ background: '#f5ebe0' }}>
                      <item.icon className="w-6 h-6 text-[#c9986a]" strokeWidth={1.5} />
                    </div>
                    <p className="text-[#1a1a1a] font-medium font-raleway pt-2 leading-relaxed" style={{ fontSize: '15px' }}>
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.8 }}
                whileTap={{ scale: 0.97 }}
                className="px-12 py-4 rounded-full font-medium text-lg cursor-pointer font-raleway mt-4"
                style={{
                  background: 'linear-gradient(135deg, #b89968 0%, #c9986a 100%)',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  letterSpacing: '0.05em'
                }}
                whileHover={{
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.16)',
                  y: -2
                }}
              >
                {t('cta')}
              </motion.button>
            </motion.div>

            {/* Model Image with Advanced Parallax - Right Side */}
            <motion.div
              className="relative h-[550px] lg:h-[700px]"
              style={{ scale: modelScale, y: modelY }}
            >
              <motion.div
                className="absolute inset-0 rounded-[3rem] overflow-hidden"
                initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.04)'
                }}
              >
                <img
                  src="https://mysmartswimwear.com/cdn/shop/files/IMG-0539.webp?v=1760640223&width=550%20550w,//mysmartswimwear.com/cdn/shop/files/IMG-0539.webp?v=1760640223%20853w"
                  alt="Model in swimwear"
                  className="w-full h-full object-cover"
                />
                {/* Very subtle warm overlay */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(232, 212, 184, 0.03) 0%, transparent 40%)'
                }} />
              </motion.div>

              {/* Floating Badge - Redesigned */}
              <motion.div
                className="absolute -left-8 bottom-16 lg:bottom-24 rounded-2xl shadow-2xl p-6"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1)'
                }}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.7 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 1)'
                }}
              >
                <div className="text-center">
                  <div className="text-xs uppercase tracking-wider font-semibold font-raleway mb-1" style={{ color: '#b89968' }}>
                    {t('badge') || 'UV Protection'}
                  </div>
                  <div className="text-4xl font-light font-cormorant" style={{ fontWeight: 400, color: '#1a1a1a' }}>
                    SPF 35+
                  </div>
                </div>
              </motion.div>

              {/* Additional floating element - optional */}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
