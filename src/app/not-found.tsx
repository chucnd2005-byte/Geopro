import React from 'react';
import Link from 'next/link';
import { Crosshair, ArrowLeft, Home, Search, Compass, PhoneCall } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Animated Icon & Badge */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-survey-500 shadow-2xl mx-auto">
            <Crosshair className="w-10 h-10 animate-spin-slow" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-survey-600 text-white font-mono font-black text-xs rounded-md shadow">
            404
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Không Tìm Thấy Thiết Bị Đo Đạc
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Đường dẫn hoặc sản phẩm trắc địa bạn yêu cầu không tồn tại, đã được đổi tên hoặc tạm thời gỡ khỏi danh mục thiết bị của GeoSurvey Pro.
          </p>
        </div>

        {/* Quick Suggestion Cards */}
        <div className="grid grid-cols-2 gap-3 text-left pt-2">
          <Link
            href="/products?category=may-dinh-vi-gnss-rtk"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-survey-500 hover:shadow-md transition-all group bg-white"
          >
            <Compass className="w-5 h-5 text-survey-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">Máy GNSS RTK</div>
            <div className="text-[11px] text-slate-500">1408 kênh, bù nghiêng IMU</div>
          </Link>

          <Link
            href="/products?category=may-toan-dac-dien-tu"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-survey-500 hover:shadow-md transition-all group bg-white"
          >
            <Crosshair className="w-5 h-5 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">Máy Toàn Đạc</div>
            <div className="text-[11px] text-slate-500">Độ chính xác 1", 2"</div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-5 py-2.5 bg-survey-600 hover:bg-survey-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-survey-600/20"
          >
            <Search className="w-4 h-4" />
            <span>Xem Danh Mục Thiết Bị</span>
          </Link>
        </div>

        {/* Support Help */}
        <div className="pt-4 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-survey-600" />
          <span>Hỗ trợ kỹ thuật đo đạc 24/7: </span>
          <strong className="text-slate-800">1900 8299</strong>
        </div>
      </div>
    </div>
  );
}
