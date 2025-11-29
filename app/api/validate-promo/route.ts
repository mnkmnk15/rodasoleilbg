import { NextRequest, NextResponse } from 'next/server';
import { sanityClient, sanityClientWithToken } from '@/sanity/config';

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal, deliveryPrice } = await req.json();

    // Валидация входных данных
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'PROMO_INVALID_CODE' },
        { status: 400 }
      );
    }

    if (typeof cartTotal !== 'number' || cartTotal < 0) {
      return NextResponse.json(
        { valid: false, error: 'PROMO_INVALID_CART' },
        { status: 400 }
      );
    }

    // Поиск промокода в Sanity (case-insensitive)
    const promoCode = await sanityClient.fetch(
      `*[_type == "promoCode" && code == $code][0]`,
      { code: code.toUpperCase().trim() }
    );

    // Проверка существования и активности
    if (!promoCode) {
      return NextResponse.json({ valid: false, error: 'PROMO_NOT_FOUND' });
    }

    if (!promoCode.active) {
      return NextResponse.json({ valid: false, error: 'PROMO_INACTIVE' });
    }

    // Проверка срока действия
    const now = new Date();
    if (promoCode.validFrom && new Date(promoCode.validFrom) > now) {
      return NextResponse.json({ valid: false, error: 'PROMO_NOT_YET_VALID' });
    }
    if (promoCode.validUntil && new Date(promoCode.validUntil) < now) {
      return NextResponse.json({ valid: false, error: 'PROMO_EXPIRED' });
    }

    // Проверка лимита использований
    if (
      promoCode.usageLimit !== null &&
      promoCode.usageLimit !== undefined &&
      promoCode.usageCount >= promoCode.usageLimit
    ) {
      return NextResponse.json({ valid: false, error: 'PROMO_LIMIT_REACHED' });
    }

    // Расчет скидки
    let appliedAmount = 0;
    let freeShipping = false;

    if (promoCode.discountType === 'percentage') {
      appliedAmount = (cartTotal * promoCode.discountValue) / 100;
      // Скидка не может превышать стоимость корзины
      appliedAmount = Math.min(appliedAmount, cartTotal);
    } else if (promoCode.discountType === 'fixed') {
      appliedAmount = Math.min(promoCode.discountValue, cartTotal);
    } else if (promoCode.discountType === 'free_shipping') {
      freeShipping = true;
      appliedAmount = deliveryPrice || 0;
    }

    // Округляем до 2 знаков
    appliedAmount = Math.round(appliedAmount * 100) / 100;

    return NextResponse.json({
      valid: true,
      discount: {
        type: promoCode.discountType,
        value: promoCode.discountValue,
        appliedAmount,
        freeShipping,
      },
    });
  } catch (error: any) {
    console.error('[Validate Promo] Error:', error);
    return NextResponse.json(
      { valid: false, error: 'PROMO_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

// Функция для увеличения счетчика использований (вызывается из checkout)
export async function incrementPromoCodeUsage(code: string): Promise<void> {
  try {
    const promoCode = await sanityClientWithToken.fetch(
      `*[_type == "promoCode" && code == $code][0]`,
      { code: code.toUpperCase().trim() }
    );

    if (promoCode && promoCode._id) {
      await sanityClientWithToken
        .patch(promoCode._id)
        .inc({ usageCount: 1 })
        .commit();
      console.log(`[Promo] Incremented usage count for: ${code}`);
    }
  } catch (error) {
    console.error('[Promo] Failed to increment usage count:', error);
  }
}
