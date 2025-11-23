import { NextRequest, NextResponse } from 'next/server';
import { syncProductToStripe, syncKidsProductToStripe, KidsSizePrice } from '@/lib/stripe';
import { sanityClientWithToken as sanityClient } from '@/sanity/config';

/**
 * API endpoint для синхронизации продуктов из Sanity со Stripe
 * ЗАЩИЩЕН секретным ключом - доступ только из Sanity Studio
 *
 * Использование:
 * POST /api/sync-stripe
 * Headers: { "x-sync-secret": "YOUR_SYNC_SECRET" }
 * Body: { productId: "product-id" } - для синхронизации конкретного продукта
 * Body: { syncAll: true } - для синхронизации всех продуктов
 */

// Список разрешенных origins для CORS
const ALLOWED_ORIGINS = [
  'https://studio-rodasoleil.vercel.app',  // Sanity Studio на Vercel
  'https://rodasoleil.sanity.studio',       // Sanity hosted studio
  'https://www.rodasoleil.bg',              // Production сайт
  'https://rodasoleil.bg',                  // Production сайт (без www)
  'http://localhost:3333',                   // Local Sanity dev
  'http://localhost:3000',                   // Local Next.js dev
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  // Только разрешенные origins получают CORS headers
  const allowedOrigin = isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// CORS preflight
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    // ЗАЩИТА: Проверяем что запрос пришел с разрешенного origin (Sanity Studio)
    // Это защищает от прямых вызовов API извне
    if (!isAllowedOrigin(origin)) {
      console.warn('Unauthorized sync attempt from:', origin || 'unknown (no origin)');
      return NextResponse.json(
        { error: 'Unauthorized: Access only from Sanity Studio' },
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const { productId, syncAll } = body;

    if (!productId && !syncAll) {
      return NextResponse.json(
        { error: 'Either productId or syncAll must be provided' },
        { status: 400, headers: corsHeaders }
      );
    }

    let products = [];

    if (syncAll) {
      // Получаем все продукты из Sanity (включая данные для детских товаров)
      products = await sanityClient.fetch(
        `*[_type == "product"]{ _id, name, description, price, images, stripeProductId, stripePriceId, gender, kidsSizePrices }`
      );
    } else {
      // Получаем конкретный продукт
      const product = await sanityClient.fetch(
        `*[_type == "product" && _id == $id][0]{ _id, name, description, price, images, stripeProductId, stripePriceId, gender, kidsSizePrices }`,
        { id: productId }
      );

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      products = [product];
    }

    const results = [];

    for (const product of products) {
      try {
        const productName = product.name.en || product.name.bg || product.name.ru;

        // Преобразуем Sanity images в URLs
        const images = product.images?.map((img: any) => {
          const sanityImgUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${img.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`;
          return sanityImgUrl;
        });

        const description =
          product.description?.en ||
          product.description?.bg ||
          product.description?.ru;

        // Проверяем, является ли это детским товаром с kidsSizePrices
        const isKidsProduct = product.gender === 'kids' && product.kidsSizePrices && product.kidsSizePrices.length > 0;

        if (isKidsProduct) {
          // Синхронизируем детский товар с множественными ценами
          const kidsSizePrices: KidsSizePrice[] = product.kidsSizePrices.map((sp: any) => ({
            size: sp.size,
            price: sp.price,
            stripePriceId: sp.stripePriceId,
          }));

          const stripeData = await syncKidsProductToStripe({
            id: product._id,
            name: productName,
            description,
            images,
            stripeProductId: product.stripeProductId,
            kidsSizePrices,
          });

          // Обновляем продукт в Sanity с новыми ID из Stripe
          await sanityClient
            .patch(product._id)
            .set({
              stripeProductId: stripeData.stripeProductId,
              kidsSizePrices: stripeData.kidsSizePrices,
            })
            .commit();

          results.push({
            productId: product._id,
            productName,
            success: true,
            stripeProductId: stripeData.stripeProductId,
            kidsSizePrices: stripeData.kidsSizePrices,
            isKidsProduct: true,
          });
        } else {
          // Стандартная синхронизация для взрослых товаров
          const productData = {
            id: product._id,
            name: productName,
            price: product.price,
            description,
            images,
            stripeProductId: product.stripeProductId,
            stripePriceId: product.stripePriceId,
          };

          const stripeData = await syncProductToStripe(productData);

          // Обновляем продукт в Sanity с новыми ID из Stripe
          await sanityClient
            .patch(product._id)
            .set({
              stripeProductId: stripeData.stripeProductId,
              stripePriceId: stripeData.stripePriceId,
            })
            .commit();

          results.push({
            productId: product._id,
            productName,
            success: true,
            stripeProductId: stripeData.stripeProductId,
            stripePriceId: stripeData.stripePriceId,
          });
        }
      } catch (error: any) {
        results.push({
          productId: product._id,
          productName: product.name.en || product.name.bg,
          success: false,
          error: error.message,
        });
      }
    }

    return NextResponse.json(
      {
        message: 'Sync completed',
        results,
        total: products.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync products' },
      { status: 500, headers: corsHeaders }
    );
  }
}
