import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: '../public/fonts/inter-variable.woff2',
  variable: '--font-inter',
  display: 'swap'
});

const urbanist = localFont({
  src: '../public/fonts/urbanist-variable.ttf',
  variable: '--font-urbanist',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Wealthup Dashboard',
  description: 'Wealthup Figma replica in Next.js and Tailwind CSS',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${urbanist.variable}`}>{children}</body>
    </html>
  );
}
