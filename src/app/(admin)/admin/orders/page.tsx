import React from 'react';
import prisma from '@/lib/prisma';
import OrdersClient from './OrdersClient';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Quản Lý Đơn Hàng & Tiến Độ Hiệu Chuẩn Quatest
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Điều phối đóng gói, dán tem kiểm định hiệu chuẩn đo lường và bàn giao công trình.
        </p>
      </div>

      <OrdersClient initialOrders={orders} />
    </div>
  );
}
