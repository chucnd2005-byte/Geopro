import React from 'react';
import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';
import SiteSettingsClient from '@/components/admin/SiteSettingsClient';

export const metadata: Metadata = {
  title: 'Cài Đặt Website & CMS | GeoSurvey Pro Admin',
  description: 'Quản trị thông tin doanh nghiệp, header menu, footer và hệ thống showroom.',
};

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return <SiteSettingsClient initialSettings={settings} />;
}
