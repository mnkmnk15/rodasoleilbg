import { NextRequest, NextResponse } from 'next/server';
import { syncProductToStripe } from '@/lib/stripe';
import { sanityClientWithToken as sanityClient } from '@/sanity/config';

/**
 * API endpoint для синхронизации продуктов из Sanity со Stripe
 *
 * Использование:
 * POST /api/sync-stripe
 * Body: { productId: "product-id" } - для синхронизации конкретного продукта
 * Body: { syncAll: true } - для синхронизации всех продуктов
 */

// CORS headers
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, syncAll } = body;

    if (!productId && !syncAll) {
      return NextResponse.json(
        { error: 'Either productId or syncAll must be provided' },
        { status: 400 }
      );
    }

    let products = [];

    if (syncAll) {
      // Получаем все продукты из Sanity
      products = await sanityClient.fetch(
        `*[_type == "product"]{ _id, name, description, price, images, stripeProductId, stripePriceId }`
      );
    } else {
      // Получаем конкретный продукт
      const product = await sanityClient.fetch(
        `*[_type == "product" && _id == $id][0]{ _id, name, description, price, images, stripeProductId, stripePriceId }`,
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
        // Подготавливаем данные для Stripe
        const productData = {
          id: product._id,
          name: product.name.en || product.name.bg || product.name.ru,
          price: product.price,
          description:
            product.description?.en ||
            product.description?.bg ||
            product.description?.ru,
          images: product.images?.map((img: any) => {
            // Преобразуем Sanity image в URL
            const sanityImgUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${img.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`;
            return sanityImgUrl;
          }),
          stripeProductId: product.stripeProductId,
          stripePriceId: product.stripePriceId,
        };

        // Синхронизируем с Stripe
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
          productName: productData.name,
          success: true,
          stripeProductId: stripeData.stripeProductId,
          stripePriceId: stripeData.stripePriceId,
        });
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
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync products' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}
