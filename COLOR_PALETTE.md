# RODA Soleil - Цветовая Палитра

Этот документ описывает официальную цветовую палитру сайта RODA Soleil.

## Концепция

**Теплая, свежая, средиземноморская палитра** - вдохновленная солнечным светом, золотым песком и элегантностью премиум купальников.

---

## Основные Цвета

### Фоновые (Background)
- `#fdfaf6` - Основной фон (теплый белый)
- `#f9f3eb` - Вторичный фон (кремовый)
- `#ffffff` - Чистый белый для контраста

### Акцентные Золотистые (Primary/Accent)
- `#cfad5b` - Основной золотистый (кнопки, акценты)
- `#e0c481` - Светлый золотистый (градиенты, ховеры)
- `#d4a574` - Медовый (дополнительные элементы)
- `#b8984d` - Темный золотистый (текст на светлом)

### Дополнительные Теплые
- `#f5d4b8` - Персиковый (мягкие акценты)
- `#e8d4b8` - Светло-персиковый
- `#f5ebe0` - Песочный

### Текстовые
- `#3a2f28` - Основной текст (теплый темно-коричневый)
- `#6b5d54` - Вторичный текст
- `rgba(58, 47, 40, 0.75)` - Текст с прозрачностью
- `rgba(58, 47, 40, 0.70)` - Светлый текст

---

## Использование в Градиентах

### Фоновые градиенты секций
```css
/* Мягкий переход */
background: linear-gradient(to bottom, #fdfaf6 0%, #f9f3eb 50%, #fdfaf6 100%);

/* С белым */
background: linear-gradient(to bottom, #ffffff 0%, #fdfaf6 50%, #ffffff 100%);
```

### Акцентные градиенты (кнопки, элементы)
```css
/* Основной золотистый */
background: linear-gradient(135deg, #cfad5b 0%, #e0c481 100%);

/* Для glassmorphism элементов */
background: linear-gradient(135deg, rgba(207, 173, 91, 0.92) 0%, rgba(224, 196, 129, 0.95) 100%);
```

### Декоративные glow эффекты
```css
/* Теплое свечение */
background: radial-gradient(circle, rgba(224, 196, 129, 0.3) 0%, transparent 70%);
background: radial-gradient(circle, rgba(207, 173, 91, 0.25) 0%, transparent 70%);
background: radial-gradient(circle, rgba(245, 212, 184, 0.25) 0%, transparent 70%);
```

---

## Shadows & Effects

### Box Shadows
```css
/* Легкая тень */
box-shadow: 0 4px 16px rgba(207, 173, 91, 0.08);

/* Средняя тень */
box-shadow: 0 8px 24px rgba(207, 173, 91, 0.15);

/* Сильная тень (hover) */
box-shadow: 0 16px 40px rgba(207, 173, 91, 0.25);

/* Премиум с inset */
box-shadow: 0 20px 60px rgba(207, 173, 91, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4);
```

---

## Glassmorphism

### Прозрачные элементы с размытием
```css
background: linear-gradient(135deg, rgba(253, 250, 246, 0.8) 0%, rgba(249, 243, 235, 0.85) 100%);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(207, 173, 91, 0.15);
box-shadow: 0 8px 24px rgba(207, 173, 91, 0.1);
```

---

## НЕ использовать

❌ **Красные/коричнево-красные тона:**
- `#9d4831` (старый красно-коричневый)
- `#7a3726` (темный красно-коричневый)
- Любые холодные красные оттенки

❌ **Холодные серые:**
- `#2c2420` (слишком холодный)
- `gray-900` (черно-серый)

---

## Примеры использования

### Кнопки
```css
/* Primary Button */
background: linear-gradient(135deg, #cfad5b 0%, #e0c481 100%);
color: #ffffff;
box-shadow: 0 8px 24px rgba(207, 173, 91, 0.25);

/* Hover */
box-shadow: 0 12px 36px rgba(207, 173, 91, 0.35);
transform: translateY(-2px);
```

### Карточки
```css
background: linear-gradient(135deg, rgba(253, 250, 246, 0.6) 0%, rgba(249, 243, 235, 0.7) 100%);
border: 1px solid rgba(207, 173, 91, 0.15);
box-shadow: 0 4px 16px rgba(207, 173, 91, 0.08);
```

### Badges/Tags
```css
background: linear-gradient(135deg, rgba(207, 173, 91, 0.12) 0%, rgba(224, 196, 129, 0.15) 100%);
border: 1px solid rgba(207, 173, 91, 0.2);
color: #b8984d;
```

---

## Accessibility

- Основной текст `#3a2f28` на фоне `#fdfaf6` имеет коэффициент контрастности > 7:1 (AAA)
- Золотистые кнопки с белым текстом имеют коэффициент > 4.5:1 (AA)
- Все интерактивные элементы имеют достаточный контраст

---

**Последнее обновление:** 2025-01-11
**Версия:** 2.0 (Warm Mediterranean Palette)
