'use client';

import { motion } from 'framer-motion';

interface SectionTransitionProps {
  variant?: 'dark-to-light' | 'light-to-dark' | 'subtle';
  height?: 'small' | 'medium' | 'large';
}

/**
 * Компонент для плавных переходов между секциями
 * Устраняет резкие скачки цветов
 */
export default function SectionTransition({
  variant = 'dark-to-light',
  height = 'medium'
}: SectionTransitionProps) {

  const heightClasses = {
    small: 'h-16 md:h-24',
    medium: 'h-24 md:h-32 lg:h-40',
    large: 'h-32 md:h-48 lg:h-64'
  };

  const gradients = {
    'dark-to-light': 'linear-gradient(180deg, #121212 0%, rgba(18, 18, 18, 0.8) 20%, rgba(255, 255, 255, 0.3) 70%, #FFFFFF 100%)',
    'light-to-dark': 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.3) 30%, rgba(18, 18, 18, 0.8) 80%, #121212 100%)',
    'subtle': 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(250, 248, 245, 0.5) 50%, rgba(255, 255, 255, 0) 100%)'
  };

  return (
    <motion.div
      className={`w-full ${heightClasses[height]} pointer-events-none`}
      style={{
        background: gradients[variant]
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    />
  );
}
