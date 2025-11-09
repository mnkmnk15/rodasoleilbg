# Настройка Sanity CMS для RoDaSoleil Shop

## Шаг 1: Создание проекта Sanity

1. Зарегистрируйтесь на [sanity.io](https://www.sanity.io/)
2. Создайте новый проект
3. Скопируйте `Project ID` и `Dataset` из настроек проекта

## Шаг 2: Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=ваш_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Шаг 3: Установка Sanity Studio (опционально)

Если вы хотите использовать Sanity Studio локально:

```bash
npm install -g @sanity/cli
sanity init
```

Или используйте [sanity.io/manage](https://www.sanity.io/manage) для управления контентом онлайн.

## Шаг 4: Создание схем в Sanity Studio

### Схема категории (Category)

Создайте файл `schemas/category.ts` в вашем Sanity Studio:

\`\`\`typescript
export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'object',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'string' },
        { name: 'ru', title: 'Russian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}
\`\`\`

### Схема продукта (Product)

Создайте файл `schemas/product.ts`:

\`\`\`typescript
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'object',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'string' },
        { name: 'ru', title: 'Russian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'text' },
        { name: 'ru', title: 'Russian', type: 'text' },
        { name: 'en', title: 'English', type: 'text' },
      ],
    },
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'price',
      title: 'Price (EUR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: 'compareAtPrice',
      title: 'Compare at Price (EUR)',
      type: 'number',
      description: 'Original price for sale items',
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'bestseller',
      title: 'Bestseller',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'newArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'xs' },
          { title: 'S', value: 's' },
          { title: 'M', value: 'm' },
          { title: 'L', value: 'l' },
          { title: 'XL', value: 'xl' },
          { title: 'XXL', value: 'xxl' },
        ],
      },
    },
    {
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Color Name', type: 'string' },
            { name: 'hex', title: 'Hex Code', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'features',
      title: 'Product Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'bg', title: 'Bulgarian', type: 'string' },
            { name: 'ru', title: 'Russian', type: 'string' },
            { name: 'en', title: 'English', type: 'string' },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name.en',
      media: 'images.0',
      price: 'price',
    },
    prepare(selection) {
      const { title, media, price } = selection
      return {
        title,
        subtitle: \`€\${price}\`,
        media,
      }
    },
  },
}
\`\`\`

### Регистрация схем

В файле `schemas/index.ts`:

\`\`\`typescript
import category from './category'
import product from './product'

export const schemaTypes = [category, product]
\`\`\`

## Шаг 5: Создание категорий

Создайте следующие категории в Sanity Studio с указанием типа категории:

### Gender/Age Categories (Категории по полу/возрасту)
Установите **Category Type**: `Gender/Age Category (Women, Men, Kids)`

1. **Women** / **Женски** / **Женские** - slug: `women`
2. **Men** / **Мъжки** / **Мужские** - slug: `mens`
3. **Kids** / **Детски** / **Детские** - slug: `kids`

### Product Type Categories (Типы товаров)
Установите **Category Type**: `Product Type (Swimwear, Beachwear, etc.)`

1. **Swimwear** / **Бански** / **Купальники** - slug: `swimwear`
2. **Beachwear** / **Плажни** / **Пляжная Одежда** - slug: `beachwear`
3. **Pants & Skirts** / **Панталони и Поли** / **Штаны и Юбки** - slug: `pants-skirts`
4. **Robes & Tunics** / **Роби и Туники** / **Халаты и Туники** - slug: `robes-tunics`
5. **T-Shirts & Shorts** / **Тениски и Шорти** / **Футболки и Шорты** - slug: `t-shirts-shorts`
6. **Sleeveless** / **Без Ръкави** / **Без Рукавов** - slug: `sleeveless`
7. **Long Sleeve** / **Дълъг Ръкав** / **Длинный Рукав** - slug: `long-sleeve`
8. **Zippers** / **С Ципове** / **С Молниями** - slug: `zippers`
9. **Accessories** / **Аксесоари** / **Аксессуары** - slug: `accessories`
10. **Other** / **Други** / **Другие** - slug: `other`

### General Categories (Общие категории)
Установите **Category Type**: `General Category`

1. **Shop All** / **Всички** / **Все** - slug: `shop-all` (опционально)

## Шаг 6: Добавление товаров

Для каждого товара заполните:

### Основная информация
- **Название** (на 3 языках: BG, RU, EN)
- **Slug** (автоматически генерируется)
- **Описание** (на 3 языках)
- **Изображения** (минимум 1, рекомендуется 3-5)

### Цены и наличие
- **Цена** (в евро)
- **Старая цена** (опционально, для скидок)
- **В наличии** (да/нет)
- **Бестселлер** (да/нет)
- **Новинка** (да/нет)

### Категоризация (ВАЖНО!)
- **Category** (устаревшее, можно оставить пустым или для совместимости)
- **Gender/Age Category** (выберите: Women, Men или Kids) - **ОБЯЗАТЕЛЬНО**
- **Product Type** (выберите тип товара: Swimwear, Beachwear, и т.д.) - **ОБЯЗАТЕЛЬНО**

### Дополнительная информация
- **Размеры** (выберите доступные размеры: XS, S, M, L, XL, XXL)
- **Цвета** (название и HEX код, например: #FF0000)
- **Особенности** (список характеристик на 3 языках)

**Примечание:** Новые поля `Gender/Age Category` и `Product Type` используются для фильтрации в каталоге. Обязательно заполните их для корректной работы фильтров!

## Шаг 7: Настройка CORS

В настройках проекта Sanity добавьте домен вашего сайта в CORS origins:

```
http://localhost:3000
https://ваш-домен.com
```

## Примеры данных

### Пример товара:

\`\`\`json
{
  "name": {
    "bg": "Елегантен дамски бански с флорален принт",
    "ru": "Элегантный женский купальник с цветочным принтом",
    "en": "Elegant Women's Swimsuit with Floral Print"
  },
  "description": {
    "bg": "Красив дамски бански със свеж флорален принт и tan-through технология",
    "ru": "Красивый женский купальник с свежим цветочным принтом и tan-through технологией",
    "en": "Beautiful women's swimsuit with fresh floral print and tan-through technology"
  },
  "price": 79.99,
  "compareAtPrice": 99.99,
  "inStock": true,
  "bestseller": true,
  "newArrival": false,
  "gender": "women",
  "productType": "swimwear",
  "sizes": ["s", "m", "l", "xl"],
  "colors": [
    { "name": "Tropical Blue", "hex": "#4A90E2" },
    { "name": "Coral Pink", "hex": "#FF6B9D" }
  ],
  "features": [
    {
      "bg": "Tan-through технология",
      "ru": "Tan-through технология",
      "en": "Tan-through technology"
    },
    {
      "bg": "UV защита SPF 35+",
      "ru": "UV защита SPF 35+",
      "en": "UV protection SPF 35+"
    },
    {
      "bg": "Бързо съхнеща тъкан",
      "ru": "Быстросохнущая ткань",
      "en": "Quick-dry fabric"
    }
  ]
}
\`\`\`

### Примери товаров для разных категорий:

**Женский купальник:**
- Gender/Age Category: `women`
- Product Type: `swimwear`

**Мужские плавки:**
- Gender/Age Category: `mens`
- Product Type: `swimwear`

**Детский купальник:**
- Gender/Age Category: `kids`
- Product Type: `swimwear`

**Женская пляжная туника:**
- Gender/Age Category: `women`
- Product Type: `robes-tunics`

**Мужские пляжные шорты:**
- Gender/Age Category: `mens`
- Product Type: `t-shirts-shorts`

## Готово!

Теперь ваш магазин подключен к Sanity CMS. Все товары, которые вы добавите в Sanity, автоматически появятся на сайте.

## Полезные ссылки

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Image URLs](https://www.sanity.io/docs/image-url)
