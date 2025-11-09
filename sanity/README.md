# Sanity CMS Integration

Эта папка содержит конфигурацию и схемы для интеграции с Sanity CMS.

## Структура файлов

```
sanity/
├── config.ts           # Конфигурация подключения к Sanity
├── queries.ts          # GROQ запросы для получения данных
├── schemas.ts          # Экспортируемые схемы (для справки)
├── schemaTypes/        # Отдельные файлы схем для Sanity Studio
│   ├── product.ts      # Схема товара
│   ├── category.ts     # Схема категории
│   ├── banner.ts       # Схема баннера
│   └── index.ts        # Экспорт всех схем
└── README.md           # Этот файл
```

## Использование схем

### Для Sanity Studio

Если вы используете Sanity Studio, скопируйте файлы из папки `schemaTypes/` в ваш Sanity проект:

1. Создайте папку `schemas` в вашем Sanity Studio проекте
2. Скопируйте все файлы из `sanity/schemaTypes/` в `schemas/`
3. Импортируйте схемы в файл конфигурации Sanity

```typescript
// sanity.config.ts
import { schemaTypes } from './schemas';

export default defineConfig({
  // ... другие настройки
  schema: {
    types: schemaTypes,
  },
});
```

### Новая система фильтрации

Начиная с версии 2.0, мы используем новую систему фильтрации:

#### Поля продукта

- **gender** (обязательное): Категория по полу/возрасту
  - `women` - Женские товары
  - `mens` - Мужские товары
  - `kids` - Детские товары

- **productType** (обязательное): Тип товара
  - `swimwear` - Купальники
  - `beachwear` - Пляжная одежда
  - `pants-skirts` - Штаны и юбки
  - `robes-tunics` - Халаты и туники
  - `t-shirts-shorts` - Футболки и шорты
  - `sleeveless` - Без рукавов
  - `long-sleeve` - Длинный рукав
  - `zippers` - С молниями
  - `accessories` - Аксессуары
  - `other` - Другое

- **category** (устаревшее, опционально): Старое поле категории для обратной совместимости

#### Типы категорий

Категории теперь имеют поле `categoryType`:

- `gender` - Категории по полу/возрасту (Women, Men, Kids)
- `product-type` - Типы товаров (Swimwear, Beachwear, и т.д.)
- `general` - Общие категории

## Запросы

### Основные запросы

```typescript
// Получить все товары
const products = await getAllProducts();

// Получить товар по slug
const product = await getProductBySlug('product-slug');

// Получить все категории
const categories = await getAllCategories();
```

### Фильтрация

```typescript
// Получить женские товары
const womenProducts = await getProductsByGender('women');

// Получить купальники
const swimwear = await getProductsByType('swimwear');

// Получить женские купальники
const womenSwimwear = await getProductsByGenderAndType('women', 'swimwear');

// Получить категории определенного типа
const genderCategories = await getCategoriesByType('gender');
```

## Миграция с старой системы

Если у вас есть товары со старой системой категорий:

1. Откройте каждый товар в Sanity Studio
2. Заполните поля **Gender/Age Category** и **Product Type**
3. Поле **Category** можно оставить для обратной совместимости или удалить

## TypeScript типы

Все типы определены в `types/sanity.ts`:

```typescript
interface SanityProduct {
  // ... другие поля
  gender: 'women' | 'mens' | 'kids';
  productType: 'swimwear' | 'beachwear' | 'pants-skirts' | ...;
  category?: SanityCategory; // Опционально
}

interface SanityCategory {
  // ... другие поля
  categoryType: 'gender' | 'product-type' | 'general';
  order: number;
}
```

## Подробная документация

Смотрите [SANITY_SETUP.md](../SANITY_SETUP.md) для полной инструкции по настройке.
