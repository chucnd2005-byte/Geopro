import React from 'react';
import prisma from '@/lib/prisma';
import QuotesClient from './QuotesClient';

export default async function AdminQuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    include: {
      items: {
        include: {
          product: {
            include: { brand: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Quản Lý Báo Giá Dự Án Doanh Nghiệp (B2B)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Theo dõi tiến độ báo giá, chiết khấu dự án và xuất bản in báo giá chính thức cho khách hàng.
        </p>
      </div>

      <QuotesClient initialQuotes={quotes} />
    </div>
  );
}
