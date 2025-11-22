#!/usr/bin/env node

/**
 * Скрипт для сброса Stripe ID и пересинхронизации всех продуктов
 *
 * Используй этот скрипт когда переключаешься с test на live режим Stripe
 *
 * Использование:
 *   node scripts/reset-and-sync-stripe.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@sanity/client');
const Stripe = require('stripe');

// Проверяем наличие необходимых переменных окружения
const requiredEnvVars = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_API_TOKEN',
  'STRIPE_SECRET_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Ошибка: ${envVar} не найден в .env`);
    process.exit(1);
  }
}

// Показываем какой Stripe режим используется
const isLiveMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_');
console.log(`\n🔑 Stripe режим: ${isLiveMode ? '🟢 LIVE (боевой)' : '🟡 TEST (тестовый)'}\n`);

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

async function resetAndSyncProducts() {
  console.log('🔄 Шаг 1: Сброс всех Stripe ID в Sanity...\n');

  try {
    // Получаем все продукты с Stripe ID
    const productsWithStripeIds = await sanityClient.fetch(
      `*[_type == "product" && (stripeProductId != null || stripePriceId != null)]{ _id, name, stripeProductId, stripePriceId }`
    );

    console.log(`📦 Найдено продуктов со Stripe ID: ${productsWithStripeIds.length}`);

    // Сбрасываем Stripe ID у всех продуктов
    for (const product of productsWithStripeIds) {
      const productName = product.name?.en || product.name?.bg || product.name?.ru || product._id;
      console.log(`   🗑️  Сброс ID для: ${productName}`);

      await sanityClient
        .patch(product._id)
        .unset(['stripeProductId', 'stripePriceId'])
        .commit();
    }

    console.log('\n✅ Все Stripe ID сброшены!\n');

    // Теперь синхронизируем заново
    console.log('🔄 Шаг 2: Синхронизация всех продуктов с Stripe...\n');

    const allProducts = await sanityClient.fetch(
      `*[_type == "product"]{ _id, name, description, price, images }`
    );

    console.log(`📦 Всего продуктов для синхронизации: ${allProducts.length}\n`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const product of allProducts) {
      const productName = product.name?.en || product.name?.bg || product.name?.ru || product._id;

      try {
        console.log(`⏳ Синхронизация: ${productName}...`);

        // Преобразуем изображения
        const images = product.images?.map((img) => {
          const ref = img.asset?._ref || img.asset?._id;
          if (!ref) return null;
          return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${ref
            .replace('image-', '')
            .replace('-jpg', '.jpg')
            .replace('-png', '.png')
            .replace('-webp', '.webp')}`;
        }).filter(Boolean) || [];

        const description = product.description?.en || product.description?.bg || product.description?.ru;

        // Создаём продукт в Stripe
        const stripeProduct = await stripe.products.create({
          name: productName,
          description: description || undefined,
          images: images.slice(0, 8),
          metadata: {
            sanityId: product._id,
          },
        });

        // Создаём цену
        const priceInCents = Math.round((product.price || 0) * 100);
        const stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: priceInCents,
          currency: 'eur',
        });

        // Устанавливаем цену по умолчанию
        await stripe.products.update(stripeProduct.id, {
          default_price: stripePrice.id,
        });

        // Обновляем продукт в Sanity
        await sanityClient
          .patch(product._id)
          .set({
            stripeProductId: stripeProduct.id,
            stripePriceId: stripePrice.id,
          })
          .commit();

        console.log(`   ✅ ${stripeProduct.id} / ${stripePrice.id}`);
        successCount++;

      } catch (error) {
        console.log(`   ❌ Ошибка: ${error.message}`);
        errorCount++;
        errors.push({ productName, error: error.message });
      }
    }

    // Итоги
    console.log('\n' + '='.repeat(50));
    console.log('📊 ИТОГИ СИНХРОНИЗАЦИИ');
    console.log('='.repeat(50));
    console.log(`✅ Успешно: ${successCount}`);
    console.log(`❌ Ошибки: ${errorCount}`);
    console.log(`📦 Всего: ${allProducts.length}`);

    if (errors.length > 0) {
      console.log('\n❌ Продукты с ошибками:');
      errors.forEach((e, i) => {
        console.log(`   ${i + 1}. ${e.productName}: ${e.error}`);
      });
    }

    console.log('\n🎉 Готово!\n');
    process.exit(errorCount > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ Критическая ошибка:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Запускаем
resetAndSyncProducts();