'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore } from '@/store/useStore';
import { formatVND } from '@/lib/format';
import {
  ShieldCheck,
  Building2,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Home,
  ChevronRight,
  QrCode,
  CreditCard,
  Banknote,
} from 'lucide-react';

export default function CheckoutPage() {
  const { cart, clearCart, showToast } = useAppStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [note, setNote] = useState('');
  const [vatRequested, setVatRequested] = useState(false);
  const [companyTaxId, setCompanyTaxId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'COD'>('BANK_TRANSFER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.salePrice || item.product.basePrice;
    return acc + price * item.quantity;
  }, 0);

  const vatAmount = vatRequested ? subtotal * 0.1 : 0;
  const totalAmount = subtotal + vatAmount;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address || !city) {
      showToast('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const code = `GEO-${Date.now().toString().slice(-6)}`;
      setIsSubmitting(false);
      setOrderComplete(code);
      clearCart();
      showToast('Đặt hàng thành công! Kỹ sư GeoSurvey Pro sẽ liên hệ xác nhận trong 10 phút.', 'success');
    }, 900);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Đặt Hàng Thành Công!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Cảm ơn bạn đã tin tưởng GeoSurvey Pro. Đơn hàng của bạn đã được tiếp nhận và chuyển đến bộ phận kỹ thuật để kiểm định bọt thủy, hiệu chuẩn máy trước khi đóng gói.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-left space-y-2 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-slate-500">Mã đơn hàng:</span>
            <span className="font-mono font-bold text-slate-900">{orderComplete}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Khách hàng:</span>
            <span className="font-bold text-slate-900">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Số điện thoại:</span>
            <span className="font-bold text-slate-900">{phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Địa chỉ giao:</span>
            <span className="font-bold text-slate-900">{address}, {city}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
            <span className="font-bold text-slate-900">Tổng thanh toán:</span>
            <span className="font-black text-survey-600">{formatVND(totalAmount)}</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <Link
            href="/products"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
          >
            Tiếp Tục Xem Sản Phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Trang chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Thanh Toán & Đặt Hàng</span>
      </nav>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Thông Tin Giao Hàng & Thanh Toán
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Miễn phí vận chuyển toàn quốc cho máy đo và phụ kiện trắc địa chính hãng.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Receiver Info */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-survey-600" />
              <span>Địa Chỉ Nhận Thiết Bị</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và Tên Người Nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="vd: Kỹ sư Nguyễn Văn A"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số Điện Thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email (Để nhận hóa đơn điện tử)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa Chỉ Cụ Thể (Số nhà, đường, công trình) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="vd: Ban điều hành dự án Cao tốc, Km 24..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tỉnh / Thành Phố <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Hà Nội, Quảng Ninh, Đà Nẵng, TP. Hồ Chí Minh..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi Chú Đơn Hàng</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="vd: Giao giờ hành chính, cần dán tem kiểm định hiệu chuẩn mới..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Corporate VAT Invoice option */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={vatRequested}
                onChange={(e) => setVatRequested(e.target.checked)}
                className="w-4 h-4 rounded text-survey-600 focus:ring-survey-500"
              />
              <span className="text-xs font-bold text-slate-900">
                Xuất Hóa Đơn Điện Tử VAT (10%) Cho Công Ty / Dự Án
              </span>
            </label>

            {vatRequested && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên Công Ty Trên Hóa Đơn</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Công ty CP Đo đạc Bản đồ..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã Số Thuế (MST)</label>
                  <input
                    type="text"
                    value={companyTaxId}
                    onChange={(e) => setCompanyTaxId(e.target.value)}
                    placeholder="0108..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Địa Chỉ Đăng Ký Kinh Doanh</label>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Số 10 đường..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-survey-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Phương Thức Thanh Toán</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-survey-500 bg-survey-50/40 text-survey-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                  className="mt-1 text-survey-600"
                />
                <div>
                  <strong className="text-xs block font-bold">Chuyển Khoản Ngân Hàng (QR Code)</strong>
                  <span className="text-[11px] text-slate-500">Nhận thông tin tài khoản công ty xuất hóa đơn</span>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-survey-500 bg-survey-50/40 text-survey-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-survey-600"
                />
                <div>
                  <strong className="text-xs block font-bold">Thanh Toán Khi Nhận Hàng (COD)</strong>
                  <span className="text-[11px] text-slate-500">Được kiểm tra máy và bọt thủy trước khi thanh toán</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Tóm Tắt Đơn Hàng ({cart.length})</h2>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-10 h-10 rounded bg-slate-50 border overflow-hidden shrink-0">
                      <Image src={item.product.mainImage} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-[11px] text-slate-400">SL: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 shrink-0">
                    {formatVND((item.product.salePrice || item.product.basePrice) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-semibold text-slate-900">{formatVND(subtotal)}</span>
              </div>
              {vatRequested && (
                <div className="flex justify-between text-slate-600">
                  <span>Thuế VAT (10%):</span>
                  <span className="font-semibold text-slate-900">{formatVND(vatAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-600">
                <span>Phí vận chuyển:</span>
                <span className="font-bold">Miễn Phí Toàn Quốc</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-900">Tổng thanh toán:</span>
                <span className="font-black text-survey-600">{formatVND(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-3.5 bg-survey-600 hover:bg-survey-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-survey-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang xác thực...' : 'Xác Nhận Đặt Hàng'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
