'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CompareDrawer from '@/components/compare/CompareDrawer';
import CompareModal from '@/components/compare/CompareModal';
import B2BQuoteModal from '@/components/quote/B2BQuoteModal';
import CartDrawer from '@/components/cart/CartDrawer';
import Toast from '@/components/notifications/Toast';

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Storefront Floating Trays & Modals */}
      <CompareDrawer />
      <CompareModal />
      <B2BQuoteModal />
      <CartDrawer />
      <Toast />
    </>
  );
}
