// Sanity Schema Definitions for RoDaSoleil Shop
// These schemas should be added to your Sanity Studio

/**
 * Product Schema
 *
 * To use this in Sanity Studio, create a new schema file in your Sanity project:
 * schemas/product.ts
 */

export const productSchema = {
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
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.en',
        maxLength: 96,
      },
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
    },
    {
      name: 'price',
      title: 'Price (EUR)',
      type: 'number',
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
    prepare(selection: any) {
      const { title, media, price } = selection;
      return {
        title,
        subtitle: `€${price}`,
        media,
      };
    },
  },
};

/**
 * Category Schema
 */
export const categorySchema = {
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
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.en',
        maxLength: 96,
      },
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
};

/**
 * Homepage Banner Schema
 */
export const bannerSchema = {
  name: 'banner',
  title: 'Homepage Banner',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'string' },
        { name: 'ru', title: 'Russian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'object',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'string' },
        { name: 'ru', title: 'Russian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    },
    {
      name: 'video',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    },
    {
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      description: 'Fallback image shown before video loads',
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    },
  ],
};
