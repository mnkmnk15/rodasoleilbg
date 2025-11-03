'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Instagram } from 'lucide-react';
import { useState } from 'react';

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
            {locale === 'bg' ? 'Следвайте ни' : locale === 'ru' ? 'Следуйте за нами' : 'FOLLOW ALONG'}
          </h2>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#1a1a1a', opacity: 0.3 }}></div>
          <p className="text-base md:text-lg font-raleway" style={{ color: 'rgb(73, 73, 73)' }}>
            @rodasoleil.bg
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative overflow-hidden aspect-square"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover"
                style={{
                  filter: isHovered ? 'brightness(0.6)' : 'brightness(1)',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'filter 0.5s ease, transform 0.5s ease'
                }}
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
