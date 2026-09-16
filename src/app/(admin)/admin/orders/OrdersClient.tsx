'use client';

import React, { useState } from 'react';
import { formatVND, formatDateVN } from '@/lib/format';
import { updateOrderStatusAction, deleteOrderAction } from '@/app/actions/admin/orders';
import {
  ShoppingCart,
  Truck,
  Building2,
  Trash2,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  FileCheck,
} from 'lucide-react';

interface Props {
  initialOrders: any[];
}

export default function OrdersClient({ initialOrders }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Chờ Duyệt', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    PROCESSING: { label: 'Đang Chuẩn Bị', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    CALIBRATING: { label: 'Kiểm Định Quatest', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    SHIPPED: { label: 'Đang Giao Hàng', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    COMPLETED: { label: 'Hoàn Thành', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    CANCELLED: { label: 'Đã Hủy', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateOrderStatusAction(id, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa đơn hàng "${code}"?`)) {
      const res = await deleteOrderAction(id);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
      }
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'Tất Cả' },
            { id: 'PENDING', label: 'Chờ Duyệt' },
            { id: 'PROCESSING', label: 'Đang Chuẩn Bị' },
            { id: 'CALIBRATING', label: 'Kiểm Định Quatest' },
            { id: 'SHIPPED', label: 'Đang Giao' },
            { id: 'COMPLETED', label: 'Hoàn Thành' },
            { id: 'CANCELLED', label: 'Đã Hủy' },
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
              {s.label} ({s.id === 'all' ? orders.length : orders.filter((o) => o.status === s.id).length})
            </button>
          ))}
        </div>

        <div className="text-slate-400">
          Tổng số: <strong className="text-survey-400">{filteredOrders.length}</strong> đơn hàng
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Mã Đơn / Ngày</th>
                <th className="p-3.5">Khách Hàng & Địa Chỉ</th>
                <th className="p-3.5">Thiết Bị Đã Đặt</th>
                <th className="p-3.5">Tổng Tiền / VAT</th>
                <th className="p-3.5 text-center">Tiến Độ / Trạng Thái</th>
                <th className="p-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((o) => {
                const badge = statusMap[o.status] || { label: o.status, color: 'bg-slate-800 text-slate-300' };

                return (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Code */}
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-survey-400 text-xs">{o.orderCode}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{formatDateVN(o.createdAt)}</div>
                    </td>

                    {/* Customer */}
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-white truncate">{o.customerName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{o.phone} • {o.city}</div>
                      {o.vatInvoiceRequested && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-bold">
                          Xuất VAT Công Ty
                        </span>
                      )}
                    </td>

                    {/* Items */}
                    <td className="p-3.5">
                      <div className="space-y-1 max-w-xs">
                        {o.items?.map((it: any) => (
                          <div key={it.id} className="text-slate-300 truncate">
                            • <strong className="text-white">{it.quantity}x</strong> {it.product.name}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-200 text-sm">{formatVND(o.totalAmount)}</div>
                      <div className="text-[11px] text-slate-400">
                        {o.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Thanh toán COD'}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-3.5 text-center">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${badge.color} bg-slate-950`}
                      >
                        <option value="PENDING">Chờ Duyệt</option>
                        <option value="PROCESSING">Đang Chuẩn Bị</option>
                        <option value="CALIBRATING">Kiểm Định Quatest</option>
                        <option value="SHIPPED">Đang Giao Hàng</option>
                        <option value="COMPLETED">Hoàn Thành</option>
                        <option value="CANCELLED">Đã Hủy</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveOrder(o)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Chi Tiết
                        </button>
                        <button
                          onClick={() => handleDelete(o.id, o.orderCode)}
                          className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
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

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4 animate-fade-in text-white text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm">Chi Tiết Đơn Hàng: {activeOrder.orderCode}</h3>
                <span className="text-slate-400 text-[11px]">Ngày đặt: {formatDateVN(activeOrder.createdAt)}</span>
              </div>
              <button onClick={() => setActiveOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div><strong>Người nhận:</strong> {activeOrder.customerName} ({activeOrder.phone})</div>
              <div><strong>Địa chỉ:</strong> {activeOrder.address}, {activeOrder.city}</div>
              {activeOrder.note && <div><strong>Ghi chú:</strong> {activeOrder.note}</div>}
              {activeOrder.vatInvoiceRequested && (
                <div className="pt-2 border-t border-slate-800 text-amber-400">
                  <div><strong>Xuất VAT công ty:</strong> {activeOrder.companyName}</div>
                  <div><strong>Mã số thuế:</strong> {activeOrder.companyTaxId}</div>
                  <div><strong>Địa chỉ:</strong> {activeOrder.companyAddress}</div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <strong>Danh sách thiết bị:</strong>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
                {activeOrder.items?.map((it: any) => (
                  <div key={it.id} className="p-2.5 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">{it.product.name}</div>
                      <div className="text-[10px] text-slate-400">SL: {it.quantity} bộ</div>
                    </div>
                    <div className="font-bold text-slate-200">{formatVND(it.lineTotal)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-sm">
              <span className="font-bold">Tổng thanh toán:</span>
              <span className="font-black text-survey-500 text-base">{formatVND(activeOrder.totalAmount)}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveOrder(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
