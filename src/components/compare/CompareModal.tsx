'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/store/useStore';
import { formatVND } from '@/lib/format';
import {
  X,
  Scale,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  ShoppingCart,
  Zap,
} from 'lucide-react';

export default function CompareModal() {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareModalOpen,
    setCompareModalOpen,
    openQuoteForProduct,
    addToCart,
  } = useAppStore();

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-survey-600 flex items-center justify-center text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                Bảng So Sánh Thông Số Kỹ Thuật Trắc Địa
              </h3>
              <p className="text-xs text-slate-400">
                Đối chiếu trực tiếp chi tiết kỹ thuật giữa các dòng máy ({compareList.length}/4 thiết bị)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-red-500/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xóa tất cả</span>
              </button>
            )}
            <button
              onClick={() => setCompareModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {compareList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Scale className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-base font-semibold text-slate-700">Chưa có thiết bị nào trong danh sách so sánh</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Hãy bấm vào biểu tượng "So sánh" trên các sản phẩm Máy GNSS RTK, Toàn Đạc hoặc Thủy Bình để phân tích thông số kỹ thuật.
            </p>
            <button
              onClick={() => setCompareModalOpen(false)}
              className="mt-2 px-4 py-2 text-xs font-bold bg-survey-600 text-white rounded-lg hover:bg-survey-700 transition-colors"
            >
              Khám Phá Thiết Bị
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto p-4 sm:p-6">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-3 bg-slate-50 font-bold text-slate-600 w-48 sticky left-0 z-10">
                    Thuộc Tính So Sánh
                  </th>
                  {compareList.map((p) => (
                    <th key={p.id} className="p-3 w-64 align-top">
                      <div className="space-y-2 relative">
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="absolute -top-1 right-0 text-slate-400 hover:text-red-500 p-1"
                          title="Bỏ thiết bị này"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="relative w-full h-32 bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                          <Image
                            src={p.mainImage}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-[11px] font-semibold text-survey-600">{p.brand.name}</div>
                        <Link
                          href={`/products/${p.slug}`}
                          className="font-bold text-slate-900 hover:text-survey-600 line-clamp-2"
                        >
                          {p.name}
                        </Link>
                        <div className="text-sm font-black text-slate-900">
                          {p.isQuoteOnly ? 'Liên Hệ Báo Giá' : formatVND(p.salePrice || p.basePrice)}
                        </div>
                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => openQuoteForProduct(p)}
                            className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1"
                          >
                            <FileSpreadsheet className="w-3 h-3" /> Báo Giá
                          </button>
                          {!p.isQuoteOnly && (
                            <button
                              onClick={() => addToCart(p, 1)}
                              className="py-1.5 px-2 bg-slate-900 hover:bg-survey-600 text-white rounded text-[11px] font-bold"
                              title="Thêm giỏ hàng"
                            >
                              <ShoppingCart className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Brand & Origin */}
                <tr>
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50 sticky left-0 z-10">
                    Xuất Xứ & Thương Hiệu
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 text-slate-800">
                      {p.brand.name} ({p.origin})
                    </td>
                  ))}
                </tr>

                {/* Condition & Warranty */}
                <tr>
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50 sticky left-0 z-10">
                    Tình Trạng & Bảo Hành
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 text-slate-800">
                      <span className="font-semibold text-emerald-600">
                        {p.condition === 'NEW_100' ? 'Mới 100%' : 'Like New 99%'}
                      </span>{' '}
                      — BH {p.warrantyMonths} Tháng chính hãng
                    </td>
                  ))}
                </tr>

                {/* GNSS Channels */}
                <tr className="bg-orange-50/40">
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50 sticky left-0 z-10">
                    Số Kênh Thu Tín Hiệu
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 font-bold text-orange-700">
                      {p.specs.channels ? `${p.specs.channels} Kênh đa tần số` : '—'}
                    </td>
                  ))}
                </tr>

                {/* Constellations */}
                <tr>
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50 sticky left-0 z-10">
                    Hệ Thống Vệ Tinh (GNSS)
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 text-slate-700 text-[11px] leading-relaxed">
                      {p.specs.constellations || '—'}
                    </td>
                  ))}
                </tr>

                {/* Accuracy */}
                <tr>
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50 sticky left-0 z-10">
                    Độ Chính Xác RTK (RMS)
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 text-slate-800">
                      {p.specs.horizontalAccuracy ? (
                        <div>
                          <div>Mặt bằng: <span className="font-semibold">{p.specs.horizontalAccuracy}</span></div>
                          <div>Cao độ: <span className="font-semibold">{p.specs.verticalAccuracy}</span></div>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  ))}
                </tr>

                {/* Tilt Sensor IMU */}
                <tr className="bg-cyan-50/40">
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50 sticky left-0 z-10">
                    Bù Nghiêng IMU
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 font-medium text-cyan-900">
                      {p.specs.tiltCompensation || 'Không hỗ trợ'}
                    </td>
                  ))}
                </tr>

                {/* Internal UHF Radio */}
                <tr>
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50 sticky left-0 z-10">
                    Radio Trong UHF
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 text-slate-800">
                      {p.specs.uhfPower || '—'}
                    </td>
                  ))}
                </tr>

                {/* Total Station Specifics */}
                <tr>
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50 sticky left-0 z-10">
                    Đo Góc & Đo Không Gương EDM
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 text-slate-800">
                      {p.specs.angularAccuracy || p.specs.reflectorlessRange ? (
                        <div>
                          {p.specs.angularAccuracy && <div>Độ chính xác góc: <strong>{p.specs.angularAccuracy}</strong></div>}
                          {p.specs.reflectorlessRange && <div>Không gương: <strong>{p.specs.reflectorlessRange}</strong></div>}
                          {p.specs.prismRange && <div>Có gương: {p.specs.prismRange}</div>}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  ))}
                </tr>

                {/* Optical Levels */}
                <tr>
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50 sticky left-0 z-10">
                    Độ Phóng Đại / Sai Số mm/km
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 text-slate-800">
                      {p.specs.magnification ? (
                        <div>
                          <div>Độ phóng đại: <strong>{p.specs.magnification}</strong></div>
                          {p.specs.stdDevPerKm && <div>Sai số 1km đo lặp: <strong>{p.specs.stdDevPerKm}</strong></div>}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  ))}
                </tr>

                {/* Ingress Protection & Battery */}
                <tr>
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50 sticky left-0 z-10">
                    Chuẩn Chống Bụi Nước & Pin
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 text-slate-800">
                      <div>Chuẩn: <span className="font-bold text-slate-900">{p.specs.ingressProtection || 'IP54'}</span></div>
                      {p.specs.batteryLifeHours && <div>Thời lượng pin: <strong>{p.specs.batteryLifeHours} giờ</strong></div>}
                      {p.specs.weightKg && <div>Trọng lượng: {p.specs.weightKg} kg</div>}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
