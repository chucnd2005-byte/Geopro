'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Crosshair,
  LayoutDashboard,
  Package,
  PlusCircle,
  FileSpreadsheet,
  ShoppingCart,
  Image,
  FileText,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Settings,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface Props {
  quoteCount?: number;
  orderCount?: number;
}

export default function AdminSidebar({ quoteCount = 2, orderCount = 1 }: Props) {
  const pathname = usePathname();

  const navGroups: NavGroup[] = [
    {
      label: 'TỔNG QUAN',
      items: [
        { name: 'Dashboard Thống Kê', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'THIẾT BỊ & KHO HÀNG',
      items: [
        { name: 'Danh Sách Thiết Bị', href: '/admin/products', icon: Package },
        { name: 'Thêm Thiết Bị Mới', href: '/admin/products/new', icon: PlusCircle },
      ],
    },
    {
      label: 'KINH DOANH & DỰ ÁN',
      items: [
        { name: 'Báo Giá Dự Án (B2B)', href: '/admin/quotes', icon: FileSpreadsheet, badge: quoteCount },
        { name: 'Đơn Hàng & Xuất Kho', href: '/admin/orders', icon: ShoppingCart, badge: orderCount },
      ],
    },
    {
      label: 'NỘI DUNG & CMS',
      items: [
        { name: 'Cài Đặt Website', href: '/admin/settings', icon: Settings },
        { name: 'Thư Viện Media & PDF', href: '/admin/media', icon: Image },
        { name: 'Banner & Bài Viết SEO', href: '/admin/content', icon: FileText },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-survey-600 flex items-center justify-center text-white shadow-md shadow-survey-600/30">
            <Crosshair className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="text-sm font-black text-white tracking-wider flex items-center gap-1.5">
              <span>GEOSURVEY</span>
              <span className="text-[9px] bg-survey-600 text-white px-1 py-0.5 rounded font-bold">
                CMS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Trung Tâm Quản Trị</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 text-xs">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              {group.label}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all group ${
                    isActive
                      ? 'bg-survey-600 text-white font-bold shadow-md shadow-survey-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-survey-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white text-survey-600'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Storefront Link */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-survey-500" />
            <span>Xem Storefront</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        </Link>
      </div>
    </aside>
  );
}
