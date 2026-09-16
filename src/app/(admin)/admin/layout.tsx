import React from 'react';
import { getCurrentAdminSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'GeoSurvey Pro — Hệ Thống Quản Trị Trung Tâm',
  robots: 'noindex, nofollow',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentAdminSession();

  // Get dynamic badge counts
  let pendingQuotes = 0;
  let activeOrders = 0;
  try {
    pendingQuotes = await prisma.quoteRequest.count({ where: { status: 'PENDING' } });
    activeOrders = await prisma.order.count({ where: { status: { in: ['PENDING', 'PROCESSING', 'CALIBRATING'] } } });
  } catch (e) {
    // fallback
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar quoteCount={pendingQuotes} orderCount={activeOrders} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader user={session} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-950/60">
          {children}
        </main>
      </div>
    </div>
  );
}
