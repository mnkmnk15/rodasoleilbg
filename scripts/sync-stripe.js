#!/usr/bin/env node

/**
 * Скрипт для синхронизации всех продуктов из Sanity со Stripe
 *
 * Использование:
 *   node scripts/sync-stripe.js
 *
 * Или добавьте в package.json:
 *   "sync-stripe": "node scripts/sync-stripe.js"
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@sanity/client');
const Stripe = require('stripe');

// Проверяем наличие необходимых переменных окружения
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ Ошибка: NEXT_PUBLIC_SANITY_PROJECT_ID не найден в .env');
  console.error('Текущие переменные окружения:', Object.keys(process.env).filter(key => key.includes('SANITY')));
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error('❌ Ошибка: NEXT_PUBLIC_SANITY_DATASET не найден в .env');
  process.exit(1);
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ Ошибка: SANITY_API_TOKEN не найден в .env');
  process.exit(1);
}

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Ошибка: STRIPE_SECRET_KEY не найден в .env');
  process.exit(1);
}

// Инициализируем клиентов
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

async function syncProductToStripe(product) {
  const productName = product.name.en || product.name.bg || product.name.ru;
  const description = product.description?.en || product.description?.bg || product.description?.ru;

  // Преобразуем изображения
  const images = product.images?.map((img) => {
    const ref = img.asset._ref || img.asset._id;
    return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${ref
      .replace('image-', '')
      .replace('-jpg', '.jpg')
      .replace('-png', '.png')
      .replace('-webp', '.webp')}`;
  }) || [];

  let stripeProduct;

  // Создаем или обновляем продукт в Stripe
  if (product.stripeProductId) {
    try {
      stripeProduct = await stripe.products.update(product.stripeProductId, {
        name: productName,
        description: description || undefined,
        images: images.slice(0, 8), // Stripe позволяет максимум 8 изображений
      });
    } catch (error) {
      // Если продукт не найден, создаем новый
      stripeProduct = await stripe.products.create({
        name: productName,
        description: description || undefined,
        images: images.slice(0, 8),
      });
    }
  } else {
    stripeProduct = await stripe.products.create({
      name: productName,
      description: description || undefined,
      images: images.slice(0, 8),
    });
  }

  // Создаем или обновляем цену
  let stripePrice;
  const priceInCents = Math.round(product.price * 100);

  if (product.stripePriceId) {
    try {
      const existingPrice = await stripe.prices.retrieve(product.stripePriceId);

      // Если цена изменилась, создаем новую (цены в Stripe нельзя изменить)
      if (existingPrice.unit_amount !== priceInCents) {
        // Деактивируем старую цену
        await stripe.products.update(stripeProduct.id, {
          default_price: undefined,
        });

        stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: priceInCents,
          currency: 'bgn',
        });
      } else {
        stripePrice = existingPrice;
      }
    } catch (error) {
      // Если цена не найдена, создаем новую
      stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: priceInCents,
        currency: 'bgn',
      });
    }
  } else {
    stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: priceInCents,
      currency: 'bgn',
    });
  }

  // Устанавливаем цену по умолчанию
  await stripe.products.update(stripeProduct.id, {
    default_price: stripePrice.id,
  });

  return {
    stripeProductId: stripeProduct.id,
    stripePriceId: stripePrice.id,
  };
}

async function syncProducts() {
  console.log('🔄 Начинаем синхронизацию продуктов со Stripe...\n');

  try {
    // Получаем все продукты из Sanity
    const products = await sanityClient.fetch(
      `*[_type == "product"]{ _id, name, description, price, images, stripeProductId, stripePriceId }`
    );

    console.log(`📦 Найдено продуктов: ${products.length}\n`);

    const results = [];

    for (const product of products) {
      const productName = product.name.en || product.name.bg || product.name.ru;

      try {
        console.log(`⏳ Синхронизация: ${productName}...`);

        // Синхронизируем с Stripe
        const stripeData = await syncProductToStripe(product);

        // Обновляем продукт в Sanity
        await sanityClient
          .patch(product._id)
          .set({
            stripeProductId: stripeData.stripeProductId,
            stripePriceId: stripeData.stripePriceId,
          })
          .commit();

        results.push({
          productId: product._id,
          productName: productName,
          success: true,
          stripeProductId: stripeData.stripeProductId,
          stripePriceId: stripeData.stripePriceId,
        });

        console.log(`   ✅ Успешно`);
      } catch (error) {
        results.push({
          productId: product._id,
          productName: productName,
          success: false,
          error: error.message,
        });

        console.log(`   ❌ Ошибка: ${error.message}`);
      }
    }

    console.log('\n✅ Синхронизация завершена!\n');
    console.log(`📊 Статистика:`);
    console.log(`   Всего продуктов: ${products.length}`);
    console.log(`   Успешно: ${results.filter((r) => r.success).length}`);
    console.log(`   Ошибки: ${results.filter((r) => !r.success).length}\n`);

    if (results.some((r) => !r.success)) {
      console.log('❌ Продукты с ошибками:\n');
      results
        .filter((r) => !r.success)
        .forEach((result, index) => {
          console.log(`${index + 1}. ${result.productName}`);
          console.log(`   Ошибка: ${result.error}\n`);
        });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка синхронизации:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Запускаем синхронизацию
syncProducts();
