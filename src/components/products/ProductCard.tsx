'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { formatVND } from '@/lib/format';
import { useAppStore } from '@/store/useStore';
import {
  Scale,
  FileSpreadsheet,
  ShoppingCart,
  Check,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToCompare, compareList, openQuoteForProduct } = useAppStore();

  const isComparing = compareList.some((p) => p.id === product.id);

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-survey-500/50 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-900 text-white tracking-wider">
          {product.condition === 'NEW_100' ? 'Mới 100%' : 'Like New 99%'}
        </span>
        {product.isFeatured && (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-survey-600 text-white tracking-wider flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" /> Bán Chạy
          </span>
        )}
      </div>

      {/* Compare Checkbox Icon Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          addToCompare(product);
        }}
        className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 shadow-sm ${
          isComparing
            ? 'bg-survey-600 border-survey-600 text-white'
            : 'bg-white/90 backdrop-blur-sm border-slate-200 text-slate-600 hover:border-survey-500 hover:text-survey-600'
        }`}
        title="Thêm vào bảng so sánh thông số"
      >
        <Scale className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold pr-0.5">{isComparing ? 'Đã ghim' : 'So sánh'}</span>
      </button>

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] bg-slate-50 overflow-hidden">
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Brand & Origin */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span className="font-semibold text-slate-700">{product.brand.name}</span>
          <span>{product.origin}</span>
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="font-bold text-slate-900 group-hover:text-survey-600 transition-colors line-clamp-2 text-sm leading-snug mb-2"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Dynamic Spec Highlight Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.specs.channels && (
            <span className="text-[10px] font-medium bg-orange-50 text-orange-800 border border-orange-200 px-1.5 py-0.5 rounded">
              {product.specs.channels} Kênh
            </span>
          )}
          {product.specs.tiltCompensation && (
            <span className="text-[10px] font-medium bg-cyan-50 text-cyan-800 border border-cyan-200 px-1.5 py-0.5 rounded">
              IMU 60°
            </span>
          )}
          {product.specs.angularAccuracy && (
            <span className="text-[10px] font-medium bg-purple-50 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded">
              Góc {product.specs.angularAccuracy}
            </span>
          )}
          {product.specs.reflectorlessRange && (
            <span className="text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded">
              EDM {product.specs.reflectorlessRange}
            </span>
          )}
          {product.specs.magnification && (
            <span className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
              Phóng đại {product.specs.magnification}
            </span>
          )}
          {product.specs.stdDevPerKm && (
            <span className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
              {product.specs.stdDevPerKm}
            </span>
          )}
          <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
            BH {product.warrantyMonths}T
          </span>
        </div>

        {/* Short desc */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.shortDesc}
        </p>

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <div className="flex items-baseline justify-between mb-3">
            {product.isQuoteOnly ? (
              <div>
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Báo Giá Dự Án
                </span>
                <span className="text-[11px] text-slate-400">Chiết khấu theo số lượng</span>
              </div>
            ) : (
              <div>
                <div className="text-base font-black text-survey-600">
                  {formatVND(product.salePrice || product.basePrice)}
                </div>
                {product.salePrice && (
                  <div className="text-[11px] text-slate-400 line-through">
                    {formatVND(product.basePrice)}
                  </div>
                )}
              </div>
            )}

            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Sẵn hàng</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openQuoteForProduct(product)}
              className="px-2.5 py-2 text-xs font-semibold border border-slate-300 hover:border-survey-500 hover:text-survey-600 text-slate-700 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
              <span>Báo Giá</span>
            </button>

            {product.isQuoteOnly ? (
              <button
                onClick={() => openQuoteForProduct(product)}
                className="px-2.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <span>Nhận Tư Vấn</span>
              </button>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="px-2.5 py-2 text-xs font-bold bg-survey-600 hover:bg-survey-700 text-white rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm shadow-survey-600/20"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Thêm Giỏ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
