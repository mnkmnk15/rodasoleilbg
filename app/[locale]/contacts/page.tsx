'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { useLocale } from 'next-intl';
import { Instagram, MessageCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactsPage() {
  const locale = useLocale();

  const content = {
    bg: {
      title: 'СВЪРЖЕТЕ СЕ С НАС',
      description: 'Имате въпроси за нашите купальници или поръчка? Свържете се с нас и ние ще ви помогнем да изберете перфектния модел.',
      contact: 'КОНТАКТИ',
      email: 'Email',
      emailAddress: 'rodasoleilbg@gmail.com',
      phone: 'Телефон',
      phoneNumber: '+359 896 235 961',
      address: 'Адрес',
      addressText: 'Бургас, България',
      social: 'СОЦИАЛНИ МРЕЖИ',
      instagram: 'Instagram',
      instagramHandle: '@rodasoleil.bg',
      whatsapp: 'WhatsApp',
      whatsappText: 'Бързо и удобно',
      hours: 'РАБОТНО ВРЕМЕ',
      hoursWeekdays: 'Понеделник - Петък: 9:00 - 18:00',
      hoursWeekend: 'Събота - Неделя: Почивка',
    },
    ru: {
      title: 'СВЯЖИТЕСЬ С НАМИ',
      description: 'Есть вопросы о наших купальниках или заказе? Свяжитесь с нами, и мы поможем вам выбрать идеальную модель.',
      contact: 'КОНТАКТЫ',
      email: 'Email',
      emailAddress: 'rodasoleilbg@gmail.com',
      phone: 'Телефон',
      phoneNumber: '+359 896 235 961',
      address: 'Адрес',
      addressText: 'Бургас, Болгария',
      social: 'СОЦИАЛЬНЫЕ СЕТИ',
      instagram: 'Instagram',
      instagramHandle: '@rodasoleil.bg',
      whatsapp: 'WhatsApp',
      whatsappText: 'Быстро и удобно',
      hours: 'РАБОЧИЕ ЧАСЫ',
      hoursWeekdays: 'Понедельник - Пятница: 9:00 - 18:00',
      hoursWeekend: 'Суббота - Воскресенье: Выходной',
    },
    en: {
      title: 'CONTACT US',
      description: 'Have questions about our swimwear or order? Contact us and we will help you choose the perfect model.',
      contact: 'CONTACT',
      email: 'Email',
      emailAddress: 'rodasoleilbg@gmail.com',
      phone: 'Phone',
      phoneNumber: '+359 896 235 961',
      address: 'Address',
      addressText: 'Burgas, Bulgaria',
      social: 'SOCIAL MEDIA',
      instagram: 'Instagram',
      instagramHandle: '@rodasoleil.bg',
      whatsapp: 'WhatsApp',
      whatsappText: 'Fast and convenient',
      hours: 'BUSINESS HOURS',
      hoursWeekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
      hoursWeekend: 'Saturday - Sunday: Closed',
    }
  };

  const t = content[locale as keyof typeof content] || content.en;

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAF8F4 0%, #FFF5EE 100%)' }}>
      <Header forceWhite={true} />

      <div className="container mx-auto px-4 pt-24 lg:pt-32 pb-12 lg:pb-16">
        {/* Основной контент - разделение на 2 колонки */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Левая колонка - Контент */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-12"
          >
            {/* Заголовок */}
            <div>
              <h1
                className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight font-cormorant"
                style={{ color: '#d06634' }}
              >
                {t.title}
              </h1>
              <p className="text-base lg:text-lg leading-relaxed font-raleway" style={{ color: '#2A2422', opacity: 0.8 }}>
                {t.description}
              </p>
            </div>

            {/* Социальные сети */}
            <div className="space-y-6 pb-8 border-b" style={{ borderColor: 'rgba(208, 102, 52, 0.2)' }}>
              <h3 className="text-sm font-bold uppercase tracking-wider font-raleway" style={{ color: '#d06634' }}>
                {t.social}
              </h3>

              <a
                href="https://www.instagram.com/rodasoleil.bg/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group hover:opacity-70 transition-opacity"
              >
                <Instagram className="w-6 h-6" style={{ color: '#d06634' }} />
                <div>
                  <div className="font-medium text-sm uppercase tracking-wide font-raleway" style={{ color: '#2A2422' }}>
                    {t.instagram}
                  </div>
                  <div className="text-sm font-raleway" style={{ color: '#2A2422', opacity: 0.7 }}>
                    {t.instagramHandle}
                  </div>
                </div>
              </a>

              <a
                href="https://l.instagram.com/?u=https%3A%2F%2Fwa.me%2Fmessage%2FRCFD3RJDPKAWH1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group hover:opacity-70 transition-opacity"
              >
                <MessageCircle className="w-6 h-6" style={{ color: '#d06634' }} />
                <div>
                  <div className="font-medium text-sm uppercase tracking-wide font-raleway" style={{ color: '#2A2422' }}>
                    {t.whatsapp}
                  </div>
                  <div className="text-sm font-raleway" style={{ color: '#2A2422', opacity: 0.7 }}>
                    {t.whatsappText}
                  </div>
                </div>
              </a>
            </div>

            {/* Контактная информация */}
            <div className="space-y-8">
              <h3 className="text-sm font-bold uppercase tracking-wider font-raleway" style={{ color: '#d06634' }}>
                {t.contact}
              </h3>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#d06634' }} />
                <div>
                  <div className="text-sm font-semibold mb-1 font-raleway" style={{ color: '#2A2422' }}>
                    {t.email}
                  </div>
                  <a
                    href={`mailto:${t.emailAddress}`}
                    className="text-sm font-raleway hover:opacity-70 transition-opacity"
                    style={{ color: '#2A2422', opacity: 0.7 }}
                  >
                    {t.emailAddress}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#d06634' }} />
                <div>
                  <div className="text-sm font-semibold mb-1 font-raleway" style={{ color: '#2A2422' }}>
                    {t.phone}
                  </div>
                  <a
                    href={`tel:${t.phoneNumber}`}
                    className="text-sm font-raleway hover:opacity-70 transition-opacity"
                    style={{ color: '#2A2422', opacity: 0.7 }}
                  >
                    {t.phoneNumber}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#d06634' }} />
                <div>
                  <div className="text-sm font-semibold mb-1 font-raleway" style={{ color: '#2A2422' }}>
                    {t.address}
                  </div>
                  <p className="text-sm font-raleway" style={{ color: '#2A2422', opacity: 0.7 }}>
                    {t.addressText}
                  </p>
                </div>
              </div>
            </div>

            {/* Рабочее время */}
            <div className="pt-8 border-t" style={{ borderColor: 'rgba(208, 102, 52, 0.2)' }}>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#d06634' }} />
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider mb-2 font-raleway" style={{ color: '#d06634' }}>
                    {t.hours}
                  </div>
                  <div className="space-y-1 text-sm font-raleway" style={{ color: '#2A2422', opacity: 0.7 }}>
                    <p>{t.hoursWeekdays}</p>
                    <p>{t.hoursWeekend}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Правая колонка - Изображение */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-[500px] lg:h-[900px] lg:sticky lg:top-24"
          >
            <div
              className="relative w-full h-full overflow-hidden rounded-3xl"
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(208, 102, 52, 0.15)'
              }}
            >
              <img
                src="/images/category-women.jpg"
                alt="Roda Soleil Swimwear"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
      <CookieConsent />
    </main>
  );
}
