'use client';

import React from 'react';
import Image from 'next/image';
import { useAppStore } from '@/store/useStore';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare, setCompareModalOpen } = useAppStore();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-700 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-survey-600 flex items-center justify-center text-white">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              So Sánh Thiết Bị ({compareList.length}/4)
            </h4>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Đối chiếu số kênh, độ chính xác RMS, cảm biến bù nghiêng IMU
            </p>
          </div>
        </div>

        {/* Center: Thumbnails of selected items */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {compareList.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg p-1.5 pr-2.5 shrink-0"
            >
              <div className="relative w-8 h-8 rounded bg-slate-700 overflow-hidden shrink-0">
                <Image src={p.mainImage} alt={p.name} fill className="object-cover" />
              </div>
              <div className="max-w-[120px]">
                <p className="text-[11px] font-medium text-slate-200 truncate">{p.name}</p>
                <p className="text-[10px] text-survey-400 font-semibold">{p.brand.name}</p>
              </div>
              <button
                onClick={() => removeFromCompare(p.id)}
                className="text-slate-400 hover:text-red-400 p-0.5"
                title="Bỏ thiết bị này"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-2 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Xóa</span>
          </button>
          <button
            onClick={() => setCompareModalOpen(true)}
            className="px-4 py-2 text-xs font-bold bg-survey-600 hover:bg-survey-500 text-white rounded-lg flex items-center gap-1.5 shadow-lg shadow-survey-600/30 transition-all"
          >
            <span>So Sánh Chi Tiết</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
