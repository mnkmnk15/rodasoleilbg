'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { useLocale } from 'next-intl';

export default function TermsPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-[#FAF8F4]">
      <Header forceWhite={true} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cormorant mb-6" style={{ color: '#d06634', fontWeight: 600, letterSpacing: '0.02em' }}>
            {locale === 'bg' ? 'Общи условия' : locale === 'ru' ? 'Условия использования' : 'Terms and Conditions'}
          </h1>
          <p className="text-lg font-raleway" style={{ color: '#2A2422', opacity: 0.7, fontWeight: 300 }}>
            Общи условия за ползване • Условия использования
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
                1. Общи разпоредби
              </h2>
              <p className="leading-relaxed mb-4" style={{ opacity: 0.85 }}>
                Настоящите Общи условия уреждат отношенията между RoDaSoleil Bulgaria („Доставчик", „ние", „нас") и потребителите („Потребител", „Вие") на онлайн магазина www.rodasoleil.bg, във връзка с предоставяните услуги и продажба на стоки.
              </p>
              <p className="leading-relaxed" style={{ opacity: 0.85 }}>
                С използването на този уебсайт и/или с подаване на поръчка, Вие приемате тези Общи условия и се съгласявате да ги спазвате. Тези условия са изготвени в съответствие със Закона за защита на потребителите (ЗЗП), Закона за електронната търговия (ЗЕТ) и приложимото българско и европейско законодателство.
              </p>
            </section>

            {/* Company Info */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                2. Информация за Доставчика
              </h2>
              <div className="bg-[#FAF8F4] rounded-2xl p-6 leading-relaxed" style={{ opacity: 0.85 }}>
                <p className="mb-2"><strong>Наименование:</strong> RoDaSoleil Bulgaria</p>
                <p className="mb-2"><strong>Седалище и адрес:</strong> Бургас, България</p>
                <p className="mb-2"><strong>Email:</strong> rodasoleilbg@gmail.com</p>
                <p className="mb-2"><strong>Телефон:</strong> +359 896 235 961</p>
              </div>
            </section>

            {/* Products and Services */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                3. Продукти и услуги
              </h2>
              <div className="space-y-4 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Онлайн магазинът предлага дамски и мъжки бански костюми и аксесоари. Всички продукти са описани максимално точно, като снимките имат илюстративен характер.
                </p>
                <p>
                  Цените на продуктите са посочени в български лева (BGN) и включват ДДС, където е приложимо. Доставчикът си запазва правото да променя цените без предварително уведомление, като промяната не засяга вече направени поръчки.
                </p>
              </div>
            </section>

            {/* Ordering Process */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                4. Процес на поръчка
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>Поръчката се извършва чрез следните стъпки:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Избор на продукти и добавяне в количката</li>
                  <li>Преглед на количката и потвърждение на избора</li>
                  <li>Въвеждане на данни за доставка и фактуриране</li>
                  <li>Избор на метод на плащане</li>
                  <li>Потвърждение на поръчката</li>
                </ol>
                <p className="mt-4">
                  След успешно подаване на поръчката, ще получите потвърждение на посочения от Вас имейл адрес. Договорът за продажба се счита за сключен от момента на изпращане на това потвърждение.
                </p>
              </div>
            </section>

            {/* Payment Methods */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                5. Начини на плащане
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>Приемаме следните методи на плащане:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Онлайн плащане с карта:</strong> Чрез защитена платежна система Stripe (Visa, MasterCard)</li>
                  <li><strong>Наложен платеж:</strong> Плащане при получаване на пратката</li>
                </ul>
                <p className="mt-4">
                  Всички онлайн плащания се обработват чрез сертифицирани платежни системи със SSL криптиране за максимална сигурност.
                </p>
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                6. Доставка
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Доставката се извършва на територията на Република България чрез куриерска фирма. Срокът за доставка е обикновено между 1-5 работни дни от потвърждаване на поръчката.
                </p>
                <p>
                  Цената за доставка се определя в зависимост от избрания метод и се посочва преди финализиране на поръчката. При поръчки над определена стойност, доставката може да бъде безплатна.
                </p>
                <p>
                  Рискът от загуба или повреда на стоките преминава върху потребителя в момента, в който той или посочено от него трето лице (различно от превозвача) придобие физическо владение върху стоките.
                </p>
              </div>
            </section>

            {/* Right of Withdrawal */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                7. Право на отказ (чл. 50-56 ЗЗП)
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Съгласно Закона за защита на потребителите, имате право да се откажете от договора за покупка в срок от <strong>14 дни</strong> от получаване на стоката, без да посочвате причина и без да дължите обезщетение или неустойка.
                </p>
                <div className="bg-[#FAF8F4] rounded-2xl p-6 my-4">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#d06634' }}>Условия за упражняване на правото на отказ:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Стоката да е в оригинална опаковка, с всички етикети</li>
                    <li>Стоката да не е използвана (от хигиенни съображения баните трябва да са неизпробвани)</li>
                    <li>Да уведомите Доставчика в писмена форма за желанието си за отказ</li>
                    <li>Да върнете стоката в срок от 14 дни от уведомлението</li>
                  </ul>
                </div>
                <p>
                  За да упражните правото си на отказ, моля свържете се с нас на rodasoleilbg@gmail.com или на телефон +359 896 235 961.
                </p>
                <p>
                  При отказ от договора, ще Ви възстановим всички плащания, получени от Вас, включително разходите за доставка (с изключение на допълнителни разходи, произтичащи от избран от Вас начин на доставка, различен от най-евтиния стандартен начин на доставка, предлаган от нас), без неоправдано забавяне и не по-късно от 14 дни от датата, на която сме били уведомени за решението Ви да се откажете от договора.
                </p>
              </div>
            </section>

            {/* Warranty and Claims */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                8. Гаранция и рекламации
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Съгласно ЗЗП, потребителят има право на рекламация на стока, която не съответства на договореното, в срок от <strong>2 години</strong> от доставката.
                </p>
                <p>
                  Рекламации се подават писмено на email: rodasoleilbg@gmail.com или по телефон: +359 896 235 961.
                </p>
                <p>
                  При основателна рекламация, по избор на потребителя имате право на:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Безплатно привеждане на стоката в съответствие с договора чрез ремонт или замяна</li>
                  <li>Намаление на цената</li>
                  <li>Възстановяване на платената сума и разваляне на договора</li>
                </ul>
              </div>
            </section>

            {/* Liability */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                9. Ограничение на отговорността
              </h2>
              <div className="leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Доставчикът не носи отговорност за забавяне или неизпълнение на задълженията си поради форсмажорни обстоятелства (природни бедствия, стачки, пандемии и др.). В такива случаи срокът за изпълнение се удължава съответно.
                </p>
                <p className="mt-3">
                  Доставчикът не носи отговорност за неизпълнение на задълженията си, дължащо се на неверни или непълни данни, предоставени от потребителя.
                </p>
              </div>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                10. Защита на личните данни
              </h2>
              <div className="leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Обработката на лични данни се извършва в съответствие с GDPR и българското законодателство за защита на личните данни. За повече информация, моля вижте нашата{' '}
                  <a href={`/${locale}/privacy`} className="underline" style={{ color: '#d06634' }}>
                    Политика за поверителност
                  </a>.
                </p>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                11. Разрешаване на спорове
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  При възникване на спор, страните ще положат усилия за доброволното му разрешаване. При невъзможност за постигане на споразумение, спорът може да бъде отнесен до:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Комисия за защита на потребителите (КЗП):</strong> гр. София, пл. „Славейков" №4А</li>
                  <li><strong>Платформа за онлайн разрешаване на спорове на ЕС:</strong>{' '}
                    <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#d06634' }}>
                      https://ec.europa.eu/consumers/odr
                    </a>
                  </li>
                  <li>Компетентния български съд съгласно българското законодателство</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                12. Интелектуална собственост
              </h2>
              <div className="leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Всички материали на този уебсайт (текстове, изображения, логота, дизайн) са защитени от Закона за авторското право и сродните му права. Използването им без изрично писмено съгласие е забранено.
                </p>
              </div>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                13. Изменения на Общите условия
              </h2>
              <div className="leading-relaxed" style={{ opacity: 0.85 }}>
                <p>
                  Доставчикът си запазва правото да изменя настоящите Общи условия по всяко време. Измененията влизат в сила от датата на публикуването им на уебсайта и не засягат вече сключени договори.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl md:text-3xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                14. Контакти
              </h2>
              <div className="bg-[#FAF8F4] rounded-2xl p-6 leading-relaxed" style={{ opacity: 0.85 }}>
                <p className="mb-4">
                  За въпроси относно тези Общи условия или Вашите поръчки, моля свържете се с нас:
                </p>
                <p className="mb-2"><strong>Email:</strong> rodasoleilbg@gmail.com</p>
                <p className="mb-2"><strong>Телефон:</strong> +359 896 235 961</p>
                <p className="mb-2"><strong>WhatsApp:</strong> +359 896 235 961</p>
                <p><strong>Адрес:</strong> Бургас, България</p>
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
