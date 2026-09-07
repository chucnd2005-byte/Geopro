'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/store/useStore';
import { formatVND } from '@/lib/format';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  ArrowRight,
  Truck,
} from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    setCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useAppStore();

  if (!isCartDrawerOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.basePrice;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-5 h-5 text-survey-500" />
              <h3 className="font-bold text-sm">
                Giỏ Hàng Của Bạn ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <p className="font-semibold text-slate-800 text-sm">Giỏ hàng đang trống</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Thêm máy đo hoặc phụ kiện trắc địa vào giỏ để tiến hành đặt hàng nhanh.
                </p>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="mt-2 px-4 py-2 bg-survey-600 hover:bg-survey-700 text-white rounded-lg text-xs font-bold"
                >
                  Tiếp Tục Chọn Hàng
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const price = item.product.salePrice || item.product.basePrice;
                return (
                  <div key={item.product.id} className="py-3.5 flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                      <Image
                        src={item.product.mainImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={() => setCartDrawerOpen(false)}
                        className="font-bold text-xs text-slate-900 hover:text-survey-600 line-clamp-2 leading-snug"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.product.brand.name} | BH {item.product.warrantyMonths}T
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs font-black text-survey-600">
                          {formatVND(price)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span className="font-bold text-slate-900">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Giao hàng toàn quốc:
                  </span>
                  <span className="font-bold">Miễn Phí</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Kiểm định & Hiệu chuẩn:</span>
                  <span className="text-slate-700 font-semibold">Bao gồm tem Quatest 1</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-800">Tổng tiền:</span>
                <span className="text-base font-black text-survey-600">{formatVND(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setCartDrawerOpen(false)}
                className="w-full py-3 bg-survey-600 hover:bg-survey-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md shadow-survey-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
