'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { useLocale } from 'next-intl';
import { Mail, Phone, MapPin, Instagram, MessageCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactsPage() {
  const locale = useLocale();

  const content = {
    bg: {
      title: 'Свържете се с нас',
      subtitle: 'Ще се радваме да чуем от вас',
      description: 'Имате въпроси за нашите продукти или поръчка? Свържете се с нас по един от следните начини.',
      getInTouch: 'Начини за контакт',
      email: 'Email',
      phone: 'Телефон',
      address: 'Адрес',
      addressText: 'София, България',
      social: 'Социални мрежи',
      instagram: 'Instagram',
      instagramHandle: '@rodasoleil',
      whatsapp: 'WhatsApp',
      whatsappText: 'Директно съобщение',
      sendMessage: 'Изпратете съобщение',
      name: 'Име',
      yourEmail: 'Вашият Email',
      message: 'Съобщение',
      send: 'Изпрати',
      businessHours: 'Работно време',
      businessHoursText: 'Понеделник - Петък: 9:00 - 18:00',
      businessHoursWeekend: 'Събота - Неделя: Почивка'
    },
    ru: {
      title: 'Свяжитесь с нами',
      subtitle: 'Мы будем рады услышать от вас',
      description: 'Есть вопросы о наших продуктах или заказе? Свяжитесь с нами одним из следующих способов.',
      getInTouch: 'Способы связи',
      email: 'Email',
      phone: 'Телефон',
      address: 'Адрес',
      addressText: 'София, Болгария',
      social: 'Социальные сети',
      instagram: 'Instagram',
      instagramHandle: '@rodasoleil',
      whatsapp: 'WhatsApp',
      whatsappText: 'Прямое сообщение',
      sendMessage: 'Отправить сообщение',
      name: 'Имя',
      yourEmail: 'Ваш Email',
      message: 'Сообщение',
      send: 'Отправить',
      businessHours: 'Рабочие часы',
      businessHoursText: 'Понедельник - Пятница: 9:00 - 18:00',
      businessHoursWeekend: 'Суббота - Воскресенье: Выходной'
    },
    en: {
      title: 'Get in Touch',
      subtitle: 'We would love to hear from you',
      description: 'Have questions about our products or order? Contact us using one of the following methods.',
      getInTouch: 'Ways to Contact',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      addressText: 'Sofia, Bulgaria',
      social: 'Social Media',
      instagram: 'Instagram',
      instagramHandle: '@rodasoleil',
      whatsapp: 'WhatsApp',
      whatsappText: 'Direct Message',
      sendMessage: 'Send a Message',
      name: 'Name',
      yourEmail: 'Your Email',
      message: 'Message',
      send: 'Send',
      businessHours: 'Business Hours',
      businessHoursText: 'Monday - Friday: 9:00 AM - 6:00 PM',
      businessHoursWeekend: 'Saturday - Sunday: Closed'
    }
  };

  const t = content[locale as keyof typeof content] || content.en;

  return (
    <main className="min-h-screen bg-[#FAF8F4]">
      <Header forceWhite={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cormorant mb-6" style={{ color: '#d06634', fontWeight: 600, letterSpacing: '0.02em' }}>
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl font-raleway mb-4" style={{ color: '#2A2422', opacity: 0.7, fontWeight: 300 }}>
            {t.subtitle}
          </p>
          <p className="text-base md:text-lg font-raleway max-w-2xl mx-auto" style={{ color: '#2A2422', opacity: 0.6, fontWeight: 300 }}>
            {t.description}
          </p>
          <div className="mt-8 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(208, 102, 52, 0.3) 50%, transparent 100%)' }} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-cormorant mb-8" style={{ color: '#d06634', fontWeight: 600 }}>
              {t.getInTouch}
            </h2>

            {/* Email */}
            <div
              className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
            >
              <div className="flex items-start space-x-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(208, 102, 52, 0.1)' }}
                >
                  <Mail className="w-7 h-7" style={{ color: '#d06634' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-raleway mb-2" style={{ color: '#d06634', fontWeight: 600 }}>
                    {t.email}
                  </h3>
                  <a
                    href="mailto:info@rodasoleil.bg"
                    className="text-lg font-raleway hover:opacity-100 transition-opacity"
                    style={{ color: '#2A2422', opacity: 0.7, fontWeight: 400 }}
                  >
                    info@rodasoleil.bg
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div
              className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
            >
              <div className="flex items-start space-x-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(208, 102, 52, 0.1)' }}
                >
                  <Phone className="w-7 h-7" style={{ color: '#d06634' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-raleway mb-2" style={{ color: '#d06634', fontWeight: 600 }}>
                    {t.phone}
                  </h3>
                  <a
                    href="tel:+359123456789"
                    className="text-lg font-raleway hover:opacity-100 transition-opacity"
                    style={{ color: '#2A2422', opacity: 0.7, fontWeight: 400 }}
                  >
                    +359 123 456 789
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div
              className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
            >
              <div className="flex items-start space-x-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(208, 102, 52, 0.1)' }}
                >
                  <MapPin className="w-7 h-7" style={{ color: '#d06634' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-raleway mb-2" style={{ color: '#d06634', fontWeight: 600 }}>
                    {t.address}
                  </h3>
                  <p className="text-lg font-raleway" style={{ color: '#2A2422', opacity: 0.7, fontWeight: 400 }}>
                    {t.addressText}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div
              className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
            >
              <h3 className="text-xl font-raleway mb-6" style={{ color: '#d06634', fontWeight: 600 }}>
                {t.social}
              </h3>
              <div className="space-y-4">
                {/* Instagram */}
                <a
                  href="https://instagram.com/rodasoleil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-300"
                  style={{ background: 'rgba(208, 102, 52, 0.05)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(208, 102, 52, 0.12)';
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(208, 102, 52, 0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(208, 102, 52, 0.15)' }}
                  >
                    <Instagram className="w-6 h-6" style={{ color: '#d06634' }} />
                  </div>
                  <div>
                    <div className="font-raleway font-medium" style={{ color: '#2A2422' }}>
                      {t.instagram}
                    </div>
                    <div className="text-sm font-raleway" style={{ color: '#2A2422', opacity: 0.6 }}>
                      {t.instagramHandle}
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/359123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-300"
                  style={{ background: 'rgba(208, 102, 52, 0.05)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(208, 102, 52, 0.12)';
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(208, 102, 52, 0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(208, 102, 52, 0.15)' }}
                  >
                    <MessageCircle className="w-6 h-6" style={{ color: '#d06634' }} />
                  </div>
                  <div>
                    <div className="font-raleway font-medium" style={{ color: '#2A2422' }}>
                      {t.whatsapp}
                    </div>
                    <div className="text-sm font-raleway" style={{ color: '#2A2422', opacity: 0.6 }}>
                      {t.whatsappText}
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div
              className="bg-white rounded-2xl p-8 shadow-lg"
              style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
            >
              <h3 className="text-xl font-raleway mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                {t.businessHours}
              </h3>
              <div className="space-y-2 font-raleway" style={{ color: '#2A2422', opacity: 0.7 }}>
                <p>{t.businessHoursText}</p>
                <p>{t.businessHoursWeekend}</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl sticky top-24"
              style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
            >
              <h2 className="text-3xl font-cormorant mb-8" style={{ color: '#d06634', fontWeight: 600 }}>
                {t.sendMessage}
              </h2>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-raleway mb-2"
                    style={{ color: '#2A2422', fontWeight: 500 }}
                  >
                    {t.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-xl font-raleway focus:outline-none transition-all"
                    style={{
                      border: '1px solid rgba(208, 102, 52, 0.2)',
                      background: '#FAF8F4'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#d06634';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(208, 102, 52, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-raleway mb-2"
                    style={{ color: '#2A2422', fontWeight: 500 }}
                  >
                    {t.yourEmail}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl font-raleway focus:outline-none transition-all"
                    style={{
                      border: '1px solid rgba(208, 102, 52, 0.2)',
                      background: '#FAF8F4'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#d06634';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(208, 102, 52, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-raleway mb-2"
                    style={{ color: '#2A2422', fontWeight: 500 }}
                  >
                    {t.message}
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl font-raleway focus:outline-none transition-all resize-none"
                    style={{
                      border: '1px solid rgba(208, 102, 52, 0.2)',
                      background: '#FAF8F4'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#d06634';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(208, 102, 52, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-8 rounded-full font-raleway font-medium text-white flex items-center justify-center space-x-2 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #d06634 0%, #E89970 100%)',
                    boxShadow: '0 4px 20px rgba(208, 102, 52, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(208, 102, 52, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(208, 102, 52, 0.3)';
                  }}
                >
                  <span>{t.send}</span>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
      <CookieConsent />
    </main>
  );
}
