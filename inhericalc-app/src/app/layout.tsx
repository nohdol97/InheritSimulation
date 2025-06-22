import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://taxsimp.com'),
  title: "상속세 계산기 2025년",
  description: "2025년 기준 상속세를 실시간으로 계산해보세요. 부동산, 금융자산, 기타자산을 포함한 정확한 상속세 계산기입니다. 무료로 사용 가능합니다.",
  keywords: "상속세, 상속세 계산기, 2025년 상속세, 상속세율, 상속세 공제, TaxSimp",
  authors: [{ name: "TaxSimp Team" }],
  creator: "TaxSimp",
  publisher: "TaxSimp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "상속세 계산기 2025년",
    description: "2025년 기준 상속세를 실시간으로 계산해보세요. 정확한 상속세 계산기입니다.",
    url: 'https://taxsimp.com',
    siteName: 'TaxSimp',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TaxSimp 상속세 계산기',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "상속세 계산기 2025년",
    description: "2025년 기준 상속세를 실시간으로 계산해보세요.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Google Search Console에서 받은 코드
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
