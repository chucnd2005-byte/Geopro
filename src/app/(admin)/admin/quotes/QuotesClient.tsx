'use client';

import React, { useState } from 'react';
import { formatVND, formatDateVN } from '@/lib/format';
import { updateQuoteStatusAction, deleteQuoteAction } from '@/app/actions/admin/quotes';
import {
  FileSpreadsheet,
  Printer,
  Building2,
  Trash2,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  Send,
} from 'lucide-react';

interface Props {
  initialQuotes: any[];
}

export default function QuotesClient({ initialQuotes }: Props) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [previewQuote, setPreviewQuote] = useState<any | null>(null);

  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Chờ Xử Lý', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    CONTACTED: { label: 'Đã Liên Hệ', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    QUOTED: { label: 'Đã Gửi Báo Giá', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    WON: { label: 'Chốt Đơn Thành Công', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    LOST: { label: 'Đã Hủy / Thất Bại', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateQuoteStatusAction(id, newStatus);
    if (res.success) {
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ báo giá "${code}"?`)) {
      const res = await deleteQuoteAction(id);
      if (res.success) {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
      }
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    if (selectedStatus !== 'all' && q.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'Tất Cả' },
            { id: 'PENDING', label: 'Chờ Xử Lý' },
            { id: 'CONTACTED', label: 'Đã Liên Hệ' },
            { id: 'QUOTED', label: 'Đã Báo Giá' },
            { id: 'WON', label: 'Chốt Đơn' },
            { id: 'LOST', label: 'Hủy' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStatus(s.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedStatus === s.id
                  ? 'bg-survey-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {s.label} ({s.id === 'all' ? quotes.length : quotes.filter((q) => q.status === s.id).length})
            </button>
          ))}
        </div>

        <div className="text-slate-400">
          Hiển thị <strong className="text-survey-400">{filteredQuotes.length}</strong> hồ sơ báo giá
        </div>
      </div>

      {/* Quotations List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Mã / Ngày Tạo</th>
                <th className="p-3.5">Đơn Vị Khảo Sát & MST</th>
                <th className="p-3.5">Kỹ Sư Phụ Trách</th>
                <th className="p-3.5">Thiết Bị Yêu Cầu</th>
                <th className="p-3.5 text-center">Trạng Thái Xử Lý</th>
                <th className="p-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredQuotes.map((q) => {
                const badge = statusMap[q.status] || { label: q.status, color: 'bg-slate-800 text-slate-300' };

                return (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Code & Date */}
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-survey-400 text-xs">{q.quoteCode}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{formatDateVN(q.createdAt)}</div>
                    </td>

                    {/* Company */}
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-white line-clamp-1">{q.companyName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>MST: {q.taxId || 'Chưa cung cấp'}</span>
                        {q.projectLocation && <span>• {q.projectLocation}</span>}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200">{q.contactName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <a href={`tel:${q.phone}`} className="hover:text-survey-400">{q.phone}</a>
                        {q.email && <span>• {q.email}</span>}
                      </div>
                    </td>

                    {/* Items requested */}
                    <td className="p-3.5">
                      <div className="space-y-1 max-w-xs">
                        {q.items?.map((it: any) => (
                          <div key={it.id} className="text-slate-300 truncate">
                            • <strong className="text-white">{it.quantity}x</strong> {it.product.name}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-3.5 text-center">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${badge.color} bg-slate-950`}
                      >
                        <option value="PENDING">Chờ Xử Lý</option>
                        <option value="CONTACTED">Đã Liên Hệ</option>
                        <option value="QUOTED">Đã Gửi Báo Giá</option>
                        <option value="WON">Chốt Đơn</option>
                        <option value="LOST">Hủy Bỏ</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewQuote(q)}
                          className="px-2.5 py-1.5 bg-survey-600/20 hover:bg-survey-600 text-survey-400 hover:text-white border border-survey-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                          title="Xem trước & In phiếu báo giá chính thức"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Xuất Phiếu Báo Giá</span>
                        </button>

                        <button
                          onClick={() => handleDelete(q.id, q.quoteCode)}
                          className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                          title="Xóa hồ sơ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official PDF / Printable Quotation Modal */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 no-print">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-survey-600" />
                <h3 className="font-bold text-sm text-slate-900">Bản Xem Trước Phiếu Báo Giá Chính Thức</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>In / Lưu PDF</span>
                </button>
                <button onClick={() => setPreviewQuote(null)} className="p-1 text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document */}
            <div className="space-y-6 text-xs">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <h2 className="text-xl font-black tracking-wider text-slate-900">
                    CÔNG TY CP THIẾT BỊ TRẮC ĐỊA GEOSURVEY PRO
                  </h2>
                  <p className="text-slate-600 mt-0.5">Phân phối ủy quyền Leica, Trimble, Topcon, CHCNAV</p>
                  <p className="text-slate-600">Trụ sở: Tòa nhà Hateco Apollo, Đ. Xuân Phương, Nam Từ Liêm, Hà Nội</p>
                  <p className="text-slate-600">Hotline: 0988.355.688 | MST: 0109988221</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-survey-600">PHIẾU BÁO GIÁ DỰ ÁN</div>
                  <div className="text-slate-500 font-mono">Số: {previewQuote.quoteCode}</div>
                  <div className="text-slate-500">Ngày lập: {formatDateVN(previewQuote.createdAt)}</div>
                </div>
              </div>

              {/* Customer Box */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-2">
                <div><strong>Kính gửi đơn vị:</strong> {previewQuote.companyName}</div>
                <div><strong>Mã số thuế:</strong> {previewQuote.taxId || 'N/A'}</div>
                <div><strong>Người liên hệ:</strong> {previewQuote.contactName}</div>
                <div><strong>Điện thoại:</strong> {previewQuote.phone}</div>
                {previewQuote.projectLocation && (
                  <div className="col-span-2"><strong>Địa điểm dự án:</strong> {previewQuote.projectLocation}</div>
                )}
              </div>

              {/* Items Table */}
              <table className="w-full text-xs border border-slate-300">
                <thead className="bg-slate-100 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300 text-center w-10">STT</th>
                    <th className="p-2 border-r border-slate-300">Tên Thiết Bị & Cấu Hình</th>
                    <th className="p-2 border-r border-slate-300 text-center w-16">SL</th>
                    <th className="p-2 border-r border-slate-300 text-right w-28">Đơn Giá (VNĐ)</th>
                    <th className="p-2 text-right w-32">Thành Tiền (VNĐ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {previewQuote.items?.map((it: any, idx: number) => {
                    const price = it.requestedPrice || it.product.salePrice || it.product.basePrice;
                    return (
                      <tr key={it.id}>
                        <td className="p-2 text-center border-r border-slate-200">{idx + 1}</td>
                        <td className="p-2 border-r border-slate-200">
                          <strong>{it.product.name}</strong>
                          <div className="text-[11px] text-slate-500">
                            {it.product.brand.name} | SKU: {it.product.sku} | BH {it.product.warrantyMonths}T
                          </div>
                        </td>
                        <td className="p-2 text-center font-bold border-r border-slate-200">{it.quantity}</td>
                        <td className="p-2 text-right border-r border-slate-200">{formatVND(price)}</td>
                        <td className="p-2 text-right font-bold">{formatVND(price * it.quantity)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Signatures & Stamp */}
              <div className="flex justify-between items-end pt-4">
                <div className="text-center">
                  <p className="font-bold">ĐẠI DIỆN KHÁCH HÀNG</p>
                  <p className="text-[10px] text-slate-400 mt-1">(Ký & Ghi rõ họ tên)</p>
                  <div className="h-16" />
                  <p className="font-semibold">{previewQuote.contactName}</p>
                </div>

                <div className="text-center relative">
                  <p className="font-bold">ĐẠI DIỆN GEOSURVEY PRO</p>
                  <p className="text-[10px] text-slate-400 mt-1">Giám Đốc Kỹ Thuật Trắc Địa</p>
                  <div className="w-24 h-24 rounded-full border-2 border-red-600 text-red-600 flex flex-col items-center justify-center p-1 text-[8px] font-black uppercase rotate-[-12deg] opacity-80 mx-auto my-1 pointer-events-none">
                    <span>★ ĐÃ XÁC THỰC ★</span>
                    <span className="text-[9px]">GEOSURVEY</span>
                    <span>CHIẾT KHẤU DỰ ÁN</span>
                  </div>
                  <p className="font-bold">KS. Nguyễn Quốc Tuấn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
