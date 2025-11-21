// Environment variables validation and access

type EnvConfig = {
  // Sanity
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN?: string;

  // Stripe
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;

  // Telegram (optional - notifications won't break if missing)
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;

  // Econt
  ECONT_API_URL: string;
  ECONT_USERNAME: string;
  ECONT_PASSWORD: string;

  // App
  BASE_URL: string;
  SITE_URL: string;
};

// Required environment variables for the app to function
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_BASE_URL',
] as const;

// Validate environment variables on module load (server-side only)
function validateEnv(): void {
  // Skip validation during build time or on client side
  if (typeof window !== 'undefined') return;

  const missing: string[] = [];

  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
    // In production, throw an error; in development, just warn
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }
  }
}

// Run validation
validateEnv();

// Safe access to environment variables with defaults
export const env: EnvConfig = {
  SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',

  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,

  ECONT_API_URL: process.env.ECONT_API_URL || 'https://demo.econt.com/ee/services',
  ECONT_USERNAME: process.env.ECONT_USERNAME || '',
  ECONT_PASSWORD: process.env.ECONT_PASSWORD || '',

  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
};

// Helper to check if Stripe is properly configured
export function isStripeConfigured(): boolean {
  return !!(env.STRIPE_SECRET_KEY && env.STRIPE_PUBLISHABLE_KEY && env.STRIPE_WEBHOOK_SECRET);
}

// Helper to check if Telegram notifications are configured
export function isTelegramConfigured(): boolean {
  return !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
}

// Helper to check if Econt is configured
export function isEcontConfigured(): boolean {
  return !!(env.ECONT_API_URL && env.ECONT_USERNAME && env.ECONT_PASSWORD);
}
