'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="relative pt-8 md:pt-16 lg:pt-20 pb-6 md:pb-10 overflow-hidden" style={{ background: '#FFFFFF' }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-12 mb-8 md:mb-16">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl md:text-3xl font-cormorant mb-3 md:mb-5" style={{ color: '#d06634', fontWeight: 400, letterSpacing: '0.02em' }}>
              <span style={{ fontWeight: 600 }}>RODA</span>
              <span className="ml-1.5" style={{ fontWeight: 300 }}>Soleil</span>
            </h3>
            <p className="mb-4 md:mb-7 font-raleway" style={{ color: '#2A2422', opacity: 0.7, fontWeight: 300, fontSize: '14px', letterSpacing: '0.01em', lineHeight: 1.6 }}>
              {locale === 'bg'
                ? 'Премиум бански за модерни жени, които ценят качеството и стила.'
                : locale === 'ru'
                ? 'Премиум купальники для современных женщин, которые ценят качество и стиль.'
                : 'Premium swimwear for modern women who value quality and style.'}
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/people/Rodasoleilbulgaria/61550255667531/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(208, 102, 52, 0.1)',
                  border: '1px solid rgba(208, 102, 52, 0.18)',
                  transition: 'all 0.5s linear',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(208, 102, 52, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(208, 102, 52, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(208, 102, 52, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.18)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Facebook className="w-5 h-5" style={{ color: '#d06634' }} />
              </a>
              <a
                href="https://www.instagram.com/rodasoleil.bg/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(208, 102, 52, 0.1)',
                  border: '1px solid rgba(208, 102, 52, 0.18)',
                  transition: 'all 0.5s linear',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(208, 102, 52, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(208, 102, 52, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(208, 102, 52, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(208, 102, 52, 0.18)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Instagram className="w-5 h-5" style={{ color: '#d06634' }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-raleway mb-3 md:mb-5" style={{ color: '#d06634', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '13px' }}>
              {locale === 'bg' ? 'Бързи връзки' : locale === 'ru' ? 'Быстрые ссылки' : 'Quick Links'}
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:flex md:flex-col md:space-y-3.5">
              <li>
                <a href={`/${locale}`} className="font-raleway" style={{ color: '#2A2422', opacity: 0.65, fontSize: '14px', fontWeight: 300, transition: 'all 0.5s linear' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = '#d06634'; e.currentTarget.style.opacity = '1'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = '#2A2422'; e.currentTarget.style.opacity = '0.65'; }}>
                  {locale === 'bg' ? 'Начало' : locale === 'ru' ? 'Главная' : 'Home'}
                </a>
              </li>
              <li>
                <a href={`/${locale}/catalog`} className="font-raleway" style={{ color: '#2A2422', opacity: 0.65, fontSize: '14px', fontWeight: 300, transition: 'all 0.5s linear' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = '#d06634'; e.currentTarget.style.opacity = '1'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = '#2A2422'; e.currentTarget.style.opacity = '0.65'; }}>
                  {locale === 'bg' ? 'Каталог' : locale === 'ru' ? 'Каталог' : 'Catalog'}
                </a>
              </li>
              <li>
                <a href={`/${locale}/about`} className="font-raleway" style={{ color: '#2A2422', opacity: 0.65, fontSize: '14px', fontWeight: 300, transition: 'all 0.5s linear' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = '#d06634'; e.currentTarget.style.opacity = '1'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = '#2A2422'; e.currentTarget.style.opacity = '0.65'; }}>
                  {t('about')}
                </a>
              </li>
              <li>
                <a href={`/${locale}/contacts`} className="font-raleway" style={{ color: '#2A2422', opacity: 0.65, fontSize: '14px', fontWeight: 300, transition: 'all 0.5s linear' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = '#d06634'; e.currentTarget.style.opacity = '1'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = '#2A2422'; e.currentTarget.style.opacity = '0.65'; }}>
                  {locale === 'bg' ? 'Контакти' : locale === 'ru' ? 'Контакты' : 'Contacts'}
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-raleway mb-3 md:mb-5" style={{ color: '#d06634', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '13px' }}>
              {locale === 'bg' ? 'Помощ' : locale === 'ru' ? 'Помощь' : 'Help'}
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:flex md:flex-col md:space-y-3.5">
              <li>
                <a href={`/${locale}#shipping-returns`} className="font-raleway" style={{ color: '#2A2422', opacity: 0.65, fontSize: '14px', fontWeight: 300, transition: 'all 0.5s linear' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = '#d06634'; e.currentTarget.style.opacity = '1'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = '#2A2422'; e.currentTarget.style.opacity = '0.65'; }}>
                  {t('shipping')}
                </a>
              </li>
              <li>
                <a href={`/${locale}#shipping-returns`} className="font-raleway" style={{ color: '#2A2422', opacity: 0.65, fontSize: '14px', fontWeight: 300, transition: 'all 0.5s linear' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = '#d06634'; e.currentTarget.style.opacity = '1'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = '#2A2422'; e.currentTarget.style.opacity = '0.65'; }}>
                  {t('returns')}
                </a>
              </li>
              <li>
                <a href={`/${locale}/privacy`} className="font-raleway" style={{ color: '#2A2422', opacity: 0.65, fontSize: '14px', fontWeight: 300, transition: 'all 0.5s linear' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = '#d06634'; e.currentTarget.style.opacity = '1'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = '#2A2422'; e.currentTarget.style.opacity = '0.65'; }}>
                  {t('privacy')}
                </a>
              </li>
              <li>
                <a href={`/${locale}/terms`} className="font-raleway" style={{ color: '#2A2422', opacity: 0.65, fontSize: '14px', fontWeight: 300, transition: 'all 0.5s linear' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = '#d06634'; e.currentTarget.style.opacity = '1'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = '#2A2422'; e.currentTarget.style.opacity = '0.65'; }}>
                  {t('terms')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-raleway mb-3 md:mb-5" style={{ color: '#d06634', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '13px' }}>
              {t('contact')}
            </h4>
            <ul className="space-y-0 md:space-y-0">
              <li className="flex items-center space-x-3 h-[35px]">
                <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: '#d06634' }} />
                <span className="font-raleway flex items-center h-full" style={{ color: '#2A2422', opacity: 0.7, fontSize: '14px', fontWeight: 300, lineHeight: 1 }}>Burgas, Bulgaria</span>
              </li>
              <li className="flex items-center space-x-3 h-[35px]">
                <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#d06634' }} />
                <a href="tel:+359896235961" className="font-raleway flex items-center h-full" style={{ color: '#2A2422', opacity: 0.65, fontSize: '14px', fontWeight: 300, lineHeight: 1, transition: 'all 0.5s linear' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = '#d06634'; e.currentTarget.style.opacity = '1'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = '#2A2422'; e.currentTarget.style.opacity = '0.65'; }}>
                  +359 896 235 961
                </a>
              </li>
              <li className="flex items-center space-x-3 h-[35px]">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#d06634' }} />
                <a href="mailto:rodasoleilbg@gmail.com" className="font-raleway flex items-center h-full" style={{ color: '#2A2422', opacity: 0.65, fontSize: '14px', fontWeight: 300, lineHeight: 1, transition: 'all 0.5s linear' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = '#d06634'; e.currentTarget.style.opacity = '1'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = '#2A2422'; e.currentTarget.style.opacity = '0.65'; }}>
                  rodasoleilbg@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-10" style={{ borderTop: '1px solid rgba(208, 102, 52, 0.25)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="font-raleway text-center md:text-left" style={{ color: '#2A2422', opacity: 0.6, fontSize: '13px', fontWeight: 300, letterSpacing: '0.01em' }}>
              © {new Date().getFullYear()} RoDaSoleil Bulgaria.
              {locale === 'bg' ? ' Всички права запазени.' : locale === 'ru' ? ' Все права защищены.' : ' All rights reserved.'}
            </p>
            <div className="flex items-center space-x-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100" style={{ transition: 'all 0.5s linear' }}>
              <img src="/images/footer/visa.png" alt="Visa" className="h-8" />
              <img src="/images/footer/mastercard.png" alt="Mastercard" className="h-8" />
              <img src="/images/footer/paypal.png" alt="PayPal" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
