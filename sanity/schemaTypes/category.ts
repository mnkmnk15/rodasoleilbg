import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
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
      name: 'categoryType',
      title: 'Category Type',
      type: 'string',
      options: {
        list: [
          { title: 'Gender/Age Category (Women, Men, Kids)', value: 'gender' },
          { title: 'Product Type (Swimwear, Beachwear, etc.)', value: 'product-type' },
          { title: 'General Category', value: 'general' },
        ],
      },
      description: 'Type of category for filtering purposes',
      initialValue: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: {
        hotspot: true,
      },
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
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this category should appear (lower numbers first)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name.en',
      media: 'image',
      categoryType: 'categoryType',
      order: 'order',
    },
    prepare(selection) {
      const { title, media, categoryType, order } = selection;
      const typeLabel =
        categoryType === 'gender' ? 'Gender/Age' :
        categoryType === 'product-type' ? 'Product Type' :
        'General';
      return {
        title,
        subtitle: `${typeLabel} · Order: ${order}`,
        media,
      };
    },
  },
});
