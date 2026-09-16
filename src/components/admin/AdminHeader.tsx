'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { logoutAdminAction } from '@/app/actions/admin/auth';
import {
  Search,
  Bell,
  LogOut,
  User,
  Shield,
  ChevronRight,
  ExternalLink,
  Menu,
  Settings,
} from 'lucide-react';
import CommandPalette from './CommandPalette';

interface Props {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function AdminHeader({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdminAction();
    router.push('/admin/login');
    router.refresh();
  };

  // Generate breadcrumb titles
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    const crumbs = [{ name: 'Admin', href: '/admin/dashboard' }];

    if (parts.includes('products')) {
      crumbs.push({ name: 'Sản phẩm', href: '/admin/products' });
      if (parts.includes('new')) crumbs.push({ name: 'Thêm mới', href: '/admin/products/new' });
      else if (parts.includes('edit')) crumbs.push({ name: 'Chỉnh sửa', href: '#' });
    } else if (parts.includes('quotes')) {
      crumbs.push({ name: 'Báo giá B2B', href: '/admin/quotes' });
    } else if (parts.includes('orders')) {
      crumbs.push({ name: 'Đơn hàng', href: '/admin/orders' });
    } else if (parts.includes('media')) {
      crumbs.push({ name: 'Thư viện Media', href: '/admin/media' });
    } else if (parts.includes('content')) {
      crumbs.push({ name: 'Nội dung & SEO', href: '/admin/content' });
    } else if (parts.includes('settings')) {
      crumbs.push({ name: 'Cài Đặt Website', href: '/admin/settings' });
    } else if (parts.includes('dashboard')) {
      crumbs.push({ name: 'Dashboard', href: '/admin/dashboard' });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-bold text-white">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="text-slate-400 hover:text-slate-200">
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Center: Command Palette Trigger */}
        <button
          onClick={() => setIsCommandOpen(true)}
          className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 text-xs transition-all w-64 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Tìm kiếm nhanh...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-slate-400 border border-slate-700">
            Ctrl+K
          </kbd>
        </button>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/quotes"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg relative"
            title="Yêu cầu báo giá mới"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-survey-500 absolute top-1.5 right-1.5 animate-pulse" />
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 text-left transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-survey-600/20 border border-survey-500/40 text-survey-400 flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <div className="hidden sm:block text-xs">
                <div className="font-bold text-slate-200 leading-tight">
                  {user?.name || 'Kỹ sư Admin'}
                </div>
                <div className="text-[10px] text-survey-400 font-semibold uppercase tracking-wider">
                  {user?.role || 'ADMIN'}
                </div>
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 text-xs text-slate-300 z-50 animate-fade-in">
                <div className="p-2 border-b border-slate-800">
                  <p className="font-bold text-white truncate">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@geopro.vn'}</p>
                </div>
                <Link
                  href="/admin/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Settings className="w-3.5 h-3.5 text-survey-400" />
                  <span>Cài Đặt Website</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-survey-400" />
                  <span>Xem Storefront</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
