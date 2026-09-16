'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  PhoneCall,
  ShieldCheck,
  Scale,
  ShoppingCart,
  FileSpreadsheet,
  Compass,
  Menu,
  X,
  Satellite,
  Crosshair,
  Layers,
  Wrench,
  ChevronDown,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { useSiteSettings } from '@/lib/SettingsContext';
import { SiteSettingsData } from '@/lib/settings';

interface HeaderProps {
  settings?: SiteSettingsData;
}

export default function Header({ settings: propSettings }: HeaderProps) {
  const router = useRouter();
  const contextSettings = useSiteSettings();
  const settings = propSettings || contextSettings;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    cart,
    setCartDrawerOpen,
    compareList,
    setCompareModalOpen,
    quoteItems,
    setQuoteModalOpen,
  } = useAppStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* 1. Top Dynamic Announcement Bar */}
      {settings.announcementActive && settings.announcementMessage && (
        <aside aria-label="Thông báo quan trọng" className="bg-gradient-to-r from-survey-600 to-amber-600 text-white text-xs py-1.5 px-4 shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <p className="font-semibold tracking-wide truncate">
                {settings.announcementMessage}
              </p>
            </div>
            {settings.announcementButtonText && (
              <Link
                href={settings.announcementButtonUrl || '/quote'}
                className="shrink-0 text-[11px] font-bold bg-slate-900/40 hover:bg-slate-900/60 text-white px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1"
              >
                <span>{settings.announcementButtonText}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </aside>
      )}

      {/* 2. Hotline & Quick Trust Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-survey-400 font-medium">
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>{settings.hotlineLabel}:</span>
              <a
                href={`tel:${settings.hotlineNumber.replace(/[^0-9]/g, '')}`}
                className="text-white hover:text-survey-400 font-bold tracking-wide"
              >
                {settings.hotlineNumber}
              </a>
            </div>
            <span className="hidden md:inline text-slate-600">|</span>
            <div className="hidden md:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trung tâm kiểm định Vilas 110 & Quatest 1</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden sm:inline">Hỗ trợ đo thử máy tại công trình 63 tỉnh thành</span>
            <span className="text-slate-600">|</span>
            <Link
              href={settings.quoteButtonUrl || '/quote'}
              className="text-survey-400 hover:text-survey-300 font-semibold flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{settings.quoteButtonText}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Main Brand Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Dynamic Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          {settings.lightLogoUrl ? (
            <div className="relative w-40 h-10">
              <Image
                src={settings.lightLogoUrl}
                alt={settings.siteName}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-lg bg-survey-600 flex items-center justify-center text-white shadow-md shadow-survey-600/30 group-hover:bg-survey-500 transition-colors">
                <Crosshair className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-wider text-slate-900">
                    GEO<span className="text-survey-600">SURVEY</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-slate-900 text-white px-1.5 py-0.5 rounded tracking-widest">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                  {settings.slogan}
                </p>
              </div>
            </>
          )}
        </Link>

        {/* Technical Search Form */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo model, thông số (vd: 1408 kênh, IMU 60°, TS07, B40A, Leica...)"
              className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-survey-500 focus:border-transparent transition-all placeholder:text-slate-400 text-slate-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-survey-600 text-white rounded transition-colors"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Compare Button */}
          <button
            onClick={() => setCompareModalOpen(true)}
            className="relative p-2 text-slate-700 hover:text-survey-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
            title="So sánh thông số kỹ thuật"
          >
            <Scale className="w-5 h-5" />
            <span className="hidden xl:inline text-xs font-medium">So sánh</span>
            {compareList.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-survey-600 text-white text-[10px] font-bold flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </button>

          {/* B2B Quote Basket */}
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="relative p-2 text-slate-700 hover:text-survey-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
            title="Bảng dự toán báo giá B2B"
          >
            <FileSpreadsheet className="w-5 h-5 text-amber-600" />
            <span className="hidden xl:inline text-xs font-medium">Báo giá ({quoteItems.length})</span>
            {quoteItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                {quoteItems.length}
              </span>
            )}
          </button>

          {/* Shopping Cart */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative p-2 text-slate-700 hover:text-survey-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
            title="Giỏ hàng phụ kiện & máy đo"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden xl:inline text-xs font-medium">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Dynamic Fast Quote CTA Button */}
          <Link
            href={settings.quoteButtonUrl || '/quote'}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-survey-600 hover:bg-survey-700 text-white rounded-lg shadow-sm transition-all shadow-survey-600/20"
          >
            <span>{settings.quoteButtonText}</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg"
            aria-label="Mở danh mục điều hướng"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 4. Dynamic Menu Bar */}
      <nav className="hidden lg:block bg-slate-900 border-t border-slate-800 text-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-1">
            <Link
              href="/products"
              className="px-3.5 py-2.5 text-white bg-survey-600 hover:bg-survey-500 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Menu className="w-4 h-4" />
              <span>TẤT CẢ DANH MỤC THIẾT BỊ</span>
            </Link>

            {/* Dynamic Navigation Links from Settings */}
            {settings.headerMenu.map((item) => {
              const hasDropdown = item.isDropdown && item.subItems && item.subItems.length > 0;

              if (hasDropdown) {
                return (
                  <div
                    key={item.id}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.url}
                      className="px-3 py-2.5 hover:text-survey-400 flex items-center gap-1 transition-colors group-hover:text-survey-400"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                    </Link>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 w-64 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50 animate-fade-in">
                      {item.subItems!.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          href={sub.url}
                          className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-850 text-xs font-medium transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className="px-3 py-2.5 hover:text-survey-400 flex items-center gap-1.5 transition-colors"
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center justify-end space-x-2">
            <Link
              href="/#advisor-section"
              className="px-3 py-2.5 text-survey-400 hover:text-white flex items-center gap-1.5 transition-colors bg-slate-800/60 rounded"
            >
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Tư Vấn Chọn Máy Đo (AI Wizard)</span>
            </Link>
            <Link
              href="/admin"
              className="px-3 py-2.5 text-slate-200 hover:text-white hover:bg-survey-600 rounded transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* 5. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white p-4 border-t border-slate-800 space-y-3">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm model máy trắc địa..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </form>

          <div className="space-y-1 text-sm font-medium">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-slate-800 text-survey-400 font-bold"
            >
              Tất Cả Thiết Bị
            </Link>

            {settings.headerMenu.map((item) => (
              <div key={item.id} className="space-y-1">
                <Link
                  href={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-slate-800"
                >
                  {item.label}
                </Link>
                {item.subItems && (
                  <div className="pl-4 space-y-1 border-l border-slate-800 ml-3">
                    {item.subItems.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        href={sub.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-2 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href={settings.quoteButtonUrl || '/quote'}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-slate-800 text-amber-400 font-bold"
            >
              {settings.quoteButtonText}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
