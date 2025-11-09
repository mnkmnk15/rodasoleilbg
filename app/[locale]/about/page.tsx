'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Sun, Waves } from 'lucide-react';

export default function AboutPage() {
  const locale = useLocale();

  const content = {
    bg: {
      heroTitle: 'Нашата история',
      heroSubtitle: 'От мечта до реалност',
      questionTitle: 'RODASOLEIL ЗАПОЧНА С ЛИЧЕН ВЪПРОС:',
      question: 'Какво ако баните могат да защитават тялото, да вдъхновяват жената и да нанасят по-малко вреда на океана — всичко наведнъж?',
      founderText: 'Ирина Рубинщайн — журналистка, станала основател — създаде RoDaSoleil след като изпита трудности да намери бански, който да се усеща правилно. Не само по форма, но и по дух.',
      ourStoryTitle: 'НАШАТА ИСТОРИЯ',
      ourStoryText: 'RoDaSoleil е за жени, които се движат през света с намерение. Които искат да се чувстват силни, изразителни и свободни — без компромиси. Това не е за преоформяне на теб. Това е за подкрепа на теб.',
      fromToTitle: 'От соленa вода до тротоар. От кожа до душа.',
      features: [
        {
          icon: 'sun',
          title: 'Tan-Through иновация',
          description: 'Пропуска ~70% от UV лъчите — намалява използването на слънцезащитен крем и помага за предотвратяване на следи от тен.'
        },
        {
          icon: 'sparkles',
          title: 'Грижа за кожата',
          description: 'Дишаща, бързосъхнеща тъкан, която предотвратява раздразнения, зачервявания или фотостареене.'
        },
        {
          icon: 'heart',
          title: 'Изкуство за носене',
          description: 'Всеки принт е създаден с визуални артисти — не масови трендови дъски.'
        },
        {
          icon: 'waves',
          title: 'Направено за продължителност',
          description: 'Произведено в Европа, в малки партиди, с фокус върху качеството и грижата за планетата.'
        }
      ],
      howWeMakeTitle: 'КАК ГО ПРАВИМ',
      howWeMakeSubtitle: 'RoDaSoleil съчетава иновация, сензорен дизайн и съзнателни материали — така че всяка част се движи красиво и се носи без усилие.',
      madeToGoTitle: 'Направено за всякъде',
      madeToGoText: 'Стилизирано като бански или като боди — от потапяне в океана до аперитив на покрива.',
      flatteringTitle: 'Ласкаво, скулптуращо тяло',
      flatteringText: 'Невидима подкрепа където искаш, движение където ти трябва — без стискане, само увереност.',
      inPressTitle: 'В МЕДИИТЕ',
      pressQuote1: '"Бански, които ласкаят без суета — и те водят от плажа до покрива."',
      pressSource1: '— ELLE ЛИТВА',
      pressQuote2: '"Усеща се като тайна, която искаш да споделиш — безвременна и чувствена."',
      pressSource2: '— VOGUE',
      finalMessage: 'RoDaSoleil не е просто нещо, което носиш — това е усещане, което остава с теб.',
      shopCollection: 'Разгледай колекцията'
    },
    ru: {
      heroTitle: 'Наша история',
      heroSubtitle: 'От мечты к реальности',
      questionTitle: 'RODASOLEIL НАЧАЛАСЬ С ЛИЧНОГО ВОПРОСА:',
      question: 'Что если купальники могут защищать тело, вдохновлять женщину и наносить меньше вреда океану — всё сразу?',
      founderText: 'Ирина Рубинштейн — журналистка, ставшая основателем — создала RoDaSoleil после того, как столкнулась с трудностями в поиске купальника, который чувствовался бы правильно. Не только по форме, но и по духу.',
      ourStoryTitle: 'НАША ИСТОРИЯ',
      ourStoryText: 'RoDaSoleil для женщин, которые движутся по миру с намерением. Которые хотят чувствовать себя сильными, выразительными и свободными — без компромиссов. Это не о том, чтобы изменить вас. Это о том, чтобы поддержать вас.',
      fromToTitle: 'От соленой воды до тротуара. От кожи до души.',
      features: [
        {
          icon: 'sun',
          title: 'Tan-Through инновация',
          description: 'Пропускает ~70% UV-лучей — снижает использование солнцезащитного крема и помогает предотвратить следы загара.'
        },
        {
          icon: 'sparkles',
          title: 'Уход за кожей',
          description: 'Дышащая, быстросохнущая ткань, которая предотвращает раздражения, покраснения или фотостарение.'
        },
        {
          icon: 'heart',
          title: 'Искусство для ношения',
          description: 'Каждый принт создан с визуальными художниками — не массовые трендовые доски.'
        },
        {
          icon: 'waves',
          title: 'Создано для долговечности',
          description: 'Произведено в Европе, небольшими партиями, с акцентом на качество и заботу о планете.'
        }
      ],
      howWeMakeTitle: 'КАК МЫ ЭТО ДЕЛАЕМ',
      howWeMakeSubtitle: 'RoDaSoleil сочетает инновации, сенсорный дизайн и осознанные материалы — так что каждая часть движется красиво и носится легко.',
      madeToGoTitle: 'Создано для везде',
      madeToGoText: 'Стилизовано как купальник или как боди — от погружения в океан до аперитива на крыше.',
      flatteringTitle: 'Лестный, скульптурирующий силуэт',
      flatteringText: 'Невидимая поддержка там, где нужно, движение там, где требуется — без сдавливания, только уверенность.',
      inPressTitle: 'В ПРЕССЕ',
      pressQuote1: '"Купальники, которые льстят без суеты — и переносят вас с пляжа на крышу."',
      pressSource1: '— ELLE ЛИТВА',
      pressQuote2: '"Ощущается как секрет, которым хочется поделиться — вне времени и чувственный."',
      pressSource2: '— VOGUE',
      finalMessage: 'RoDaSoleil — это не просто то, что вы носите — это ощущение, которое остается с вами.',
      shopCollection: 'Посмотреть коллекцию'
    },
    en: {
      heroTitle: 'Our Story',
      heroSubtitle: 'From dream to reality',
      questionTitle: 'RODASOLEIL BEGAN WITH A PERSONAL QUESTION:',
      question: 'What if swimwear could protect the body, empower the woman, and do less harm to the ocean — all at once?',
      founderText: 'Irina Rubinstein — a journalist turned founder — created RoDaSoleil after struggling to find a swimsuit that felt right. Not just in shape, but in spirit.',
      ourStoryTitle: 'OUR STORY',
      ourStoryText: 'RoDaSoleil is for women who move through the world with intention. Who want to feel strong, expressive, and free — without compromise. It\'s not about reshaping you. It\'s about supporting you.',
      fromToTitle: 'From saltwater to sidewalk. From skin to soul.',
      features: [
        {
          icon: 'sun',
          title: 'Tan-Through Innovation',
          description: 'Lets ~70% of UV rays through — reducing sunscreen use and helping prevent tan lines.'
        },
        {
          icon: 'sparkles',
          title: 'Skin-Friendly Performance',
          description: 'Breathable, fast-drying fabric that prevents irritation, redness, or photo-aging.'
        },
        {
          icon: 'heart',
          title: 'Wearable Art',
          description: 'Every print is created with visual artists — not mass trend boards.'
        },
        {
          icon: 'waves',
          title: 'Built to Last, Not Overproduce',
          description: 'Made in Europe, in small batches, with a focus on quality and care for the planet.'
        }
      ],
      howWeMakeTitle: 'HOW WE MAKE IT',
      howWeMakeSubtitle: 'RoDaSoleil combines innovation, sensory design, and conscious materials — so every piece moves beautifully and wears effortlessly.',
      madeToGoTitle: 'Made to Go Anywhere',
      madeToGoText: 'Styled as swimwear or as a body — from ocean dip to rooftop aperitivo.',
      flatteringTitle: 'Flattering, Sculpting Fit',
      flatteringText: 'Invisible support where you want it, movement where you need it — no squeezing, just confidence.',
      inPressTitle: 'IN THE PRESS',
      pressQuote1: '"Swimwear that flatters without fuss — and carries you from beach to rooftop."',
      pressSource1: '— ELLE LITHUANIA',
      pressQuote2: '"Feels like a secret you want to share — timeless and sensual."',
      pressSource2: '— VOGUE',
      finalMessage: 'RoDaSoleil isn\'t just something you wear — it\'s a feeling that stays with you.',
      shopCollection: 'Shop Collection'
    }
  };

  const t = content[locale as keyof typeof content] || content.en;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="w-8 h-8" style={{ color: '#d06634' }} />;
      case 'sparkles':
        return <Sparkles className="w-8 h-8" style={{ color: '#d06634' }} />;
      case 'heart':
        return <Heart className="w-8 h-8" style={{ color: '#d06634' }} />;
      case 'waves':
        return <Waves className="w-8 h-8" style={{ color: '#d06634' }} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F4]">
      <Header forceWhite={true} />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-cormorant mb-6" style={{ color: '#d06634', fontWeight: 600, letterSpacing: '0.02em' }}>
              {t.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl font-raleway" style={{ color: '#2A2422', opacity: 0.7, fontWeight: 300 }}>
              {t.heroSubtitle}
            </p>
            <div className="mt-12 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(208, 102, 52, 0.3) 50%, transparent 100%)' }} />
          </motion.div>
        </div>
      </section>

      {/* Question Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-16 shadow-xl text-center"
            style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
          >
            <h2 className="text-sm md:text-base font-raleway mb-6 uppercase tracking-widest" style={{ color: '#d06634', fontWeight: 600 }}>
              {t.questionTitle}
            </h2>
            <p className="text-2xl md:text-4xl font-playfair leading-relaxed mb-8" style={{ color: '#2A2422', fontWeight: 400 }}>
              {t.question}
            </p>
            <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(208, 102, 52, 0.3) 50%, transparent 100%)' }} />
            <p className="text-lg md:text-xl font-raleway leading-relaxed" style={{ color: '#2A2422', opacity: 0.8, fontWeight: 300 }}>
              {t.founderText}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-sm md:text-base font-raleway mb-6 uppercase tracking-widest" style={{ color: '#d06634', fontWeight: 600 }}>
              {t.ourStoryTitle}
            </h2>
            <p className="text-xl md:text-2xl font-raleway leading-relaxed max-w-3xl mx-auto" style={{ color: '#2A2422', opacity: 0.85, fontWeight: 300 }}>
              {t.ourStoryText}
            </p>
          </motion.div>
        </div>
      </section>

      {/* From To Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-playfair" style={{ color: '#d06634', fontWeight: 400, fontStyle: 'italic' }}>
              {t.fromToTitle}
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm md:text-base font-raleway mb-4 uppercase tracking-widest" style={{ color: '#d06634', fontWeight: 600 }}>
              {t.howWeMakeTitle}
            </h2>
            <p className="text-xl md:text-2xl font-raleway max-w-4xl mx-auto" style={{ color: '#2A2422', opacity: 0.8, fontWeight: 300 }}>
              {t.howWeMakeSubtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#FAF8F4] rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
                style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(208, 102, 52, 0.1)' }}
                  >
                    {getIcon(feature.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-raleway mb-3" style={{ color: '#d06634', fontWeight: 600 }}>
                      {feature.title}
                    </h3>
                    <p className="font-raleway leading-relaxed" style={{ color: '#2A2422', opacity: 0.75, fontWeight: 300 }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#FAF8F4] rounded-2xl p-8"
              style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
            >
              <h3 className="text-2xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                {t.madeToGoTitle}
              </h3>
              <p className="font-raleway leading-relaxed" style={{ color: '#2A2422', opacity: 0.75, fontWeight: 300 }}>
                {t.madeToGoText}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-[#FAF8F4] rounded-2xl p-8"
              style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
            >
              <h3 className="text-2xl font-cormorant mb-4" style={{ color: '#d06634', fontWeight: 600 }}>
                {t.flatteringTitle}
              </h3>
              <p className="font-raleway leading-relaxed" style={{ color: '#2A2422', opacity: 0.75, fontWeight: 300 }}>
                {t.flatteringText}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Press Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm md:text-base font-raleway mb-8 uppercase tracking-widest" style={{ color: '#d06634', fontWeight: 600 }}>
              {t.inPressTitle}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
              style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
            >
              <p className="text-lg font-playfair mb-6 italic" style={{ color: '#2A2422', opacity: 0.85 }}>
                {t.pressQuote1}
              </p>
              <p className="text-sm font-raleway" style={{ color: '#d06634', fontWeight: 600 }}>
                {t.pressSource1}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
              style={{ border: '1px solid rgba(208, 102, 52, 0.1)' }}
            >
              <p className="text-lg font-playfair mb-6 italic" style={{ color: '#2A2422', opacity: 0.85 }}>
                {t.pressQuote2}
              </p>
              <p className="text-sm font-raleway" style={{ color: '#d06634', fontWeight: 600 }}>
                {t.pressSource2}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-2xl md:text-4xl font-playfair mb-12" style={{ color: '#2A2422', opacity: 0.85, fontWeight: 400 }}>
              {t.finalMessage}
            </p>
            <a
              href={`/${locale}/catalog`}
              className="inline-block px-12 py-4 rounded-full font-raleway font-medium text-white text-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, #d06634 0%, #E89970 100%)',
                boxShadow: '0 4px 20px rgba(208, 102, 52, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(208, 102, 52, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(208, 102, 52, 0.3)';
              }}
            >
              {t.shopCollection}
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <CookieConsent />
    </main>
  );
}
