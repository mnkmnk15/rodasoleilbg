/**
 * RODA Soleil - Premium Design System
 * Премиальная цветовая палитра для luxury swimwear бренда
 *
 * Концепция: Драматичный контраст + благородные акценты
 * - Чистые белые зоны для свежести
 * - Глубокие тёмные зоны для драматизма
 * - Золотистые акценты для премиальности
 */

export const theme = {
  colors: {
    // ========================================
    // ФОНОВЫЕ ЦВЕТА
    // ========================================

    background: {
      // Светлые фоны - чистые, свежие
      white: '#FFFFFF',              // Основной белый (Product cards, sections)
      offWhite: '#FEFDFB',          // Едва заметный тёплый оттенок (альтернатива)
      lightCream: '#FAF8F5',        // Очень светлый кремовый (для разнообразия)

      // Тёмные фоны - драматичные, премиальные
      darkPure: '#0A0A0A',          // Чистый чёрный (максимальный контраст)
      dark: '#121212',              // Глубокий чёрный (Header, Features)
      darkWarm: '#1A1714',          // Чёрный с тёплым подтоном
      darkAlt: '#1F1C19',           // Альтернативный тёплый тёмный

      // Акцентные фоны - для специальных зон
      cream: '#F5F1EB',             // Кремовый (Footer, если нужен мягкий фон)
      sand: '#EDE8E0',              // Песочный (для границ/разделителей)
    },

    // ========================================
    // ЗОЛОТИСТЫЕ АКЦЕНТЫ
    // ========================================

    gold: {
      // Основная палитра - тёплый терракотовый акцент
      lightest: '#FBEBE4',          // Очень светлый персиковый (backgrounds, subtle accents)
      light: '#F5D4C4',             // Светлый персиковый (hover states)
      medium: '#E89970',            // Светлый терракотовый (secondary accents)
      primary: '#d06634',           // Основной терракотовый (главные акценты)
      dark: '#B85528',              // Тёмный терракотовый (текст на светлом)
      darkest: '#A04820',           // Самый тёмный (Footer headings)

      // Специальные оттенки
      metallic: '#d06634',          // Металлический терракот (премиальные кнопки)
      rose: '#E08560',              // Розово-терракотовый (feminine touch)
    },

    // ========================================
    // ТЕКСТОВЫЕ ЦВЕТА
    // ========================================

    text: {
      // На светлом фоне
      primary: '#0F0F0F',           // Основной текст (почти чёрный, читабельный)
      secondary: '#4A4A4A',         // Вторичный текст (серый)
      tertiary: '#8A8A8A',          // Третичный текст (светло-серый)

      // На тёмном фоне
      light: '#FFFFFF',             // Белый текст
      lightSecondary: 'rgba(255, 255, 255, 0.85)',  // Слегка приглушённый
      lightTertiary: 'rgba(255, 255, 255, 0.60)',   // Ещё мягче

      // Акцентный текст
      gold: '#d06634',              // Терракотовый текст (CTA, links)
      goldLight: '#E89970',         // Светлее (hover)
    },

    // ========================================
    // ГРАДИЕНТЫ
    // ========================================

    gradients: {
      // Фоновые градиенты
      darkDramatic: 'linear-gradient(180deg, #0A0A0A 0%, #121212 50%, #0A0A0A 100%)',
      darkWarm: 'linear-gradient(180deg, #1A1714 0%, #121212 50%, #1A1714 100%)',
      lightSubtle: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 50%, #FFFFFF 100%)',
      creamSoft: 'linear-gradient(180deg, #FAF8F5 0%, #F5F1EB 50%, #EDE8E0 100%)',

      // Акцентные градиенты (кнопки, элементы)
      goldPremium: 'linear-gradient(135deg, #E89970 0%, #d06634 100%)',
      goldSoft: 'linear-gradient(135deg, #F5D4C4 0%, #E89970 100%)',
      goldGlass: 'linear-gradient(135deg, rgba(208, 102, 52, 0.15) 0%, rgba(232, 153, 112, 0.20) 100%)',

      // Переходы между секциями
      darkToLight: 'linear-gradient(180deg, #121212 0%, rgba(18, 18, 18, 0.7) 30%, rgba(255, 255, 255, 0.3) 70%, #FFFFFF 100%)',
      lightToDark: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.3) 30%, rgba(18, 18, 18, 0.7) 70%, #121212 100%)',

      // Glow эффекты
      goldGlow: 'radial-gradient(circle, rgba(208, 102, 52, 0.25) 0%, transparent 70%)',
      darkGlow: 'radial-gradient(circle, rgba(208, 102, 52, 0.12) 0%, transparent 70%)',
    },

    // ========================================
    // СПЕЦИАЛЬНЫЕ ЭФФЕКТЫ
    // ========================================

    effects: {
      // Тени с терракотовым оттенком
      shadowSoft: '0 2px 8px rgba(208, 102, 52, 0.06)',
      shadowMedium: '0 4px 16px rgba(208, 102, 52, 0.10)',
      shadowStrong: '0 8px 32px rgba(208, 102, 52, 0.15)',
      shadowDramatic: '0 16px 48px rgba(208, 102, 52, 0.25)',

      // Тени нейтральные (для белого фона)
      shadowNeutralSoft: '0 2px 8px rgba(0, 0, 0, 0.04)',
      shadowNeutralMedium: '0 4px 16px rgba(0, 0, 0, 0.08)',
      shadowNeutralStrong: '0 8px 32px rgba(0, 0, 0, 0.12)',

      // Overlay для изображений
      overlayDark: 'linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 40%, transparent 70%)',
      overlayGold: 'linear-gradient(to top, rgba(208, 102, 52, 0.3) 0%, transparent 50%)',

      // Glassmorphism
      glassLight: 'rgba(255, 255, 255, 0.12)',
      glassDark: 'rgba(18, 18, 18, 0.65)',
      glassGold: 'rgba(208, 102, 52, 0.15)',

      // Borders
      borderLight: 'rgba(208, 102, 52, 0.15)',
      borderMedium: 'rgba(208, 102, 52, 0.25)',
      borderDark: 'rgba(255, 255, 255, 0.12)',
    },
  },

  // ========================================
  // ТИПОГРАФИКА
  // ========================================

  typography: {
    fonts: {
      heading: 'var(--font-cormorant), Georgia, serif',
      body: 'var(--font-raleway), -apple-system, BlinkMacSystemFont, sans-serif',
      accent: 'var(--font-montserrat), -apple-system, BlinkMacSystemFont, sans-serif',
    },

    sizes: {
      // Мобильная оптимизация - достаточно крупные размеры
      mobile: {
        h1: '2.5rem',      // 40px - крупный, читабельный
        h2: '2rem',        // 32px
        h3: '1.5rem',      // 24px
        body: '1rem',      // 16px - минимум для комфортного чтения
        small: '0.875rem', // 14px
      },

      // Планшеты
      tablet: {
        h1: '3.5rem',      // 56px
        h2: '2.75rem',     // 44px
        h3: '2rem',        // 32px
        body: '1.0625rem', // 17px
        small: '0.9375rem',// 15px
      },

      // Десктоп
      desktop: {
        h1: '5rem',        // 80px - впечатляющий
        h2: '3.5rem',      // 56px
        h3: '2.5rem',      // 40px
        body: '1.0625rem', // 17px
        small: '0.9375rem',// 15px
      },
    },
  },

  // ========================================
  // SPACING & LAYOUT
  // ========================================

  spacing: {
    section: {
      mobile: '4rem',    // 64px - достаточный отступ
      tablet: '6rem',    // 96px
      desktop: '8rem',   // 128px
    },
    container: {
      mobile: '1rem',    // 16px - боковые отступы
      tablet: '2rem',    // 32px
      desktop: '3rem',   // 48px
    },
  },

  // ========================================
  // BORDER RADIUS
  // ========================================

  radius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xlarge: '24px',
    pill: '9999px',
    button: '48px',  // Премиальные округлые кнопки
  },

  // ========================================
  // TRANSITIONS
  // ========================================

  transitions: {
    fast: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.22, 1, 0.36, 1)',
    premium: '0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  },

  // ========================================
  // BREAKPOINTS
  // ========================================

  breakpoints: {
    mobile: '0px',
    mobileLarge: '480px',
    tablet: '768px',
    desktop: '1024px',
    desktopLarge: '1280px',
    desktopXL: '1536px',
  },
};

// Экспорт для удобного использования
export const { colors, typography, spacing, radius, transitions, breakpoints } = theme;

export default theme;
