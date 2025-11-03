'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';

export default function DualImageSection() {
  const t = useTranslations('dualImage');
  const locale = useLocale();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15
  });

  return (
    <section
      ref={ref}
      className="relative w-full py-0 overflow-hidden"
      style={{
        background: '#ffffff'
      }}
    >
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Image - Narrower, Full Opacity with Zoom Effect */}
          <div
            className="lg:col-span-5 relative h-[500px] md:h-[650px] lg:h-[750px] z-20"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <Link href={`/${locale}/catalog`} className="block w-full h-full overflow-visible group">
                <div className="relative w-full h-full overflow-visible">
                  <Image
                    src="/images/2slidemodelL.png"
                    alt="Women's Collection"
                    fill
                    className="object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    priority
                    quality={95}
                  />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Right Image - Wider, Darkened with Text Overlay */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-7 relative h-[500px] md:h-[650px] lg:h-[750px] overflow-hidden z-10"
          >
            <Link href={`/${locale}/catalog`} className="block w-full h-full group">
              <div className="relative w-full h-full">
                <Image
                  src="/images/2slidemodelR.png"
                  alt="Summer Collection"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  style={{ filter: 'brightness(0.7)' }}
                  priority
                />

                {/* Text Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 text-center z-10 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="max-w-2xl"
                  >
                    {/* Small Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="inline-block px-6 py-2 mb-6 rounded-full"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <span className="text-xs md:text-sm font-medium text-white uppercase tracking-wider font-montserrat">
                        {t('badge')}
                      </span>
                    </motion.div>

                    {/* Main Title */}
                    <h2
                      className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-cormorant mb-6 leading-tight"
                      style={{
                        fontWeight: 300,
                        letterSpacing: '0.02em',
                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {t('title')}
                    </h2>

                    {/* Description */}
                    <p
                      className="text-lg md:text-xl lg:text-2xl text-white/95 font-montserrat leading-relaxed max-w-xl mx-auto"
                      style={{
                        fontWeight: 300,
                        letterSpacing: '0.03em',
                        textShadow: '0 2px 15px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      {t('description')}
                    </p>

                    {/* Decorative Line */}
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={inView ? { width: '100px', opacity: 1 } : {}}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="h-[1px] mx-auto mt-8"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
