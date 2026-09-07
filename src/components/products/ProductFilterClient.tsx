'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import {
  Filter,
  RotateCcw,
  Search,
  Grid,
  List,
  Check,
  ChevronDown,
} from 'lucide-react';

interface Props {
  initialProducts: Product[];
  categories: { id: string; name: string; slug: string }[];
  brands: { id: string; name: string; slug: string }[];
  initialCategory?: string;
  initialQuery?: string;
  initialQuoteOnly?: boolean;
}

export default function ProductFilterClient({
  initialProducts,
  categories,
  brands,
  initialCategory,
  initialQuery,
  initialQuoteOnly,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedChannels, setSelectedChannels] = useState<'all' | '800' | '1400'>('all');
  const [selectedAccuracy, setSelectedAccuracy] = useState<'all' | '1' | '2'>('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [quoteOnly, setQuoteOnly] = useState(initialQuoteOnly || false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category.slug !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && product.brand.slug !== selectedBrand) {
        return false;
      }

      // Condition filter
      if (selectedCondition !== 'all' && product.condition !== selectedCondition) {
        return false;
      }

      // Channels filter (for RTK)
      if (selectedChannels !== 'all') {
        const ch = product.specs.channels || 0;
        if (selectedChannels === '800' && ch < 800) return false;
        if (selectedChannels === '1400' && ch < 1400) return false;
      }

      // Angular accuracy filter (for Total Station)
      if (selectedAccuracy !== 'all') {
        const acc = product.specs.angularAccuracy || '';
        if (selectedAccuracy === '1' && !acc.includes('1"')) return false;
        if (selectedAccuracy === '2' && !acc.includes('2"')) return false;
      }

      // Quote only filter
      if (quoteOnly && !product.isQuoteOnly) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchSku = product.sku.toLowerCase().includes(q);
        const matchBrand = product.brand.name.toLowerCase().includes(q);
        const matchDesc = product.shortDesc.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchBrand && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice);
      }
      if (sortBy === 'price-desc') {
        return (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return b.isFeatured ? 1 : -1;
    });
  }, [
    initialProducts,
    selectedCategory,
    selectedBrand,
    selectedCondition,
    selectedChannels,
    selectedAccuracy,
    searchQuery,
    quoteOnly,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedCondition('all');
    setSelectedChannels('all');
    setSelectedAccuracy('all');
    setSearchQuery('');
    setQuoteOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar Filter for Desktop */}
      <aside className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Filter className="w-4 h-4 text-survey-600" />
              <span>Bộ Lọc Thông Số Kỹ Thuật</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          </div>

          {/* Search Input inside filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Từ Khóa / Model</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="vd: i73+, GS18, B40A..."
                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-survey-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Loại Thiết Bị Đo</label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-survey-50 text-survey-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Tất Cả Danh Mục</span>
                <span className="text-[10px] text-slate-400">{initialProducts.length}</span>
              </button>
              {categories.map((c) => {
                const count = initialProducts.filter((p) => p.category.slug === c.slug).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === c.slug
                        ? 'bg-survey-50 text-survey-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate pr-1">{c.name}</span>
                    <span className="text-[10px] text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Thương Hiệu</label>
            <div className="space-y-1 text-xs max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedBrand === 'all'
                    ? 'bg-survey-50 text-survey-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Tất cả thương hiệu</span>
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrand(b.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedBrand === b.slug
                      ? 'bg-survey-50 text-survey-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="text-[10px] text-slate-400">
                    {initialProducts.filter((p) => p.brand.slug === b.slug).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* GNSS Channel filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Số Kênh Thu GNSS (RTK)</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => setSelectedChannels('all')}
                className={`py-1.5 text-center rounded border ${
                  selectedChannels === 'all'
                    ? 'bg-slate-900 border-slate-900 text-white font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedChannels('800')}
                className={`py-1.5 text-center rounded border ${
                  selectedChannels === '800'
                    ? 'bg-slate-900 border-slate-900 text-white font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                ≥ 800CH
              </button>
              <button
                onClick={() => setSelectedChannels('1400')}
                className={`py-1.5 text-center rounded border ${
                  selectedChannels === '1400'
                    ? 'bg-slate-900 border-slate-900 text-white font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                ≥ 1400CH
              </button>
            </div>
          </div>

          {/* Angular Accuracy filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Độ Chính Xác Góc (Toàn Đạc)</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => setSelectedAccuracy('all')}
                className={`py-1.5 text-center rounded border ${
                  selectedAccuracy === 'all'
                    ? 'bg-slate-900 border-slate-900 text-white font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedAccuracy('1')}
                className={`py-1.5 text-center rounded border ${
                  selectedAccuracy === '1'
                    ? 'bg-slate-900 border-slate-900 text-white font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Chuẩn 1"
              </button>
              <button
                onClick={() => setSelectedAccuracy('2')}
                className={`py-1.5 text-center rounded border ${
                  selectedAccuracy === '2'
                    ? 'bg-slate-900 border-slate-900 text-white font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Chuẩn 2"
              </button>
            </div>
          </div>

          {/* Condition & Quote Only */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={quoteOnly}
                onChange={(e) => setQuoteOnly(e.target.checked)}
                className="w-4 h-4 rounded text-survey-600"
              />
              <span className="font-semibold">Chỉ hiện máy Báo Giá Dự Án (TS / RTK)</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Main Products Grid */}
      <main className="lg:col-span-9 space-y-4">
        {/* Top bar with count & Sort */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="font-semibold text-slate-700">
            Hiển thị <strong className="text-survey-600 font-bold">{filteredProducts.length}</strong> thiết bị đo phù hợp
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-survey-500"
              >
                <option value="featured">Nổi bật & Bán chạy</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh giá kỹ sư cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <p className="font-bold text-slate-700 text-sm">Không tìm thấy thiết bị đo phù hợp với tiêu chí lọc</p>
            <p className="text-xs text-slate-400">Vui lòng thử đặt lại bộ lọc hoặc tìm kiếm bằng từ khóa khác.</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-survey-600 hover:bg-survey-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Đặt Lại Bộ Lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
