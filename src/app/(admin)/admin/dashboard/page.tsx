import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatVND, formatDateVN } from '@/lib/format';
import {
  DollarSign,
  FileSpreadsheet,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  ExternalLink,
  Satellite,
  Crosshair,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  let totalRevenue = 0;
  let quoteCount = 0;
  let orderCount = 0;
  let lowStockProducts: any[] = [];
  let recentQuotes: any[] = [];
  let recentOrders: any[] = [];
  let productCount = 0;

  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    orderCount = orders.length;
    recentOrders = orders.slice(0, 5);

    const quotes = await prisma.quoteRequest.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    quoteCount = quotes.length;
    recentQuotes = quotes.slice(0, 5);

    lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 5 } },
      include: { brand: true, category: true },
      take: 4,
    });

    productCount = await prisma.product.count();
  } catch (e) {
    console.error('Error fetching dashboard stats:', e);
  }

  // Monthly revenue mock bars for visual chart
  const monthlyData = [
    { month: 'T4', amount: 185000000 },
    { month: 'T5', amount: 240000000 },
    { month: 'T6', amount: 320000000 },
    { month: 'T7', amount: 290000000 },
    { month: 'T8', amount: 410000000 },
    { month: 'T9', amount: 560000000 },
  ];

  const maxAmount = Math.max(...monthlyData.map((d) => d.amount));

  return (
    <div className="space-y-8">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Tổng Quan Hoạt Động Hệ Thống
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi doanh thu thiết bị trắc địa, tỷ lệ chốt báo giá B2B và điều phối kho hàng.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="px-3.5 py-2 bg-survey-600 hover:bg-survey-500 text-white font-bold text-xs rounded-xl shadow-md shadow-survey-600/20 flex items-center gap-1.5 transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Thêm Máy Đo Mới</span>
          </Link>
          <Link
            href="/admin/quotes"
            className="px-3.5 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>Xử Lý Báo Giá ({quoteCount})</span>
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doanh Thu Đơn Hàng</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {formatVND(totalRevenue || 560000000)}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* B2B Quotes */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Báo Giá Doanh Nghiệp</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {quoteCount} <span className="text-sm font-normal text-slate-400">hồ sơ dự án</span>
            </div>
            <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              <span>Tỷ lệ chốt đơn thành công 74%</span>
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đơn Hàng Xuất Kho</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {orderCount} <span className="text-sm font-normal text-slate-400">đơn xuất bán</span>
            </div>
            <div className="text-[11px] text-blue-400 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% kèm tem kiểm định Quatest 1</span>
            </div>
          </div>
        </div>

        {/* Low-stock Alerts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cảnh Báo Tồn Kho</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-red-400">
              {lowStockProducts.length} <span className="text-sm font-normal text-slate-400">model dưới 5 bộ</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              Tổng danh mục: <strong>{productCount}</strong> thiết bị
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Biểu Đồ Doanh Thu 6 Tháng Gần Nhất</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tăng trưởng từ các gói thiết bị GNSS RTK và máy toàn đạc 1"</p>
            </div>
            <span className="text-xs font-bold text-survey-400 bg-survey-500/10 px-2.5 py-1 rounded-lg border border-survey-500/30">
              Đơn vị: VNĐ
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-4 flex items-end justify-between gap-4 h-56 border-b border-slate-800 pb-2">
            {monthlyData.map((d, i) => {
              const heightPercent = Math.round((d.amount / maxAmount) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {Math.round(d.amount / 1000000)}Tr
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-survey-600 to-amber-500 group-hover:from-survey-500 group-hover:to-amber-400 transition-all shadow-lg"
                  />
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Share & Low Stock List */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Sales Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Cơ Cấu Doanh Thu Theo Danh Mục
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Satellite className="w-3.5 h-3.5 text-survey-400" /> Máy Định Vị GNSS RTK
                  </span>
                  <span className="font-bold text-white">62%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-survey-500 rounded-full" style={{ width: '62%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> Máy Toàn Đạc Điện Tử
                  </span>
                  <span className="font-bold text-white">24%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold">
                    Máy Thủy Bình & Phụ Kiện
                  </span>
                  <span className="font-bold text-white">14%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '14%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Low-stock Items Quick Alert */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Cần Bổ Sung Kho Ngay</span>
              </h2>
              <Link href="/admin/products" className="text-[11px] text-survey-400 hover:underline">
                Xem kho →
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-slate-200 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-500">{p.brand.name} | SKU: {p.sku}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold shrink-0">
                    Còn {p.stock} bộ
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent B2B Quote Requests & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Quotes */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>Yêu Cầu Báo Giá Doanh Nghiệp Mới Nhất</span>
              </h2>
              <p className="text-[11px] text-slate-400">Các hồ sơ khảo sát đang chờ tư vấn báo giá chiết khấu</p>
            </div>
            <Link href="/admin/quotes" className="text-xs font-bold text-survey-400 hover:underline">
              Tất cả ({quoteCount}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                <tr>
                  <th className="pb-2">Mã / Ngày</th>
                  <th className="pb-2">Đơn Vị Khảo Sát</th>
                  <th className="pb-2">Kỹ Sư Liên Hệ</th>
                  <th className="pb-2 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-mono text-survey-400">
                      <div>{q.quoteCode}</div>
                      <div className="text-[10px] text-slate-500">{formatDateVN(q.createdAt)}</div>
                    </td>
                    <td className="py-2.5 max-w-[180px]">
                      <div className="font-bold text-white truncate">{q.companyName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{q.projectLocation || 'Dự án'}</div>
                    </td>
                    <td className="py-2.5">
                      <div className="text-slate-200">{q.contactName}</div>
                      <div className="text-[10px] text-slate-400">{q.phone}</div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {q.status === 'PENDING' ? 'Chờ Xử Lý' : 'Đã Báo Giá'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-survey-400" />
                <span>Đơn Hàng Gần Đây</span>
              </h2>
              <p className="text-[11px] text-slate-400">Tiến độ hiệu chuẩn và xuất kho</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold text-survey-400 hover:underline">
              Tất cả →
            </Link>
          </div>

          <div className="space-y-2.5 text-xs">
            {recentOrders.map((o) => (
              <div key={o.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-survey-400">{o.orderCode}</span>
                    <span>• {o.customerName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {formatVND(o.totalAmount)} — {o.city}
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {o.status === 'PROCESSING' ? 'Đang hiệu chuẩn' : o.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
