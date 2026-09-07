'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore } from '@/store/useStore';
import { formatVND, formatDateVN } from '@/lib/format';
import {
  FileSpreadsheet,
  Building2,
  Printer,
  ShieldCheck,
  Send,
  Trash2,
  CheckCircle2,
  PhoneCall,
  Mail,
  Home,
  ChevronRight,
} from 'lucide-react';

export default function QuotePage() {
  const { quoteItems, removeFromQuote, clearQuote, showToast } = useAppStore();

  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [fieldTestRequired, setFieldTestRequired] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = quoteItems.reduce((acc, item) => {
    const price = item.product.salePrice || item.product.basePrice;
    return acc + price * item.quantity;
  }, 0);

  const vatAmount = subtotal * 0.1;
  const totalAmount = subtotal + vatAmount;
  const quoteCode = `BG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !phone) {
      showToast('Vui lòng nhập Tên công ty, Người liên hệ và Số điện thoại', 'warning');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPreviewMode(true);
      showToast('Đã tạo hồ sơ dự toán báo giá dự án!', 'success');
    }, 700);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 no-print">
        <Link href="/" className="hover:text-slate-900 flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Trang chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Báo Giá Doanh Nghiệp & Dự Án</span>
      </nav>

      {/* Header */}
      <div className="border-b border-slate-200 pb-4 no-print">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Hệ Thống Xuất Báo Giá Kỹ Thuật B2B</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Báo Giá Thiết Bị Khảo Sát & Trắc Địa Công Trình (VAT)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Dành riêng cho các công ty xây dựng, viện khảo sát, ban QLDA. Báo giá kèm chính sách chiết khấu, đo thử thực địa và cấp chứng nhận kiểm định Quatest 1.
        </p>
      </div>

      {!previewMode ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Selected Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Danh Sách Máy Đo Đã Chọn ({quoteItems.length})
              </h2>
              {quoteItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearQuote}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Xóa tất cả
                </button>
              )}
            </div>

            {quoteItems.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">Chưa có thiết bị nào trong bảng báo giá</p>
                <p className="text-xs text-slate-400">
                  Vui lòng truy cập trang sản phẩm và bấm "Nhận Báo Giá" để thêm các dòng máy GNSS RTK hoặc Toàn đạc vào đây.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-4 py-2 bg-survey-600 text-white rounded-lg text-xs font-bold hover:bg-survey-700"
                >
                  Duyệt Danh Mục Thiết Bị
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
                {quoteItems.map((item) => (
                  <div key={item.product.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                        <Image src={item.product.mainImage} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <Link href={`/products/${item.product.slug}`} className="font-bold text-xs sm:text-sm text-slate-900 hover:text-survey-600 line-clamp-1">
                          {item.product.name}
                        </Link>
                        <p className="text-[11px] text-slate-500">
                          {item.product.brand.name} | SKU: {item.product.sku} | BH: {item.product.warrantyMonths}T
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-survey-600 block">
                          {item.product.isQuoteOnly ? 'Giá dự án' : formatVND(item.product.salePrice || item.product.basePrice)}
                        </span>
                        <span className="text-[10px] text-slate-400">Đơn giá tham khảo</span>
                      </div>
                      <div className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded text-slate-700">
                        SL: {item.quantity} bộ
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromQuote(item.product.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Company details form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-survey-600" />
              <span>Thông Tin Đơn Vị Nhận Báo Giá</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Công Ty / Đơn Vị Khảo Sát <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Công ty CP Tư vấn Thiết kế Giao thông"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã Số Thuế (MST)
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="Nhập MST để xuất hóa đơn VAT"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ Tên Kỹ Sư Phụ Trách <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="vd: KS. Trần Văn Nam"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số Điện Thoại / Zalo <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0988..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Nhận Bản Mềm Báo Giá
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="khao-sat@duan.vn"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa Điểm Công Trình / Tỉnh Thành
                </label>
                <input
                  type="text"
                  value={projectLocation}
                  onChange={(e) => setProjectLocation(e.target.value)}
                  placeholder="Hà Nội, Quảng Ninh, Bình Dương..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fieldTestRequired}
                  onChange={(e) => setFieldTestRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-survey-600 focus:ring-survey-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Yêu cầu kỹ sư mang máy đo thử nghiệm tại công trình thực địa trước khi ký nghiệm thu
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cam kết bảo mật thông tin dự án theo tiêu chuẩn ISO 27001</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || quoteItems.length === 0}
              className="px-6 py-3 bg-survey-600 hover:bg-survey-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-survey-600/30 flex items-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang tạo báo giá...' : 'Tạo Phiếu Báo Giá Kỹ Thuật'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Printable preview */
        <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm space-y-6">
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                CÔNG TY CP THIẾT BỊ TRẮC ĐỊA GEOSURVEY PRO
              </h2>
              <p className="text-xs text-slate-600 mt-1">Đại lý ủy quyền chính thức Leica, Trimble, Topcon, CHCNAV</p>
              <p className="text-xs text-slate-600">Trụ sở: Tòa Hateco Apollo, Đ. Xuân Phương, Q. Nam Từ Liêm, TP. Hà Nội</p>
              <p className="text-xs text-slate-600">Hotline: 0988.355.688 | MST: 0109988221</p>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-sm text-survey-600">PHIẾU BÁO GIÁ DỰ ÁN</div>
              <div className="text-slate-500">Số: <strong>{quoteCode}</strong></div>
              <div className="text-slate-500">Ngày: {formatDateVN(new Date())}</div>
              <div className="text-emerald-600 font-semibold mt-1">Hiệu lực: 30 ngày</div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg text-xs grid grid-cols-2 gap-2 border border-slate-200">
            <div><strong>Đơn vị nhận:</strong> {companyName}</div>
            <div><strong>Mã số thuế:</strong> {taxId || 'N/A'}</div>
            <div><strong>Người phụ trách:</strong> {contactName}</div>
            <div><strong>Điện thoại:</strong> {phone}</div>
            {projectLocation && <div className="col-span-2"><strong>Địa bàn dự án:</strong> {projectLocation}</div>}
          </div>

          {/* Table */}
          <table className="w-full text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300 text-center w-10">STT</th>
                <th className="p-2 border-r border-slate-300">Tên Thiết Bị & Cấu Hình</th>
                <th className="p-2 border-r border-slate-300 text-center w-16">SL</th>
                <th className="p-2 border-r border-slate-300 text-right w-28">Đơn Giá</th>
                <th className="p-2 text-right w-32">Thành Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quoteItems.map((item, idx) => {
                const unitPrice = item.product.salePrice || item.product.basePrice;
                return (
                  <tr key={item.product.id}>
                    <td className="p-2 border-r border-slate-200 text-center">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-200">
                      <strong>{item.product.name}</strong>
                      <div className="text-[11px] text-slate-500">
                        {item.product.brand.name} | BH {item.product.warrantyMonths}T chính hãng
                      </div>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-bold">{item.quantity}</td>
                    <td className="p-2 border-r border-slate-200 text-right">
                      {item.product.isQuoteOnly ? 'Giá dự án' : formatVND(unitPrice)}
                    </td>
                    <td className="p-2 text-right font-bold">
                      {item.product.isQuoteOnly ? 'Theo hợp đồng' : formatVND(unitPrice * item.quantity)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {subtotal > 0 && (
              <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                <tr>
                  <td colSpan={4} className="p-2 text-right border-r border-slate-200">Tạm tính:</td>
                  <td className="p-2 text-right">{formatVND(subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="p-2 text-right border-r border-slate-200">VAT (10%):</td>
                  <td className="p-2 text-right">{formatVND(vatAmount)}</td>
                </tr>
                <tr className="text-sm bg-survey-50 text-survey-900 font-black">
                  <td colSpan={4} className="p-2.5 text-right border-r border-slate-200">TỔNG CỘNG:</td>
                  <td className="p-2.5 text-right text-survey-700">{formatVND(totalAmount)}</td>
                </tr>
              </tfoot>
            )}
          </table>

          {/* Action */}
          <div className="no-print pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
            >
              ← Quay lại chỉnh sửa
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>In / Lưu PDF Báo Giá</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
