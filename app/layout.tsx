import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RoDaSoleil - Luxury Swimwear',
  description: 'Premium swimwear collection',
};

// Root layout - minimal structure as locale layout handles full HTML
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
