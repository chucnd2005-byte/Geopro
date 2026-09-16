'use client';

import React, { useState } from 'react';
import { Globe, Smartphone, Monitor, Star, Check } from 'lucide-react';

interface Props {
  title: string;
  slug: string;
  description: string;
  baseUrl?: string;
  price?: number;
  inStock?: boolean;
}

export default function SerpPreview({
  title,
  slug,
  description,
  baseUrl = 'https://geosurvey.vn',
  price,
  inStock = true,
}: Props) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const titleLength = title.length;
  const descLength = description.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-white font-bold">
          <Globe className="w-4 h-4 text-survey-400" />
          <span>Mô Phỏng Hiển Thị Google Tìm Kiếm (SERP Inspector)</span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${
              device === 'desktop' ? 'bg-survey-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>Máy tính</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${
              device === 'mobile' ? 'bg-survey-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Điện thoại</span>
          </button>
        </div>
      </div>

      {/* Length meters */}
      <div className="grid grid-cols-2 gap-3 text-[11px]">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Độ dài Tiêu đề: <strong>{titleLength}</strong> / 60 ký tự</span>
            <span className={titleLength > 65 ? 'text-amber-400' : 'text-emerald-400'}>
              {titleLength > 65 ? 'Dài quá giới hạn' : 'Tối ưu chuẩn'}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${titleLength > 65 ? 'bg-amber-400' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Độ dài Meta Description: <strong>{descLength}</strong> / 160 ký tự</span>
            <span className={descLength > 165 ? 'text-amber-400' : 'text-emerald-400'}>
              {descLength > 165 ? 'Dài quá giới hạn' : 'Tối ưu chuẩn'}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${descLength > 165 ? 'bg-amber-400' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Simulated Google Search Card (Light Box like Google SERP) */}
      <div className="bg-white rounded-xl p-4 border border-slate-300 shadow-sm space-y-1 font-sans">
        {/* Favicon & Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[#202124] leading-tight">
          <div className="w-4 h-4 rounded-full bg-survey-600 text-white flex items-center justify-center text-[9px] font-bold">
            GS
          </div>
          <div className="truncate">
            <span className="font-medium text-[#202124]">GeoSurvey Pro</span>
            <span className="text-[#5f6368] text-[11px] ml-1">
              {baseUrl} › {slug || 'thiet-bi-do-dac'}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="pt-0.5">
          <h4 className="text-[17px] sm:text-[19px] leading-snug text-[#1a0dab] hover:underline cursor-pointer font-medium line-clamp-1">
            {title || 'Tên Thiết Bị Đo Đạc Chính Hãng | GeoSurvey Pro'}
          </h4>
        </div>

        {/* Rich Snippets Stars */}
        <div className="flex items-center gap-2 text-[12px] text-[#4d5156]">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400" />
            ))}
          </div>
          <span>Xếp hạng: 5.0 • 28 đánh giá kỹ sư</span>
          {price ? <span>• Giá: {price.toLocaleString('vi-VN')} ₫</span> : null}
          {inStock && <span className="text-emerald-700 font-semibold">• Còn hàng</span>}
        </div>

        {/* Meta Description snippet */}
        <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2 pt-0.5">
          {description ||
            'Hệ thống cung cấp thiết bị đo đạc, máy định vị vệ tinh GNSS RTK 1408 kênh, máy toàn đạc điện tử và dịch vụ kiểm định hiệu chuẩn đo lường Quatest 1 chính hãng toàn quốc.'}
        </p>
      </div>
    </div>
  );
}
