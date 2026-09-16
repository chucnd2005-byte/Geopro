import type { Metadata } from 'next';
import './globals.css';
import StorefrontShell from '@/components/layout/StorefrontShell';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { getSiteSettings } from '@/lib/settings';
import { SiteSettingsProvider } from '@/lib/SettingsContext';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: `${settings.siteName} | ${settings.slogan}`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.metaDescription,
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
    authors: [{ name: `${settings.siteName} Engineering Team` }],
    metadataBase: new URL('https://geosurvey.vn'),
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      url: 'https://geosurvey.vn',
      siteName: settings.siteName,
      title: `${settings.siteName} | ${settings.slogan}`,
      description: settings.metaDescription,
    },
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <OrganizationJsonLd />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-survey-600 selection:text-white">
        <SiteSettingsProvider settings={settings}>
          <StorefrontShell settings={settings}>{children}</StorefrontShell>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}

