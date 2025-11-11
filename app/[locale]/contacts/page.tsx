'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { useLocale } from 'next-intl';
import { Mail, Phone, MapPin, Instagram, MessageCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactsPage() {
  const locale = useLocale();

  const content = {
    bg: {
      title: 'Свържете се с нас',
      subtitle: 'Ще се радваме да чуем от вас',
      description: 'Имате въпроси за нашите продукти или поръчка? Свържете се с нас през Instagram или WhatsApp.',
      contactInfo: 'Информация за контакт',
      email: 'Email',
      phone: 'Телефон',
      address: 'Адрес',
      addressText: 'София, България',
      social: 'Свържете се с нас',
      instagram: 'Напишете ни в Instagram',
      instagramHandle: '@rodasoleil.bg',
      whatsapp: 'Напишете ни в WhatsApp',
      whatsappText: 'Бързо и удобно',
      businessHours: 'Работно време',
      businessHoursText: 'Понеделник - Петък: 9:00 - 18:00',
      businessHoursWeekend: 'Събота - Неделя: Почивка',
      followUs: 'Последвайте ни'
    },
    ru: {
      title: 'Свяжитесь с нами',
      subtitle: 'Мы будем рады услышать от вас',
      description: 'Есть вопросы о наших продуктах или заказе? Свяжитесь с нами через Instagram или WhatsApp.',
      contactInfo: 'Контактная информация',
      email: 'Email',
      phone: 'Телефон',
      address: 'Адрес',
      addressText: 'София, Болгария',
      social: 'Свяжитесь с нами',
      instagram: 'Напишите нам в Instagram',
      instagramHandle: '@rodasoleil.bg',
      whatsapp: 'Напишите нам в WhatsApp',
      whatsappText: 'Быстро и удобно',
      businessHours: 'Рабочие часы',
      businessHoursText: 'Понедельник - Пятница: 9:00 - 18:00',
      businessHoursWeekend: 'Суббота - Воскресенье: Выходной',
      followUs: 'Следите за нами'
    },
    en: {
      title: 'Get in Touch',
      subtitle: 'We would love to hear from you',
      description: 'Have questions about our products or order? Contact us via Instagram or WhatsApp.',
      contactInfo: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      addressText: 'Sofia, Bulgaria',
      social: 'Connect With Us',
      instagram: 'Message us on Instagram',
      instagramHandle: '@rodasoleil.bg',
      whatsapp: 'Message us on WhatsApp',
      whatsappText: 'Fast and convenient',
      businessHours: 'Business Hours',
      businessHoursText: 'Monday - Friday: 9:00 AM - 6:00 PM',
      businessHoursWeekend: 'Saturday - Sunday: Closed',
      followUs: 'Follow Us'
    }
  };

  const t = content[locale as keyof typeof content] || content.en;

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAF8F4 0%, #FFF5EE 100%)' }}>
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(208, 102, 52, 0.3) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(208, 102, 52, 0.2) 0%, transparent 70%)' }}
        />
      </div>

      <Header forceWhite={true} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-cormorant mb-6" style={{ color: '#d06634', fontWeight: 600, letterSpacing: '0.02em' }}>
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl font-raleway mb-4" style={{ color: '#2A2422', opacity: 0.8, fontWeight: 300 }}>
            {t.subtitle}
          </p>
          <p className="text-base md:text-lg font-raleway max-w-2xl mx-auto" style={{ color: '#2A2422', opacity: 0.6, fontWeight: 300 }}>
            {t.description}
          </p>
          <div className="mt-10 h-px max-w-xs mx-auto" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(208, 102, 52, 0.4) 50%, transparent 100%)' }} />
        </motion.div>

        {/* Главные контакты - Instagram и WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-cormorant text-center mb-10" style={{ color: '#d06634', fontWeight: 600 }}>
            {t.social}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Instagram Card - Glassmorphism */}
            <motion.a
              href="https://www.instagram.com/rodasoleil.bg/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-500"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(208, 102, 52, 0.15)',
                boxShadow: '0 8px 32px rgba(208, 102, 52, 0.1)'
              }}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(208, 102, 52, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(208, 102, 52, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.15)';
              }}
            >
              {/* Gradient overlay на hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, rgba(208, 102, 52, 0.05) 0%, rgba(232, 153, 112, 0.05) 100%)' }}
              />

              <div className="relative flex flex-col items-center text-center space-y-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(208, 102, 52, 0.15) 0%, rgba(232, 153, 112, 0.15) 100%)',
                    boxShadow: '0 4px 16px rgba(208, 102, 52, 0.2)'
                  }}
                >
                  <Instagram className="w-10 h-10" style={{ color: '#d06634' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-raleway font-semibold mb-2" style={{ color: '#d06634' }}>
                    {t.instagram}
                  </h3>
                  <p className="text-lg font-raleway" style={{ color: '#2A2422', opacity: 0.7 }}>
                    {t.instagramHandle}
                  </p>
                </div>
              </div>
            </motion.a>

            {/* WhatsApp Card - Glassmorphism */}
            <motion.a
              href="https://l.instagram.com/?u=https%3A%2F%2Fwa.me%2Fmessage%2FRCFD3RJDPKAWH1%3Ffbclid%3DPAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnjBClp-jkVikNf2qXpekTKBaOqGSfYrLZ4KcLUatwYf81GWEJE7xHzPZGyFM_aem_yJhIFFpmPOWherNODv0f3A&e=AT3dMYhEOF4OCDR-Q7BaQ92nzELiMxPGXGTrSiq1zw7O3IR4eBHNhBoDeKHLbVU3x_Vr2duNemPefqF1nK_uDY3XCry7FEYRo9KeC0lVtQ"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-500"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(208, 102, 52, 0.15)',
                boxShadow: '0 8px 32px rgba(208, 102, 52, 0.1)'
              }}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(208, 102, 52, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(208, 102, 52, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.15)';
              }}
            >
              {/* Gradient overlay на hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, rgba(208, 102, 52, 0.05) 0%, rgba(232, 153, 112, 0.05) 100%)' }}
              />

              <div className="relative flex flex-col items-center text-center space-y-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(208, 102, 52, 0.15) 0%, rgba(232, 153, 112, 0.15) 100%)',
                    boxShadow: '0 4px 16px rgba(208, 102, 52, 0.2)'
                  }}
                >
                  <MessageCircle className="w-10 h-10" style={{ color: '#d06634' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-raleway font-semibold mb-2" style={{ color: '#d06634' }}>
                    {t.whatsapp}
                  </h3>
                  <p className="text-lg font-raleway" style={{ color: '#2A2422', opacity: 0.7 }}>
                    {t.whatsappText}
                  </p>
                </div>
              </div>
            </motion.a>
          </div>
        </motion.div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl font-cormorant text-center mb-10" style={{ color: '#d06634', fontWeight: 600 }}>
            {t.contactInfo}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Email */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(208, 102, 52, 0.12)',
                boxShadow: '0 4px 20px rgba(208, 102, 52, 0.08)'
              }}
              whileHover={{ y: -3 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(208, 102, 52, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(208, 102, 52, 0.08)';
              }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(208, 102, 52, 0.1)' }}
                >
                  <Mail className="w-7 h-7" style={{ color: '#d06634' }} />
                </div>
                <h3 className="text-lg font-raleway font-semibold" style={{ color: '#d06634' }}>
                  {t.email}
                </h3>
                <a
                  href="mailto:info@rodasoleil.bg"
                  className="text-sm font-raleway hover:opacity-100 transition-opacity"
                  style={{ color: '#2A2422', opacity: 0.7 }}
                >
                  info@rodasoleil.bg
                </a>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(208, 102, 52, 0.12)',
                boxShadow: '0 4px 20px rgba(208, 102, 52, 0.08)'
              }}
              whileHover={{ y: -3 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(208, 102, 52, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(208, 102, 52, 0.08)';
              }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(208, 102, 52, 0.1)' }}
                >
                  <Phone className="w-7 h-7" style={{ color: '#d06634' }} />
                </div>
                <h3 className="text-lg font-raleway font-semibold" style={{ color: '#d06634' }}>
                  {t.phone}
                </h3>
                <a
                  href="tel:+359123456789"
                  className="text-sm font-raleway hover:opacity-100 transition-opacity"
                  style={{ color: '#2A2422', opacity: 0.7 }}
                >
                  +359 123 456 789
                </a>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(208, 102, 52, 0.12)',
                boxShadow: '0 4px 20px rgba(208, 102, 52, 0.08)'
              }}
              whileHover={{ y: -3 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(208, 102, 52, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(208, 102, 52, 0.08)';
              }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(208, 102, 52, 0.1)' }}
                >
                  <MapPin className="w-7 h-7" style={{ color: '#d06634' }} />
                </div>
                <h3 className="text-lg font-raleway font-semibold" style={{ color: '#d06634' }}>
                  {t.address}
                </h3>
                <p className="text-sm font-raleway" style={{ color: '#2A2422', opacity: 0.7 }}>
                  {t.addressText}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Рабочее время - широкая карточка */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div
            className="relative overflow-hidden rounded-3xl p-8 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(208, 102, 52, 0.15)',
              boxShadow: '0 8px 32px rgba(208, 102, 52, 0.1)'
            }}
          >
            <div className="flex items-center justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(208, 102, 52, 0.1)' }}
              >
                <Clock className="w-8 h-8" style={{ color: '#d06634' }} />
              </div>
            </div>
            <h3 className="text-2xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
              {t.businessHours}
            </h3>
            <div className="space-y-2 font-raleway text-lg" style={{ color: '#2A2422', opacity: 0.7 }}>
              <p>{t.businessHoursText}</p>
              <p>{t.businessHoursWeekend}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
      <CookieConsent />
    </main>
  );
}
