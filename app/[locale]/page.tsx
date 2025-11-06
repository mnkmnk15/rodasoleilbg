import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BeigeBanner from '@/components/BeigeBanner';
import DualImageSection from '@/components/DualImageSection';
import ProductCatalog from '@/components/ProductCatalog';
import Features from '@/components/Features';
import ShippingReturns from '@/components/ShippingReturns';
import FAQ from '@/components/FAQ';
import InstagramSection from '@/components/InstagramSection';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <BeigeBanner />
      <DualImageSection />
      <ProductCatalog />
      <InstagramSection />
      <Features />
      <ShippingReturns />
      <FAQ />
      <Footer />
      <CookieConsent />
    </main>
  );
}
