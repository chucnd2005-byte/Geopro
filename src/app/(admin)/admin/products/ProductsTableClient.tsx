'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatVND } from '@/lib/format';
import { deleteProductAction, toggleProductQuoteOnlyAction } from '@/app/actions/admin/products';
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  initialProducts: any[];
  categories: any[];
  brands: any[];
}

export default function ProductsTableClient({ initialProducts, categories, brands }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
      if (selectedBrand !== 'all' && p.brandId !== selectedBrand) return false;
      if (selectedStock === 'low' && p.stock > 5) return false;
      if (selectedStock === 'out' && p.stock > 0) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBrand = p.brand.name.toLowerCase().includes(q);
        return matchName || matchSku || matchBrand;
      }
      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedStock]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa thiết bị "${name}"?`)) {
      const res = await deleteProductAction(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(res.error || 'Xóa thất bại.');
      }
    }
  };

  const handleToggleQuote = async (id: string, currentVal: boolean) => {
    const res = await toggleProductQuoteOnlyAction(id, currentVal);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isQuoteOnly: !currentVal } : p))
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên máy, SKU, hãng..."
              className="w-full pl-8 pr-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-survey-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 bg-slate-950/70 border border-slate-700 rounded-lg text-slate-200"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="p-2 bg-slate-950/70 border border-slate-700 rounded-lg text-slate-200"
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="p-2 bg-slate-950/70 border border-slate-700 rounded-lg text-slate-200"
          >
            <option value="all">Tất cả tồn kho</option>
            <option value="low">Sắp hết hàng (≤ 5)</option>
            <option value="out">Hết hàng (0)</option>
          </select>
        </div>

        <div className="text-slate-400 text-xs">
          Tìm thấy <strong className="text-survey-400">{filteredProducts.length}</strong> model
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Thiết Bị & Model</th>
                <th className="p-3.5">Hãng / Danh Mục</th>
                <th className="p-3.5">Thông Số Nổi Bật</th>
                <th className="p-3.5">Giá Bán / Dự Toán</th>
                <th className="p-3.5 text-center">Tồn Kho</th>
                <th className="p-3.5 text-center">Báo Giá B2B</th>
                <th className="p-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Image + Title */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                        <Image src={p.mainImage} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-white line-clamp-1" title={p.name}>
                          {p.name}
                        </p>
                        <p className="text-[11px] font-mono text-survey-400 mt-0.5">SKU: {p.sku}</p>
                      </div>
                    </div>
                  </td>

                  {/* Brand & Category */}
                  <td className="p-3.5">
                    <div className="text-slate-200 font-medium">{p.brand.name}</div>
                    <div className="text-[11px] text-slate-500">{p.category.name}</div>
                  </td>

                  {/* Highlights */}
                  <td className="p-3.5">
                    <div className="space-y-0.5">
                      {p.specs?.channels && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-semibold mr-1">
                          {p.specs.channels} Kênh
                        </span>
                      )}
                      {p.specs?.angularAccuracy && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-semibold mr-1">
                          Góc {p.specs.angularAccuracy}
                        </span>
                      )}
                      {p.specs?.tiltCompensation && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-semibold">
                          IMU 60°
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="p-3.5">
                    {p.isQuoteOnly ? (
                      <span className="font-bold text-amber-400 text-xs">Giá Dự Án</span>
                    ) : (
                      <div>
                        <div className="font-bold text-slate-200">{formatVND(p.salePrice || p.basePrice)}</div>
                        {p.salePrice && (
                          <div className="text-[10px] text-slate-500 line-through">{formatVND(p.basePrice)}</div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.stock === 0
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : p.stock <= 5
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {p.stock} bộ
                    </span>
                  </td>

                  {/* Quote only toggle */}
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleToggleQuote(p.id, p.isQuoteOnly)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        p.isQuoteOnly
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {p.isQuoteOnly ? 'Bật B2B' : 'Bán lẻ'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="Chỉnh sửa chi tiết"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors"
                        title="Xem trên trang sản phẩm khách hàng"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                        title="Xóa thiết bị"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
