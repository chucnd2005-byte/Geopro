'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Satellite,
  Crosshair,
  ShieldCheck,
  FileSpreadsheet,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAppStore } from '@/store/useStore';

export default function HeroBanner() {
  const { setQuoteModalOpen } = useAppStore();

  return (
    <div className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800 bg-dark-grid">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-survey-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-laser/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Official Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-survey-400 shadow-inner">
              <Award className="w-3.5 h-3.5 text-survey-500" />
              <span>Đại Lý Phân Phối & Trung Tâm Hiệu Chuẩn Quatest 1</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
              HỆ THỐNG THIẾT BỊ{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-survey-400 via-survey-500 to-amber-400">
                ĐO ĐẠC & TRẮC ĐỊA
              </span>{' '}
              CHÍNH HÃNG TOÀN QUỐC
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
              Chuyên sâu thiết bị GNSS RTK 1408 kênh bù nghiêng IMU 60°, máy toàn đạc điện tử độ chính xác 1", máy thủy bình tự động 0.7mm/km. Nhập khẩu trực tiếp Leica, Trimble, Topcon, CHCNAV với đầy đủ giấy kiểm định Vilas / Quatest pháp lý nghiệm thu.
            </p>

            {/* 4 Telemetry Bullet points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="font-mono text-base font-black text-survey-400">1408 CH</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Bắt trọn đa vệ tinh</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="font-mono text-base font-black text-cyan-400">IMU 60°</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Bù nghiêng không bọt</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="font-mono text-base font-black text-emerald-400">0.7 mm</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Sai số chuẩn thủy chuẩn</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="font-mono text-base font-black text-amber-400">63 Tỉnh</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Đo thử tại công trình</div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/products?category=may-dinh-vi-gnss-rtk"
                className="px-6 py-3.5 bg-survey-600 hover:bg-survey-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-survey-600/30 flex items-center gap-2 transition-all group"
              >
                <span>Xem Thiết Bị RTK Mới Nhất</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={() => setQuoteModalOpen(true)}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>Nhận Báo Giá Dự Án (VAT)</span>
              </button>
            </div>

            {/* Trust checkmarks */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Miễn phí tài khoản Trạm CORS
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Bảo hành 24-36T chính hãng
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Đổi mới trong 30 ngày nếu lỗi
              </span>
            </div>
          </div>

          {/* Right Showcase Hardware Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700 p-4 shadow-2xl backdrop-blur-sm">
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="px-2 py-0.5 rounded bg-survey-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> Flagship RTK 2026
                </span>
                <span className="text-slate-400 font-mono text-[11px]">FIXED RMS: 8mm</span>
              </div>

              {/* Hardware Visual */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 group">
                <Image
                  src="https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=800&q=80"
                  alt="Hệ thống máy đo trắc địa GNSS RTK"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md rounded-lg p-2 text-xs border border-slate-800">
                  <div className="font-bold text-white">CHCNAV i73+ Pocket RTK GNSS</div>
                  <div className="text-[11px] text-survey-400">1408 Kênh | Bù nghiêng IMU 60° | Nặng 0.73kg</div>
                </div>
              </div>

              {/* Live Status Indicators */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5">
                  <div className="text-[10px] text-slate-400">Tình trạng kho hàng:</div>
                  <div className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Có sẵn tại HN & HCM</span>
                  </div>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5">
                  <div className="text-[10px] text-slate-400">Chính sách ưu đãi:</div>
                  <div className="font-bold text-survey-400 mt-0.5">Tặng kèm trọn bộ Sổ tay</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Giá trọn bộ:</span>
                  <span className="text-base font-black text-white ml-2">68.000.000 ₫</span>
                </div>
                <Link
                  href="/products/may-dinh-vi-gnss-rtk-chcnav-i73-plus"
                  className="px-3 py-1.5 bg-survey-600 hover:bg-survey-500 text-white font-bold rounded-lg text-[11px] transition-colors"
                >
                  Xem Cấu Hình →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
