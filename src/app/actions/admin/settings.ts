'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSiteSettings, SiteSettingsData, DEFAULT_SITE_SETTINGS } from '@/lib/settings';

export async function getSiteSettingsAction(): Promise<{ success: boolean; settings: SiteSettingsData }> {
  try {
    const settings = await getSiteSettings();
    return { success: true, settings };
  } catch (error: any) {
    console.error('Error in getSiteSettingsAction:', error);
    return { success: false, settings: DEFAULT_SITE_SETTINGS };
  }
}

export async function updateSiteSettingsAction(data: Partial<SiteSettingsData>) {
  try {
    const headerMenuJson = data.headerMenu ? JSON.stringify(data.headerMenu) : undefined;
    const showroomsJson = data.showrooms ? JSON.stringify(data.showrooms) : undefined;
    const footerColumnsJson = data.footerColumns ? JSON.stringify(data.footerColumns) : undefined;
    const trustBadgesJson = data.trustBadges ? JSON.stringify(data.trustBadges) : undefined;

    const upserted = await prisma.siteSettings.upsert({
      where: { id: 'default_settings' },
      create: {
        id: 'default_settings',
        siteName: data.siteName ?? DEFAULT_SITE_SETTINGS.siteName,
        slogan: data.slogan ?? DEFAULT_SITE_SETTINGS.slogan,
        metaDescription: data.metaDescription ?? DEFAULT_SITE_SETTINGS.metaDescription,
        lightLogoUrl: data.lightLogoUrl ?? null,
        darkLogoUrl: data.darkLogoUrl ?? null,
        faviconUrl: data.faviconUrl ?? null,

        announcementActive: data.announcementActive ?? DEFAULT_SITE_SETTINGS.announcementActive,
        announcementMessage: data.announcementMessage ?? DEFAULT_SITE_SETTINGS.announcementMessage,
        announcementButtonText: data.announcementButtonText ?? DEFAULT_SITE_SETTINGS.announcementButtonText,
        announcementButtonUrl: data.announcementButtonUrl ?? DEFAULT_SITE_SETTINGS.announcementButtonUrl,

        headerMenuJson: headerMenuJson ?? JSON.stringify(DEFAULT_SITE_SETTINGS.headerMenu),
        hotlineLabel: data.hotlineLabel ?? DEFAULT_SITE_SETTINGS.hotlineLabel,
        hotlineNumber: data.hotlineNumber ?? DEFAULT_SITE_SETTINGS.hotlineNumber,
        quoteButtonText: data.quoteButtonText ?? DEFAULT_SITE_SETTINGS.quoteButtonText,
        quoteButtonUrl: data.quoteButtonUrl ?? DEFAULT_SITE_SETTINGS.quoteButtonUrl,

        legalBusinessName: data.legalBusinessName ?? DEFAULT_SITE_SETTINGS.legalBusinessName,
        taxCode: data.taxCode ?? DEFAULT_SITE_SETTINGS.taxCode,
        businessLicense: data.businessLicense ?? DEFAULT_SITE_SETTINGS.businessLicense,
        primaryEmail: data.primaryEmail ?? DEFAULT_SITE_SETTINGS.primaryEmail,
        salesHotline: data.salesHotline ?? DEFAULT_SITE_SETTINGS.salesHotline,
        technicalSupportHotline: data.technicalSupportHotline ?? DEFAULT_SITE_SETTINGS.technicalSupportHotline,
        zaloNumber: data.zaloNumber ?? DEFAULT_SITE_SETTINGS.zaloNumber,

        showroomsJson: showroomsJson ?? JSON.stringify(DEFAULT_SITE_SETTINGS.showrooms),

        aboutText: data.aboutText ?? DEFAULT_SITE_SETTINGS.aboutText,
        footerColumnsJson: footerColumnsJson ?? JSON.stringify(DEFAULT_SITE_SETTINGS.footerColumns),
        trustBadgesJson: trustBadgesJson ?? JSON.stringify(DEFAULT_SITE_SETTINGS.trustBadges),
        socialFacebook: data.socialFacebook ?? DEFAULT_SITE_SETTINGS.socialFacebook,
        socialZalo: data.socialZalo ?? DEFAULT_SITE_SETTINGS.socialZalo,
        socialYoutube: data.socialYoutube ?? DEFAULT_SITE_SETTINGS.socialYoutube,
        socialLinkedin: data.socialLinkedin ?? DEFAULT_SITE_SETTINGS.socialLinkedin,
        copyrightText: data.copyrightText ?? DEFAULT_SITE_SETTINGS.copyrightText,
      },
      update: {
        siteName: data.siteName,
        slogan: data.slogan,
        metaDescription: data.metaDescription,
        lightLogoUrl: data.lightLogoUrl,
        darkLogoUrl: data.darkLogoUrl,
        faviconUrl: data.faviconUrl,

        announcementActive: data.announcementActive,
        announcementMessage: data.announcementMessage,
        announcementButtonText: data.announcementButtonText,
        announcementButtonUrl: data.announcementButtonUrl,

        headerMenuJson: headerMenuJson,
        hotlineLabel: data.hotlineLabel,
        hotlineNumber: data.hotlineNumber,
        quoteButtonText: data.quoteButtonText,
        quoteButtonUrl: data.quoteButtonUrl,

        legalBusinessName: data.legalBusinessName,
        taxCode: data.taxCode,
        businessLicense: data.businessLicense,
        primaryEmail: data.primaryEmail,
        salesHotline: data.salesHotline,
        technicalSupportHotline: data.technicalSupportHotline,
        zaloNumber: data.zaloNumber,

        showroomsJson: showroomsJson,

        aboutText: data.aboutText,
        footerColumnsJson: footerColumnsJson,
        trustBadgesJson: trustBadgesJson,
        socialFacebook: data.socialFacebook,
        socialZalo: data.socialZalo,
        socialYoutube: data.socialYoutube,
        socialLinkedin: data.socialLinkedin,
        copyrightText: data.copyrightText,
      },
    });

    // Instant On-demand Revalidation across all public pages & layouts
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/quote');
    revalidatePath('/admin/settings');

    const freshSettings = await getSiteSettings();
    return { success: true, settings: freshSettings };
  } catch (error: any) {
    console.error('Error updating site settings:', error);
    return { success: false, error: error.message || 'Không thể lưu cài đặt hệ thống.' };
  }
}
