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

Создайте следующие категории в Sanity Studio (используйте соответствующие slug):

1. **Shop All** - slug: `shop-all`
2. **Pants & Skirts** - slug: `pants-skirts`
3. **Robes & Tunics** - slug: `robes-tunics`
4. **T-Shirts & Shorts** - slug: `t-shirts-shorts`
5. **Sleeveless** - slug: `sleeveless`
6. **Long Sleeve** - slug: `long-sleeve`
7. **Zippers** - slug: `zippers`
8. **WOMEN** - slug: `women`
9. **Men's** - slug: `mens`
10. **Accessories** - slug: `accessories`
11. **OTHER** - slug: `other`
12. **Swimwear** - slug: `swimwear`
13. **Beachwear** - slug: `beachwear`
14. **KIDS** - slug: `kids`

## Шаг 6: Добавление товаров

Для каждого товара заполните:

- **Название** (на 3 языках: BG, RU, EN)
- **Slug** (автоматически генерируется)
- **Описание** (на 3 языках)
- **Изображения** (минимум 1, рекомендуется 3-5)
- **Цена** (в евро)
- **Старая цена** (опционально, для скидок)
- **В наличии** (да/нет)
- **Бестселлер** (да/нет)
- **Новинка** (да/нет)
- **Категория** (выберите из списка)
- **Размеры** (выберите доступные размеры)
- **Цвета** (название и HEX код, например: #FF0000)
- **Особенности** (список характеристик на 3 языках)

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
    "bg": "Лятна рокля с цветя",
    "ru": "Летнее платье с цветами",
    "en": "Summer Floral Dress"
  },
  "description": {
    "bg": "Красива лятна рокля със свеж флорален принт",
    "ru": "Красивое летнее платье с свежим цветочным принтом",
    "en": "Beautiful summer dress with fresh floral print"
  },
  "price": 59.99,
  "compareAtPrice": 89.99,
  "inStock": true,
  "bestseller": true,
  "newArrival": false,
  "sizes": ["s", "m", "l", "xl"],
  "colors": [
    { "name": "Бяло", "hex": "#FFFFFF" },
    { "name": "Синьо", "hex": "#4A90E2" }
  ],
  "features": [
    {
      "bg": "100% памук",
      "ru": "100% хлопок",
      "en": "100% cotton"
    },
    {
      "bg": "Машинно пране",
      "ru": "Машинная стирка",
      "en": "Machine washable"
    }
  ]
}
\`\`\`

## Готово!

Теперь ваш магазин подключен к Sanity CMS. Все товары, которые вы добавите в Sanity, автоматически появятся на сайте.

## Полезные ссылки

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Image URLs](https://www.sanity.io/docs/image-url)
