'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  HelpCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { formatVND } from '@/lib/format';

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      {/* Top Hotline & Trust Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-survey-400 font-medium">
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>Hotline Đo Đạc Thực Địa 24/7:</span>
              <a href="tel:0988355688" className="text-white hover:text-survey-400 font-bold tracking-wide">
                0988.355.688
              </a>
            </div>
            <span className="hidden md:inline text-slate-600">|</span>
            <div className="hidden md:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chứng nhận kiểm định Quatest 1 / Vilas 110</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden sm:inline">Hỗ trợ đo thử máy tại công trình 63 tỉnh thành</span>
            <span className="text-slate-600">|</span>
            <Link href="/products?quote=true" className="text-survey-400 hover:text-survey-300 font-semibold flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Báo Giá Doanh Nghiệp (VAT)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
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
              Thiết Bị Trắc Địa & Địa Chính Chính Hãng
            </p>
          </div>
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

          {/* Fast Quote Button */}
          <Link
            href="/quote"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-survey-600 hover:bg-survey-700 text-white rounded-lg shadow-sm transition-all shadow-survey-600/20"
          >
            <span>Nhận Báo Giá Dự Án</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Categories & Main Menu Bar */}
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

            <Link
              href="/products?category=may-dinh-vi-gnss-rtk"
              className="px-3 py-2.5 hover:text-survey-400 flex items-center gap-1.5 transition-colors"
            >
              <Satellite className="w-3.5 h-3.5 text-survey-400" />
              <span>Máy Định Vị GNSS RTK</span>
            </Link>

            <Link
              href="/products?category=may-toan-dac-dien-tu"
              className="px-3 py-2.5 hover:text-survey-400 flex items-center gap-1.5 transition-colors"
            >
              <Crosshair className="w-3.5 h-3.5 text-laser" />
              <span>Máy Toàn Đạc Điện Tử</span>
            </Link>

            <Link
              href="/products?category=may-thuy-binh-tu-dong"
              className="px-3 py-2.5 hover:text-survey-400 flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Máy Thủy Bình Tự Động</span>
            </Link>

            <Link
              href="/products?category=phu-kien-trac-dia"
              className="px-3 py-2.5 hover:text-survey-400 flex items-center gap-1.5 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Phụ Kiện (Gương, Sào, Pin)</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/#advisor-section"
              className="px-3 py-2.5 text-survey-400 hover:text-white flex items-center gap-1.5 transition-colors bg-slate-800/60 rounded"
            >
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Tư Vấn Chọn Máy Đo (AI Wizard)</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
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
              className="block px-3 py-2 rounded hover:bg-slate-800 text-survey-400"
            >
              Tất Cả Thiết Bị
            </Link>
            <Link
              href="/products?category=may-dinh-vi-gnss-rtk"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-slate-800"
            >
              Máy Định Vị GNSS RTK
            </Link>
            <Link
              href="/products?category=may-toan-dac-dien-tu"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-slate-800"
            >
              Máy Toàn Đạc Điện Tử
            </Link>
            <Link
              href="/products?category=may-thuy-binh-tu-dong"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-slate-800"
            >
              Máy Thủy Bình Tự Động
            </Link>
            <Link
              href="/products?category=phu-kien-trac-dia"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-slate-800"
            >
              Phụ Kiện Trắc Địa
            </Link>
            <Link
              href="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-slate-800 text-amber-400"
            >
              Báo Giá Dự Án Doanh Nghiệp (VAT)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
