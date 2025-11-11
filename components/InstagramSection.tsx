'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Instagram } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const instagramImages = [
  '/images/inst/inst1.jpg',
  '/images/inst/inst2.jpg',
  '/images/inst/inst3.jpg',
  '/images/inst/inst4.jpg'
];

export default function InstagramSection() {
  const t = useTranslations('instagram');
  const locale = useLocale();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className="py-12 relative overflow-hidden"
      style={{ background: '#ffffff' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-sm md:text-base font-raleway uppercase tracking-wider" style={{ color: '#1a1a1a', fontWeight: 500 }}>
            {t('followAlong')}
          </h2>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#1a1a1a', opacity: 0.3 }}></div>
          <p className="text-base md:text-lg font-raleway" style={{ color: 'rgb(73, 73, 73)' }}>
            {t('handle')}
          </p>
        </div>
      </motion.div>

      {/* Instagram Grid - 4 большие карточки на всю ширину */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
        {instagramImages.map((image, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <motion.a
              key={index}
              href="https://www.instagram.com/rodasoleil.bg/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative overflow-hidden aspect-square bg-gray-100"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image
                src={image}
                alt={`Instagram post ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
                style={{
                  filter: isHovered ? 'brightness(0.6)' : 'brightness(1)',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'filter 0.5s ease, transform 0.5s ease'
                }}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
              />
              {/* Instagram icon on hover */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.5s ease'
                }}
              >
                <Instagram className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
