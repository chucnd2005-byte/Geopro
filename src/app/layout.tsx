import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CompareDrawer from '@/components/compare/CompareDrawer';
import CompareModal from '@/components/compare/CompareModal';
import B2BQuoteModal from '@/components/quote/B2BQuoteModal';
import CartDrawer from '@/components/cart/CartDrawer';
import Toast from '@/components/notifications/Toast';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: {
    default: 'GeoSurvey Pro | Thiết Bị Đo Đạc & Trắc Địa Chính Hãng Toàn Quốc',
    template: '%s | GeoSurvey Pro',
  },
  description:
    'Hệ thống phân phối máy định vị GNSS RTK 1408 kênh, máy toàn đạc 1", máy thủy bình tự động chính hãng Leica, Trimble, Topcon, CHCNAV. Kiểm định Quatest 1, hỗ trợ đo thử tại thực địa.',
  keywords: [
    'máy định vị rtk',
    'máy gnss rtk',
    'máy toàn đạc điện tử',
    'máy thủy bình',
    'chcnav i73',
    'leica gs18t',
    'sokkia b40a',
    'phụ kiện trắc địa',
    'kiểm định máy đo đạc',
  ],
  authors: [{ name: 'GeoSurvey Pro Engineering Team' }],
  metadataBase: new URL('https://geosurvey.vn'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://geosurvey.vn',
    siteName: 'GeoSurvey Pro',
    title: 'GeoSurvey Pro | Thiết Bị Đo Đạc & Trắc Địa Chính Hãng Toàn Quốc',
    description:
      'Chuyên máy định vị RTK GNSS 1408 kênh bù nghiêng IMU, máy toàn đạc điện tử, máy thủy bình. Hỗ trợ đo thử thực địa và báo giá dự án VAT.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <OrganizationJsonLd />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-survey-600 selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Global Floating Modals & Drawers */}
        <CompareDrawer />
        <CompareModal />
        <B2BQuoteModal />
        <CartDrawer />
        <Toast />
      </body>
    </html>
  );
}
