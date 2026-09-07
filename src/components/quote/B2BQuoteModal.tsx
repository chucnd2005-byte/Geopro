'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/store/useStore';
import { formatVND, formatDateVN } from '@/lib/format';
import {
  X,
  FileSpreadsheet,
  Building2,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Send,
  Trash2,
  Plus,
  Minus,
} from 'lucide-react';

export default function B2BQuoteModal() {
  const {
    quoteItems,
    removeFromQuote,
    clearQuote,
    isQuoteModalOpen,
    setQuoteModalOpen,
    activeQuoteProduct,
    showToast,
  } = useAppStore();

  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [fieldTestRequired, setFieldTestRequired] = useState(true);
  const [notes, setNotes] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  if (!isQuoteModalOpen) return null;

  // Subtotal calculation
  const subtotal = quoteItems.reduce((acc, item) => {
    const price = item.product.salePrice || item.product.basePrice;
    return acc + price * item.quantity;
  }, 0);

  const vatAmount = subtotal * 0.1; // 10% VAT
  const totalAmount = subtotal + vatAmount;

  const quoteCode = submittedCode || `BG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !phone) {
      showToast('Vui lòng nhập đầy đủ Tên công ty, Người liên hệ và Số điện thoại', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedCode(quoteCode);
      setPreviewMode(true);
      showToast('Đã tạo báo giá dự án thành công!', 'success');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Tạo Báo Giá Dự Án Doanh Nghiệp & Đơn Vị Khảo Sát
              </h3>
              <p className="text-xs text-slate-400">
                Xuất phiếu báo giá chính thức có dấu kiểm định và chiết khấu dự án
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              {previewMode ? 'Sửa thông tin' : 'Xem trước bản in'}
            </button>
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!previewMode ? (
            /* Input Form */
            <form onSubmit={handleSubmitQuote} className="space-y-6">
              {/* Selected Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Danh Sách Thiết Bị Cần Báo Giá ({quoteItems.length})
                  </h4>
                  {quoteItems.length > 1 && (
                    <button
                      type="button"
                      onClick={clearQuote}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Xóa tất cả
                    </button>
                  )}
                </div>

                {quoteItems.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Chưa có thiết bị nào trong bảng báo giá. Vui lòng bấm "Nhận Báo Giá" tại trang sản phẩm.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                    {quoteItems.map((item) => (
                      <div key={item.product.id} className="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                            <Image
                              src={item.product.mainImage}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              SKU: {item.product.sku} | Hãng: {item.product.brand.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-bold text-survey-600 block">
                              {item.product.isQuoteOnly
                                ? 'Báo giá theo số lượng'
                                : formatVND(item.product.salePrice || item.product.basePrice)}
                            </span>
                            <span className="text-[10px] text-slate-400">Đơn giá tham khảo</span>
                          </div>

                          <div className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-700">
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

              {/* Company & Contact Information */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Building2 className="w-4 h-4 text-survey-600" />
                  <span>Thông Tin Đơn Vị Yêu Cầu Báo Giá</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tên Công Ty / Viện Khảo Sát / Ban QLDA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="vd: Công ty CP Tư vấn Khảo sát Địa chất Miền Bắc"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mã Số Thuế (MST)
                    </label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="vd: 0108892341 (để xuất hóa đơn VAT)"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Người Liên Hệ / Kỹ Sư Phụ Trách <span className="text-red-500">*</span>
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số Điện Thoại / Zalo Nhận Báo Giá <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="vd: 0912.345.678"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Nhận File Báo Giá Bản Mềm
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vd: khao-sat@congty.vn"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Địa Bàn Dự Án / Tỉnh Thành Thực Hiện
                    </label>
                    <input
                      type="text"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      placeholder="vd: Hà Giang, Cao tốc Bắc - Nam, Đồng Nai..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Field test checkbox */}
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fieldTestRequired}
                      onChange={(e) => setFieldTestRequired(e.target.checked)}
                      className="w-4 h-4 rounded text-survey-600 focus:ring-survey-500"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Yêu cầu kỹ sư mang máy đo thử nghiệm tại thực địa công trình trước khi ký hợp đồng
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500">
                  Cam kết gửi bản dự toán chiết khấu chính thức trong vòng <strong className="text-slate-800">15 phút</strong>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || quoteItems.length === 0}
                  className="px-6 py-2.5 bg-survey-600 hover:bg-survey-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md shadow-survey-600/30 flex items-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Đang xử lý...' : 'Xuất Báo Giá Kỹ Thuật'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Printable Official Quotation Document Preview */
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm print:p-0 print:border-none print:shadow-none space-y-6">
              {/* Top Quotation Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-wider">
                    CÔNG TY CP THIẾT BỊ TRẮC ĐỊA GEOSURVEY PRO
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Đại lý ủy quyền chính thức: Leica Geosystems, Trimble, Topcon, CHCNAV
                  </p>
                  <p className="text-xs text-slate-600">
                    Trụ sở: Tòa nhà Hateco Apollo, Đ. Xuân Phương, Q. Nam Từ Liêm, TP. Hà Nội
                  </p>
                  <p className="text-xs text-slate-600">
                    Hotline: 0988.355.688 | MST: 0109988221 | Web: geosurvey.vn
                  </p>
                </div>

                <div className="text-right text-xs">
                  <div className="font-bold text-sm text-survey-600">BÁO GIÁ THIẾT BỊ ĐO ĐẠC</div>
                  <div className="text-slate-500">Số: <strong>{quoteCode}</strong></div>
                  <div className="text-slate-500">Ngày: {formatDateVN(new Date())}</div>
                  <div className="text-emerald-600 font-semibold mt-1">Hiệu lực: 30 ngày</div>
                </div>
              </div>

              {/* Customer Info Section */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs grid grid-cols-2 gap-2">
                <div>
                  <strong>Đơn vị nhận báo giá:</strong> {companyName || 'Quý Công Ty'}
                </div>
                <div>
                  <strong>Mã số thuế:</strong> {taxId || 'Đang cập nhật'}
                </div>
                <div>
                  <strong>Người phụ trách:</strong> {contactName || 'Kỹ sư trắc địa'}
                </div>
                <div>
                  <strong>Điện thoại:</strong> {phone || '0988...'}
                </div>
                {projectLocation && (
                  <div className="col-span-2">
                    <strong>Địa bàn dự án:</strong> {projectLocation}
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-300">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300 text-center w-10">STT</th>
                      <th className="p-2 border-r border-slate-300">Tên Thiết Bị & Cấu Hình Kỹ Thuật</th>
                      <th className="p-2 border-r border-slate-300 text-center w-16">ĐVT</th>
                      <th className="p-2 border-r border-slate-300 text-center w-16">SL</th>
                      <th className="p-2 border-r border-slate-300 text-right w-28">Đơn Giá (VNĐ)</th>
                      <th className="p-2 text-right w-32">Thành Tiền (VNĐ)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {quoteItems.map((item, idx) => {
                      const unitPrice = item.product.salePrice || item.product.basePrice;
                      const lineTotal = unitPrice * item.quantity;
                      return (
                        <tr key={item.product.id}>
                          <td className="p-2 border-r border-slate-200 text-center">{idx + 1}</td>
                          <td className="p-2 border-r border-slate-200">
                            <strong className="text-slate-900 block">{item.product.name}</strong>
                            <span className="text-[11px] text-slate-500">
                              Hãng: {item.product.brand.name} | Xuất xứ: {item.product.origin} | BH: {item.product.warrantyMonths}T
                            </span>
                            {item.product.specs.channels && (
                              <div className="text-[10px] text-survey-600 font-medium">
                                • {item.product.specs.channels} Kênh đa vệ tinh | IMU 60°
                              </div>
                            )}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center">Bộ</td>
                          <td className="p-2 border-r border-slate-200 text-center font-bold">{item.quantity}</td>
                          <td className="p-2 border-r border-slate-200 text-right">
                            {item.product.isQuoteOnly ? 'Giá dự án' : formatVND(unitPrice)}
                          </td>
                          <td className="p-2 text-right font-bold text-slate-900">
                            {item.product.isQuoteOnly ? 'Theo hợp đồng' : formatVND(lineTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {subtotal > 0 && (
                    <tfoot className="border-t-2 border-slate-400 bg-slate-50 font-bold text-xs">
                      <tr>
                        <td colSpan={5} className="p-2 text-right border-r border-slate-200">
                          Cộng tiền hàng (chưa VAT):
                        </td>
                        <td className="p-2 text-right">{formatVND(subtotal)}</td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="p-2 text-right border-r border-slate-200">
                          Thuế GTGT (VAT 10%):
                        </td>
                        <td className="p-2 text-right">{formatVND(vatAmount)}</td>
                      </tr>
                      <tr className="text-sm bg-survey-50 text-survey-900 font-black">
                        <td colSpan={5} className="p-2.5 text-right border-r border-slate-200">
                          TỔNG CỘNG THANH TOÁN (ĐÃ VAT):
                        </td>
                        <td className="p-2.5 text-right text-survey-700">{formatVND(totalAmount)}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {/* Terms & Certification Commitments */}
              <div className="border border-slate-200 p-3.5 rounded-lg text-[11px] text-slate-600 space-y-1">
                <strong className="text-slate-800 block text-xs">Điều khoản thương mại & Kỹ thuật:</strong>
                <p>1. <strong>Bảo hành & Hiệu chuẩn:</strong> Bảo hành chính hãng 24-36 tháng. Kèm giấy kiểm định Vilas 110 / Quatest 1 có giá trị pháp lý nghiệm thu công trình.</p>
                <p>2. <strong>Giao hàng & Chuyển giao:</strong> Giao hàng miễn phí toàn quốc. Kỹ sư trắc địa trực tiếp hướng dẫn đo thực địa tại dự án.</p>
                <p>3. <strong>Hỗ trợ liên tục:</strong> Cung cấp tài khoản Trạm CORS Cục Đo Đạc Bản Đồ miễn phí trọn đời (cho dòng RTK).</p>
                {fieldTestRequired && (
                  <p className="text-emerald-700 font-bold">
                    ✓ Đã xác nhận: Hỗ trợ mang máy đo thử tại hiện trường trước khi đặt cọc nghiệm thu.
                  </p>
                )}
              </div>

              {/* Signatures & Stamp */}
              <div className="flex justify-between items-end pt-4">
                <div className="text-center text-xs">
                  <p className="font-bold text-slate-800">ĐẠI DIỆN KHÁCH HÀNG</p>
                  <p className="text-[10px] text-slate-400 mt-1">(Ký & Ghi rõ họ tên)</p>
                  <div className="h-16" />
                  <p className="text-slate-700 font-semibold">{contactName || '............................'}</p>
                </div>

                <div className="text-center text-xs relative">
                  <p className="font-bold text-slate-800">ĐẠI DIỆN GEOSURVEY PRO</p>
                  <p className="text-[10px] text-slate-400 mt-1">Giám Đốc Kỹ Thuật Trắc Địa</p>
                  {/* Simulated Digital Stamp */}
                  <div className="w-24 h-24 rounded-full border-2 border-red-600 text-red-600 flex flex-col items-center justify-center p-1 text-[8px] font-black uppercase rotate-[-12deg] opacity-80 mx-auto my-1 pointer-events-none">
                    <span>★ ĐÃ XÁC THỰC ★</span>
                    <span className="text-[9px]">GEOSURVEY</span>
                    <span>CHIẾT KHẤU DỰ ÁN</span>
                  </div>
                  <p className="text-slate-900 font-bold">KS. Nguyễn Quốc Tuấn</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="no-print pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  ← Quay lại chỉnh sửa
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>In / Lưu PDF Báo Giá</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Hồ sơ báo giá đã được chuyển tới Giám đốc Dự án!', 'success');
                      setQuoteModalOpen(false);
                    }}
                    className="px-4 py-2 bg-survey-600 hover:bg-survey-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác Nhận & Gửi Hotline</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
