import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'object',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'string' },
        { name: 'ru', title: 'Russian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'object',
      description: 'Brief description for product cards (1-2 sentences)',
      fields: [
        {
          name: 'bg',
          title: 'Bulgarian',
          type: 'string',
          validation: (Rule) => Rule.max(150)
        },
        {
          name: 'ru',
          title: 'Russian',
          type: 'string',
          validation: (Rule) => Rule.max(150)
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
          validation: (Rule) => Rule.max(150)
        },
      ],
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'object',
      description: 'Detailed description for product page',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'text' },
        { name: 'ru', title: 'Russian', type: 'text' },
        { name: 'en', title: 'English', type: 'text' },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description (Legacy)',
      type: 'object',
      description: 'Legacy field - use Short Description and Full Description instead',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'text' },
        { name: 'ru', title: 'Russian', type: 'text' },
        { name: 'en', title: 'English', type: 'text' },
      ],
      hidden: true,
    }),
    defineField({
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
    }),
    defineField({
      name: 'price',
      title: 'Price (EUR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare at Price (EUR)',
      type: 'number',
      description: 'Original price for sale items',
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'bestseller',
      title: 'Bestseller',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'newArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'category',
      title: 'Category (Legacy)',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Legacy category field - use Gender and Product Type instead',
    }),
    defineField({
      name: 'gender',
      title: 'Gender/Age Category',
      type: 'string',
      options: {
        list: [
          { title: 'Women', value: 'women' },
          { title: 'Men', value: 'mens' },
          { title: 'Kids', value: 'kids' },
        ],
      },
      description: 'Main category by gender/age group',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          { title: 'Swimwear', value: 'swimwear' },
          { title: 'Beachwear', value: 'beachwear' },
          { title: 'Pants & Skirts', value: 'pants-skirts' },
          { title: 'Robes & Tunics', value: 'robes-tunics' },
          { title: 'T-Shirts & Shorts', value: 't-shirts-shorts' },
          { title: 'Sleeveless', value: 'sleeveless' },
          { title: 'Long Sleeve', value: 'long-sleeve' },
          { title: 'Zippers', value: 'zippers' },
          { title: 'Accessories', value: 'accessories' },
          { title: 'Other', value: 'other' },
        ],
      },
      description: 'Type of product',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes (Adults)',
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
      hidden: ({ document }) => document?.gender === 'kids',
      description: 'For women and men products',
    }),
    defineField({
      name: 'kidsSizes',
      title: 'Available Sizes (Kids)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '104 см', value: '104' },
          { title: '110 см', value: '110' },
          { title: '116 см', value: '116' },
          { title: '122 см', value: '122' },
          { title: '128 см', value: '128' },
          { title: '134 см', value: '134' },
          { title: '140 см', value: '140' },
          { title: '146 см', value: '146' },
          { title: '152 см', value: '152' },
        ],
      },
      hidden: ({ document }) => document?.gender !== 'kids',
      description: 'Height-based sizes for kids products (in cm)',
    }),
    defineField({
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
    }),
    defineField({
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
    }),
    defineField({
      name: 'stripeProductId',
      title: 'Stripe Product ID',
      type: 'string',
      description: 'Auto-generated Stripe Product ID',
      readOnly: true,
    }),
    defineField({
      name: 'stripePriceId',
      title: 'Stripe Price ID',
      type: 'string',
      description: 'Auto-generated Stripe Price ID',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name.en',
      media: 'images.0',
      price: 'price',
      gender: 'gender',
      productType: 'productType',
    },
    prepare(selection) {
      const { title, media, price, gender, productType } = selection;
      return {
        title,
        subtitle: `€${price} · ${gender} · ${productType}`,
        media,
      };
    },
  },
});
