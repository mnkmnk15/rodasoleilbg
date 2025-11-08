'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';

export default function DualImageSection() {
  const t = useTranslations('categorySection');
  const locale = useLocale();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const categories = [
    {
      key: 'women',
      image: '/images/category-women.jpg',
      href: `/${locale}/catalog?category=women`,
      objectPosition: 'center center'
    },
    {
      key: 'men',
      image: '/images/category-men.jpg',
      href: `/${locale}/catalog?category=men`,
      objectPosition: 'center 5%'
    },
    {
      key: 'kids',
      image: '/images/category-kids.jpg',
      href: `/${locale}/catalog?category=kids`,
      objectPosition: 'center 0%'
    }
  ];

  return (
    <section
      ref={ref}
      className="relative w-full py-0 overflow-hidden"
      style={{
        background: '#ffffff'
      }}
    >
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 relative">
          {categories.map((category, index) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: index * 0.15
              }}
              className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden group"
              style={{
                borderRight: index < 2 ? '1px solid rgba(255, 255, 255, 0.15)' : 'none'
              }}
            >
              <Link href={category.href} className="block w-full h-full cursor-pointer">
                <div className="relative w-full h-full">
                  {/* Background Image */}
                  <Image
                    src={category.image}
                    alt={t(`${category.key}.title`)}
                    fill
                    className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-75"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority={index === 0}
                    quality={90}
                    style={{ objectPosition: category.objectPosition }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 transition-all duration-500 group-hover:bg-black/20"
                    style={{
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 100%)'
                    }}
                  />

                  {/* Text Content - positioned at bottom left */}
                  <div className="absolute bottom-0 left-0 px-8 md:px-10 lg:px-12 pb-8 md:pb-10 lg:pb-12 z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                      className="space-y-3"
                    >
                      {/* Title */}
                      <h2
                        className="text-3xl md:text-3xl lg:text-4xl text-white font-cormorant"
                        style={{
                          fontWeight: 300,
                          letterSpacing: '0.03em',
                          lineHeight: '1.2'
                        }}
                      >
                        {t(`${category.key}.title`)}
                      </h2>

                      {/* Description */}
                      <p
                        className="text-sm md:text-sm text-white/85 font-montserrat max-w-xs"
                        style={{
                          fontWeight: 300,
                          letterSpacing: '0.02em',
                          lineHeight: '1.5'
                        }}
                      >
                        {t(`${category.key}.description`)}
                      </p>

                      {/* Link with underline and arrow */}
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                        className="pt-2 inline-flex items-center gap-2 text-white font-montserrat text-sm md:text-sm border-b border-white/60 pb-1 cursor-pointer"
                        style={{
                          fontWeight: 400,
                          letterSpacing: '0.05em'
                        }}
                      >
                        <span className="uppercase">{t(`${category.key}.button`)}</span>
                        <span className="text-base">→</span>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
