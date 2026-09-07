'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore } from '@/store/useStore';
import { formatVND } from '@/lib/format';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Home,
  ChevronRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useAppStore();

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.salePrice || item.product.basePrice;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Trang chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Giỏ Hàng Thiết Bị</span>
      </nav>

      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Giỏ Hàng Của Bạn ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Miễn phí vận chuyển và hiệu chuẩn kiểm định Quatest 1 cho tất cả đơn hàng.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-500 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-slate-400">
            Bạn chưa chọn thiết bị đo đạc hoặc phụ kiện nào. Khám phá các dòng máy GNSS RTK, máy toàn đạc và máy thủy bình tự động của chúng tôi.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 bg-survey-600 hover:bg-survey-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Khám Phá Thiết Bị Đo Đạc
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {cart.map((item) => {
              const unitPrice = item.product.salePrice || item.product.basePrice;
              return (
                <div key={item.product.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                      <Image src={item.product.mainImage} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-bold text-xs sm:text-sm text-slate-900 hover:text-survey-600 line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Hãng: {item.product.brand.name} | SKU: {item.product.sku} | BH {item.product.warrantyMonths}T
                      </p>
                      <div className="text-xs font-bold text-survey-600 mt-1.5 sm:hidden">
                        {formatVND(unitPrice)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <div className="hidden sm:block text-right">
                      <span className="text-sm font-black text-slate-900 block">{formatVND(unitPrice)}</span>
                      <span className="text-[10px] text-slate-400">Đơn giá</span>
                    </div>

                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900">Chi Tiết Thanh Toán</h2>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-bold text-slate-900">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Giao hàng toàn quốc:
                  </span>
                  <span className="font-bold">Miễn Phí</span>
                </div>
                <div className="flex justify-between">
                  <span>Tem kiểm định Quatest 1:</span>
                  <span className="font-semibold text-slate-800">Miễn Phí</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-800">TỔNG CỘNG:</span>
                <span className="text-lg font-black text-survey-600">{formatVND(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full py-3 bg-survey-600 hover:bg-survey-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-survey-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
