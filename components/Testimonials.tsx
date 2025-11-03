'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: { bg: 'Елена П.', ru: 'Елена П.', en: 'Elena P.' },
    location: { bg: 'Варна, България', ru: 'Варна, Болгария', en: 'Varna, Bulgaria' },
    rating: 5,
    text: {
      bg: 'Най-добрият бански, който съм притежавала! Качеството е невероятно, а загарът наистина е равномерен. Страхотна инвестиция!',
      ru: 'Лучший купальник, который у меня когда-либо был! Качество невероятное, а загар действительно ровный. Отличная инвестиция!',
      en: 'The best swimsuit I\'ve ever owned! The quality is amazing and the tan is truly even. Great investment!'
    },
    image: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: { bg: 'Мария С.', ru: 'Мария С.', en: 'Maria S.' },
    location: { bg: 'София, България', ru: 'София, Болгария', en: 'Sofia, Bulgaria' },
    rating: 5,
    text: {
      bg: 'Изключително удобни и елегантни! Получавам комплименти всеки път, когато ги нося. Tan-through технологията работи перфектно.',
      ru: 'Исключительно удобные и элегантные! Получаю комплименты каждый раз, когда их ношу. Tan-through технология работает идеально.',
      en: 'Exceptionally comfortable and elegant! I get compliments every time I wear them. The tan-through technology works perfectly.'
    },
    image: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 3,
    name: { bg: 'Ана Д.', ru: 'Анна Д.', en: 'Anna D.' },
    location: { bg: 'Бургас, България', ru: 'Бургас, Болгария', en: 'Burgas, Bulgaria' },
    rating: 5,
    text: {
      bg: 'Перфектен избор за плажа! Материалът е висококачествен, а дизайнът е много модерен. Определено ще поръчам още.',
      ru: 'Идеальный выбор для пляжа! Материал высококачественный, а дизайн очень современный. Обязательно закажу еще.',
      en: 'Perfect choice for the beach! The material is high quality and the design is very modern. Will definitely order more.'
    },
    image: 'https://i.pravatar.cc/150?img=9'
  }
];

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #fdfaf6 0%, #f9f3eb 50%, #fdfaf6 100%)'
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(207, 173, 91, 0.25) 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(224, 196, 129, 0.2) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center space-x-2 px-5 py-2.5 mb-6 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: 'linear-gradient(135deg, rgba(207, 173, 91, 0.12) 0%, rgba(224, 196, 129, 0.15) 100%)',
              border: '1px solid rgba(207, 173, 91, 0.2)'
            }}
          >
            <Star className="w-4 h-4 text-[#cfad5b]" fill="#cfad5b" />
            <span className="text-sm font-medium text-[#b8984d] tracking-wider uppercase">
              {locale === 'bg' ? 'Отзиви' : locale === 'ru' ? 'Отзывы' : 'Testimonials'}
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#3a2f28] mb-6 font-cormorant"
            style={{ fontWeight: 300, letterSpacing: '0.01em' }}
          >
            {locale === 'bg'
              ? 'Какво казват нашите клиенти'
              : locale === 'ru'
              ? 'Что говорят наши клиенты'
              : 'What Our Clients Say'}
          </h2>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={inView ? { width: '120px', opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-[2px] mx-auto rounded-full"
            style={{
              background: 'linear-gradient(90deg, #cfad5b 0%, #e0c481 50%, transparent 100%)'
            }}
          />
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <div
                className="relative p-8 rounded-3xl h-full flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, rgba(253, 250, 246, 0.8) 0%, rgba(249, 243, 235, 0.85) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(207, 173, 91, 0.15)',
                  boxShadow: '0 8px 24px rgba(207, 173, 91, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(207, 173, 91, 0.3)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(207, 173, 91, 0.18)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(207, 173, 91, 0.15)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(207, 173, 91, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-16 h-16 text-[#cfad5b]" fill="#cfad5b" />
                </div>

                {/* Stars */}
                <div className="flex space-x-1 mb-6 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#cfad5b]" fill="#cfad5b" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-[#3a2f28] leading-relaxed mb-8 font-raleway relative z-10 flex-1"
                  style={{ fontSize: '15px', lineHeight: 1.8 }}
                >
                  {testimonial.text[locale as keyof typeof testimonial.text]}
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#cfad5b]/20">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name[locale as keyof typeof testimonial.name]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-[#3a2f28] font-raleway">
                      {testimonial.name[locale as keyof typeof testimonial.name]}
                    </div>
                    <div className="text-sm text-[#3a2f28]/60 font-raleway">
                      {testimonial.location[locale as keyof typeof testimonial.location]}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              number: '5000+',
              label: locale === 'bg' ? 'Доволни клиенти' : locale === 'ru' ? 'Довольных клиентов' : 'Happy Clients'
            },
            {
              number: '4.9/5',
              label: locale === 'bg' ? 'Средна оценка' : locale === 'ru' ? 'Средняя оценка' : 'Average Rating'
            },
            {
              number: '98%',
              label: locale === 'bg' ? 'Препоръчват ни' : locale === 'ru' ? 'Рекомендуют нас' : 'Recommend Us'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              className="text-center p-8 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(207, 173, 91, 0.08) 0%, rgba(224, 196, 129, 0.12) 100%)',
                border: '1px solid rgba(207, 173, 91, 0.1)'
              }}
            >
              <div className="text-5xl font-light text-[#cfad5b] mb-3 font-cormorant" style={{ fontWeight: 400 }}>
                {stat.number}
              </div>
              <div className="text-[#3a2f28]/70 font-raleway font-medium uppercase tracking-wider text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
