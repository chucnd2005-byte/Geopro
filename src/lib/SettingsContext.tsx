'use client';

import React, { createContext, useContext } from 'react';
import { SiteSettingsData, DEFAULT_SITE_SETTINGS } from './settings';

const SiteSettingsContext = createContext<SiteSettingsData>(DEFAULT_SITE_SETTINGS);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettingsData;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings || DEFAULT_SITE_SETTINGS}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettingsData {
  const context = useContext(SiteSettingsContext);
  return context || DEFAULT_SITE_SETTINGS;
}
