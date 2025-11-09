'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { useLocale } from 'next-intl';

export default function PrivacyPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-[#FAF8F4]">
      <Header forceWhite={true} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cormorant mb-6" style={{ color: '#d06634', fontWeight: 600, letterSpacing: '0.02em' }}>
            Privacy Policy
          </h1>
          <p className="text-lg font-raleway" style={{ color: '#2A2422', opacity: 0.7, fontWeight: 300 }}>
            Политика за поверителност • Политика конфиденциальности
          </p>
          <div className="mt-6 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(208, 102, 52, 0.3) 50%, transparent 100%)' }} />
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 lg:p-16" style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}>
          <div className="space-y-8 font-raleway" style={{ color: '#2A2422' }}>

            {/* Last Updated */}
            <div className="text-sm" style={{ color: '#d06634', fontWeight: 500 }}>
              Последна актуализация: {new Date().toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            {/* Introduction */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                1. Въведение
              </h2>
              <p className="leading-relaxed mb-4" style={{ opacity: 0.85 }}>
                RoDaSoleil Bulgaria („ние", „нашият", „нас") се ангажира да защитава вашата лична информация и правото ви на поверителност. Тази Политика за поверителност обяснява как събираме, използваме, съхраняваме и защитаваме вашата лична информация в съответствие с Общия регламент за защита на данните (GDPR) и българското законодателство за защита на личните данни.
              </p>
              <p className="leading-relaxed" style={{ opacity: 0.85 }}>
                Ако имате въпроси или притеснения относно нашата политика или нашите практики относно вашата лична информация, моля свържете се с нас на info@rodasoleil.bg.
              </p>
            </section>

            {/* Data Controller */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                2. Администратор на лични данни
              </h2>
              <div className="bg-[#FAF8F4] rounded-2xl p-6 leading-relaxed" style={{ opacity: 0.85 }}>
                <p className="mb-2"><strong>Наименование:</strong> RoDaSoleil Bulgaria</p>
                <p className="mb-2"><strong>Адрес:</strong> София, България</p>
                <p className="mb-2"><strong>Email:</strong> info@rodasoleil.bg</p>
                <p className="mb-2"><strong>Телефон:</strong> +359 123 456 789</p>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                3. Каква информация събираме
              </h2>
              <div className="space-y-4 leading-relaxed" style={{ opacity: 0.85 }}>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#d06634' }}>3.1. Лична информация, която ни предоставяте</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Име, фамилия и контактна информация (email, телефон, адрес)</li>
                    <li>Информация за доставка и фактуриране</li>
                    <li>Информация за плащане (обработвана чрез защитени платежни системи)</li>
                    <li>История на поръчките и предпочитания</li>
                    <li>Комуникация с нас (запитвания, обратна връзка, отзиви)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#d06634' }}>3.2. Автоматично събрана информация</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>IP адрес и информация за браузъра</li>
                    <li>Данни за използването на уебсайта (страници, време на посещение)</li>
                    <li>Бисквитки и подобни технологии (виж раздел 7)</li>
                    <li>Устройство и техническа информация</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                4. Как използваме вашата информация
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>Използваме събраната информация за следните цели:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Обработка и изпълнение на вашите поръчки</li>
                  <li>Комуникация относно вашите поръчки и заявки</li>
                  <li>Подобряване на нашите продукти и услуги</li>
                  <li>Персонализиране на вашето пазарско изживяване</li>
                  <li>Изпращане на маркетингови съобщения (само с ваше съгласие)</li>
                  <li>Предотвратяване на измами и осигуряване на сигурност</li>
                  <li>Спазване на законови задължения</li>
                </ul>
              </div>
            </section>

            {/* Legal Basis */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                5. Правно основание за обработка (GDPR)
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>Обработваме вашите лични данни на следните правни основания:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Договор:</strong> За изпълнение на договор за покупка</li>
                  <li><strong>Съгласие:</strong> За маркетингови цели (когато сте дали изрично съгласие)</li>
                  <li><strong>Законно задължение:</strong> За спазване на данъчни и счетоводни изисквания</li>
                  <li><strong>Законен интерес:</strong> За подобряване на услугите и предотвратяване на измами</li>
                </ul>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                6. Споделяне на информация с трети страни
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>Споделяме вашата лична информация само със следните категории получатели:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Доставчици на услуги:</strong> Куриерски компании, платежни процесори</li>
                  <li><strong>Облачни услуги:</strong> Хостинг и IT инфраструктура</li>
                  <li><strong>Маркетингови платформи:</strong> Само с ваше съгласие</li>
                  <li><strong>Законови органи:</strong> Когато е изискано от закона</li>
                </ul>
                <p className="mt-4">
                  Всички наши партньори са задължени да спазват GDPR и да защитават вашата информация.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                7. Бисквитки (Cookies)
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>Използваме следните видове бисквитки:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Необходими бисквитки:</strong> За функционирането на сайта (например, кошница)</li>
                  <li><strong>Аналитични бисквитки:</strong> За разбиране на поведението на потребителите</li>
                  <li><strong>Маркетингови бисквитки:</strong> За персонализирани реклами (само с ваше съгласие)</li>
                </ul>
                <p className="mt-4">
                  Можете да управлявате бисквитките чрез настройките на вашия браузър или чрез нашия банер за бисквитки.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                8. Съхранение на данни
              </h2>
              <div className="leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Съхраняваме вашите лични данни само толкова дълго, колкото е необходимо за целите, за които са събрани, или съгласно законовите изисквания:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Данни за поръчки: 5 години (съгласно данъчното законодателство)</li>
                  <li>Маркетингови данни: До оттегляне на съгласието</li>
                  <li>Аналитични данни: До 26 месеца</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                9. Вашите права (GDPR)
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>Съгласно GDPR имате следните права:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Право на достъп:</strong> Да получите копие от вашите лични данни</li>
                  <li><strong>Право на коригиране:</strong> Да поискате коригиране на неточни данни</li>
                  <li><strong>Право на изтриване:</strong> Да поискате изтриване на вашите данни („Правото да бъдете забравени")</li>
                  <li><strong>Право на ограничаване:</strong> Да ограничите обработката на вашите данни</li>
                  <li><strong>Право на преносимост:</strong> Да получите вашите данни в структуриран формат</li>
                  <li><strong>Право на възражение:</strong> Да възразите срещу обработката на вашите данни</li>
                  <li><strong>Право на оттегляне на съгласието:</strong> По всяко време да оттеглите вашето съгласие</li>
                </ul>
                <p className="mt-4">
                  За да упражните правата си, моля свържете се с нас на info@rodasoleil.bg
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                10. Сигурност на данните
              </h2>
              <div className="leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Прилагаме подходящи технически и организационни мерки за защита на вашите лични данни, включително:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>SSL криптиране за всички трансакции</li>
                  <li>Сигурно съхранение на данни</li>
                  <li>Ограничен достъп до лични данни</li>
                  <li>Редовни одити на сигурността</li>
                </ul>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                11. Поверителност на деца
              </h2>
              <div className="leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Нашият уебсайт не е предназначен за лица под 16 години. Не събираме съзнателно лична информация от деца под 16 години. Ако сте родител или настойник и установите, че вашето дете ни е предоставило лична информация, моля свържете се с нас.
                </p>
              </div>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                12. Международни трансфери
              </h2>
              <div className="leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Вашите данни се обработват и съхраняват предимно в Европейския съюз. Ако трябва да прехвърлим данни извън ЕС, ще осигурим подходящи гаранции съгласно GDPR (например, Стандартни договорни клаузи).
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                13. Промени в политиката
              </h2>
              <div className="leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Можем да актуализираме тази Политика за поверителност периодично. Ще ви уведомим за съществени промени чрез публикуване на новата политика на нашия уебсайт и актуализиране на датата „Последна актуализация" в горната част на тази страница.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                14. Контакт и жалби
              </h2>
              <div className="bg-[#FAF8F4] rounded-2xl p-6 leading-relaxed" style={{ opacity: 0.85 }}>
                <p className="mb-4">
                  Ако имате въпроси относно тази Политика за поверителност или искате да упражните правата си, моля свържете се с нас:
                </p>
                <p className="mb-2"><strong>Email:</strong> info@rodasoleil.bg</p>
                <p className="mb-2"><strong>Телефон:</strong> +359 123 456 789</p>
                <p className="mb-4"><strong>Адрес:</strong> София, България</p>
                <p className="mt-6">
                  Имате право да подадете жалба до Комисията за защита на личните данни (КЗЛД) на Република България:
                </p>
                <p className="mt-2"><strong>КЗЛД:</strong> София 1592, бул. „Проф. Цветан Лазаров" № 2</p>
                <p><strong>Email:</strong> kzld@cpdp.bg</p>
                <p><strong>Телефон:</strong> +359 2 915 3 518</p>
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
      <CookieConsent />
    </main>
  );
}
