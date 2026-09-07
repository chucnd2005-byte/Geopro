'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatVND } from '@/lib/format';
import { useAppStore } from '@/store/useStore';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  FileSpreadsheet,
  ShoppingCart,
  Scale,
  Download,
  FileText,
  Star,
  Truck,
  RotateCcw,
  PhoneCall,
  Clock,
  ChevronRight,
  Package,
  Wrench,
} from 'lucide-react';
import ProductCard from './ProductCard';

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.mainImage);
  const [activeTab, setActiveTab] = useState<'specs' | 'downloads' | 'package' | 'reviews'>('specs');
  const [quantity, setQuantity] = useState(1);

  const { addToCart, addToCompare, compareList, openQuoteForProduct, showToast } = useAppStore();

  const isComparing = compareList.some((p) => p.id === product.id);

  const handleDownload = (docTitle: string) => {
    showToast(`Đang tải tài liệu "${docTitle}"...`, 'info');
  };

  return (
    <div className="space-y-12">
      {/* Top Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery & Zoomable Visual */}
        <div className="lg:col-span-6 space-y-3">
          {/* Main Large Visual */}
          <div className="relative aspect-[4/3] rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm group">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Condition Tag */}
            <div className="absolute top-3 left-3 z-10 flex gap-2">
              <span className="px-2.5 py-1 text-xs font-bold uppercase rounded bg-slate-900 text-white tracking-wider">
                {product.condition === 'NEW_100' ? 'Mới 100% Nguyên Seal' : 'Lướt 99%'}
              </span>
              <span className="px-2.5 py-1 text-xs font-bold uppercase rounded bg-emerald-600 text-white tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Kiểm Định Quatest 1
              </span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {product.gallery.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img ? 'border-survey-600 ring-2 ring-survey-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Hình ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Field Service Guarantee Box */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs space-y-2.5 text-slate-700">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cam Kết Chất Lượng & Dịch Vụ Hậu Mãi:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Bảo hành chính hãng <strong>{product.warrantyMonths} tháng</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Miễn phí hiệu chuẩn 02 lần/năm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Cho mượn máy tương đương khi bảo hành</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Đo thử thực địa tại công trình 63 tỉnh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Technical Spec Highlights, Price, Actions */}
        <div className="lg:col-span-6 space-y-5">
          {/* Brand, SKU, Rating */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-survey-600 uppercase tracking-wider">{product.brand.name}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">Xuất xứ: {product.origin}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">SKU: {product.sku}</span>
            </div>

            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount} đánh giá kỹ sư)</span>
            </div>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {product.name}
          </h1>

          {/* Dynamic Spec Highlight Badges */}
          <div className="flex flex-wrap gap-2">
            {product.specs.channels && (
              <div className="px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-900 text-xs font-bold flex items-center gap-1.5">
                <span>{product.specs.channels} Kênh Thu GNSS</span>
              </div>
            )}
            {product.specs.tiltCompensation && (
              <div className="px-3 py-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold flex items-center gap-1.5">
                <span>IMU 60° Bù Nghiêng Tự Động</span>
              </div>
            )}
            {product.specs.angularAccuracy && (
              <div className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold">
                <span>Độ Chính Xác Góc {product.specs.angularAccuracy}</span>
              </div>
            )}
            {product.specs.reflectorlessRange && (
              <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
                <span>EDM Không Gương {product.specs.reflectorlessRange}</span>
              </div>
            )}
            {product.specs.magnification && (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                <span>Độ Phóng Đại {product.specs.magnification}</span>
              </div>
            )}
            <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
              <span>IP: {product.specs.ingressProtection || 'IP67'}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            {product.isQuoteOnly ? (
              <div>
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Báo Giá Dự Án & Doanh Nghiệp
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Liên Hệ Nhận Báo Giá VAT Kèm Chiết Khấu
                </div>
                <p className="text-xs text-slate-500">
                  Dòng máy cao cấp được chiết khấu theo quy mô dự án và số lượng trạm đo. Hỗ trợ xuất hóa đơn VAT điện tử ngay trong ngày.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-xs text-slate-500">Giá bán trọn bộ tiêu chuẩn (chưa VAT):</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-survey-600">
                    {formatVND(product.salePrice || product.basePrice)}
                  </span>
                  {product.salePrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatVND(product.basePrice)}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Còn hàng tại kho Hà Nội & TP. Hồ Chí Minh — Giao hỏa tốc trong 24h
                </div>
              </div>
            )}
          </div>

          {/* Key Highlight Bullets */}
          <div className="space-y-1.5 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Đặc Điểm Nổi Bật:</h4>
            <ul className="space-y-1 text-xs text-slate-600">
              {product.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-survey-600 font-bold">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {!product.isQuoteOnly && (
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>
              )}

              <button
                onClick={() => openQuoteForProduct(product)}
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Nhận Báo Giá Dự Án / VAT</span>
              </button>

              {!product.isQuoteOnly && (
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 py-3 px-4 bg-survey-600 hover:bg-survey-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-survey-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>
              )}
            </div>

            {/* Compare Pin Button */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => addToCompare(product)}
                className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isComparing
                    ? 'bg-survey-600 text-white border-survey-600'
                    : 'border-slate-300 text-slate-700 hover:border-survey-500 hover:text-survey-600'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isComparing ? 'Đã ghim trong bảng so sánh' : 'Ghim so sánh với model khác'}</span>
              </button>

              <a
                href="tel:0988355688"
                className="text-xs font-bold text-slate-700 hover:text-survey-600 flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5 text-survey-600" />
                <span>Hotline Kỹ Thuật: 0988.355.688</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Specs, Downloads, Package Checklist, Reviews) */}
      <div className="border-t border-slate-200 pt-8">
        <div className="flex border-b border-slate-200 gap-4 sm:gap-8 overflow-x-auto text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-survey-600 text-survey-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Thông Số Kỹ Thuật Chi Tiết
          </button>

          <button
            onClick={() => setActiveTab('package')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'package'
                ? 'border-survey-600 text-survey-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Trọn Bộ Hộp Máy Bao Gồm</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'downloads'
                ? 'border-survey-600 text-survey-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Tài Liệu Kỹ Thuật & Giấy Kiểm Định ({product.downloads?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-survey-600 text-survey-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Đánh Giá Kỹ Sư Thực Địa ({product.reviewCount})</span>
          </button>
        </div>

        <div className="py-6">
          {/* Tab 1: Detailed Specs Table */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div className="max-w-4xl border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900 w-1/3">Thương hiệu / Xuất xứ</td>
                      <td className="p-3.5 text-slate-700">{product.brand.name} ({product.origin})</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3.5 font-bold text-slate-900">Mã thiết bị (SKU)</td>
                      <td className="p-3.5 font-mono text-slate-700">{product.sku}</td>
                    </tr>
                    {product.specs.channels && (
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">Số kênh thu nhận tín hiệu</td>
                        <td className="p-3.5 font-bold text-orange-700">{product.specs.channels} Kênh đa tần số</td>
                      </tr>
                    )}
                    {product.specs.constellations && (
                      <tr className="border-b border-slate-100">
                        <td className="p-3.5 font-bold text-slate-900">Chòm sao vệ tinh hỗ trợ</td>
                        <td className="p-3.5 text-slate-700">{product.specs.constellations}</td>
                      </tr>
                    )}
                    {product.specs.horizontalAccuracy && (
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">Độ chính xác đo RTK</td>
                        <td className="p-3.5 text-slate-700">
                          Ngang: <strong>{product.specs.horizontalAccuracy}</strong> / Đứng: <strong>{product.specs.verticalAccuracy}</strong>
                        </td>
                      </tr>
                    )}
                    {product.specs.tiltCompensation && (
                      <tr className="border-b border-slate-100">
                        <td className="p-3.5 font-bold text-slate-900">Bù nghiêng bọt thủy (IMU)</td>
                        <td className="p-3.5 font-bold text-cyan-800">{product.specs.tiltCompensation}</td>
                      </tr>
                    )}
                    {product.specs.uhfPower && (
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">Công suất phát Radio trong</td>
                        <td className="p-3.5 text-slate-700">{product.specs.uhfPower}</td>
                      </tr>
                    )}
                    {product.specs.angularAccuracy && (
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">Độ chính xác đo góc</td>
                        <td className="p-3.5 font-bold text-purple-800">{product.specs.angularAccuracy}</td>
                      </tr>
                    )}
                    {product.specs.reflectorlessRange && (
                      <tr className="border-b border-slate-100">
                        <td className="p-3.5 font-bold text-slate-900">Khoảng cách đo không gương</td>
                        <td className="p-3.5 text-slate-700">{product.specs.reflectorlessRange} (Tia laser hội tụ)</td>
                      </tr>
                    )}
                    {product.specs.magnification && (
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">Độ phóng đại kính ngắm</td>
                        <td className="p-3.5 font-bold text-emerald-800">{product.specs.magnification}</td>
                      </tr>
                    )}
                    {product.specs.stdDevPerKm && (
                      <tr className="border-b border-slate-100">
                        <td className="p-3.5 font-bold text-slate-900">Sai số đo lặp 1km</td>
                        <td className="p-3.5 text-slate-700">{product.specs.stdDevPerKm}</td>
                      </tr>
                    )}
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">Chuẩn bảo vệ môi trường</td>
                      <td className="p-3.5 font-bold text-slate-900">{product.specs.ingressProtection || 'IP67'}</td>
                    </tr>
                    {product.specs.batteryLifeHours && (
                      <tr className="border-b border-slate-100">
                        <td className="p-3.5 font-bold text-slate-900">Thời lượng pin liên tục</td>
                        <td className="p-3.5 text-slate-700">{product.specs.batteryLifeHours} Giờ làm việc</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Full Description text */}
              <div className="max-w-4xl text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-white p-5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm">Mô Tả Ứng Dụng Kỹ Thuật Tại Hiện Trường</h4>
                <p>{product.fullDesc}</p>
              </div>
            </div>
          )}

          {/* Tab 2: Standard Package Checklist */}
          {activeTab === 'package' && (
            <div className="max-w-3xl bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-survey-600" />
                <span>Danh Mục Thiết Bị Bàn Giao Trong Thùng Chống Sốc:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.standardPackage.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 italic pt-2">
                * Toàn bộ phụ kiện đều là hàng chính hãng đồng bộ, được kiểm tra bọt thủy và hiệu chỉnh trước khi bàn giao tới tay khách hàng.
              </p>
            </div>
          )}

          {/* Tab 3: Downloads & Calibration */}
          {activeTab === 'downloads' && (
            <div className="max-w-3xl space-y-3">
              {product.downloads && product.downloads.length > 0 ? (
                product.downloads.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4 hover:border-survey-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-survey-50 text-survey-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">{doc.title}</h5>
                        <p className="text-[11px] text-slate-500">Định dạng: {doc.docType} | Dung lượng: {doc.fileSize}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(doc.title)}
                      className="px-3 py-2 bg-slate-900 hover:bg-survey-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải Về</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Tài liệu đang được cập nhật thêm. Quý khách vui lòng liên hệ hotline để nhận bản mềm PDF trực tiếp.
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Verified Reviews */}
          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-black text-slate-900">{product.rating} / 5.0</div>
                  <div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Dựa trên {product.reviewCount} khảo sát thực tế từ kỹ sư trắc địa</p>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Cảm ơn bạn! Đội ngũ kỹ thuật sẽ tiếp nhận đánh giá sau khi đối chiếu số serial máy.', 'info')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Gửi Đánh Giá Thực Địa
                </button>
              </div>

              {/* Sample Review Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">KS. Nguyễn Thành Long</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đã kiểm chứng máy
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">Dự án: Tuyến đường đèo Tây Bắc</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <h5 className="font-bold text-xs text-slate-900">Độ chính xác cao, bắt vệ tinh cực nhanh dưới tán cây</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Đã đem máy đi đo thực địa công trình vùng núi. Tín hiệu RTK Fixed rất ổn định qua trạm CORS, tính năng bù nghiêng IMU giải phóng hoàn toàn thời gian căn chỉnh bọt thủy. Cực kỳ hài lòng với độ bền pin và hỗ trợ kỹ thuật tận tình của GeoSurvey Pro.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cross-sell & Related Accessories */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-200 pt-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Thiết Bị Cùng Phân Khúc & Phụ Kiện Đề Xuất
            </h3>
            <Link href="/products" className="text-xs font-bold text-survey-600 hover:underline">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
