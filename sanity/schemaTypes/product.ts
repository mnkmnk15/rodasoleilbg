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
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'text' },
        { name: 'ru', title: 'Russian', type: 'text' },
        { name: 'en', title: 'English', type: 'text' },
      ],
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
