import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  FileCheck,
  CheckCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* 4 Core Guarantees Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-survey-500/10 border border-survey-500/30 flex items-center justify-center text-survey-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Chính Hãng</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Nhập khẩu ủy quyền Leica, Trimble, Topcon, CHCNAV đầy đủ CO/CQ.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Kiểm Định Quatest 1</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Cấp tem & giấy hiệu chuẩn kiểm định có giá trị pháp lý nghiệm thu dự án.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Cho Mượn Máy Dự Phòng</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Không gián đoạn công trình: cấp máy đo thay thế trong thời gian bảo hành.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Đo Thử Tại Công Trình</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Kỹ sư mang máy đến tận thực địa đo thử, hướng dẫn chuyển giao kỹ thuật.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
        {/* Col 1: About & Headquarters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-survey-600 flex items-center justify-center text-white font-black text-sm">
              GS
            </div>
            <span className="text-lg font-black tracking-wider text-white">
              GEOSURVEY <span className="text-survey-500">PRO</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Hệ thống phân phối thiết bị trắc địa, máy định vị vệ tinh GNSS RTK, máy toàn đạc điện tử và dịch vụ kiểm định hiệu chuẩn đo lường hàng đầu Việt Nam. Đối tác tin cậy của hơn 1.200 nhà thầu, viện khảo sát quy hoạch và công ty tư vấn địa chính.
          </p>

          <div className="space-y-2 pt-2 text-slate-300">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-survey-400 shrink-0" />
              <span>Tư vấn kỹ thuật 24/7: <strong className="text-white">0988.355.688</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-survey-400 shrink-0" />
              <span>Email báo giá dự án: <strong className="text-white">duan@geosurvey.vn</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-survey-400 shrink-0" />
              <span>Thời gian làm việc: 07:30 - 18:30 (Thứ 2 - Thứ 7, Hỗ trợ kỹ thuật thực địa 24/7)</span>
            </div>
          </div>
        </div>

        {/* Col 2: Service Centers */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider text-survey-400">
            Hệ Thống Chi Nhánh
          </h4>
          <div className="space-y-3 text-slate-400">
            <div>
              <strong className="text-slate-200 block">Hà Nội (Trụ sở & TT Kiểm định):</strong>
              <span className="text-[11px]">Tòa Hateco Apollo, Đ. Xuân Phương, Q. Nam Từ Liêm, TP. Hà Nội</span>
            </div>
            <div>
              <strong className="text-slate-200 block">Đà Nẵng (Văn phòng Miền Trung):</strong>
              <span className="text-[11px]">Số 268 Nguyễn Tri Phương, Q. Hải Châu, TP. Đà Nẵng</span>
            </div>
            <div>
              <strong className="text-slate-200 block">TP. Hồ Chí Minh (Kho & Showroom):</strong>
              <span className="text-[11px]">Số 120 Đường số 7, KDC Cityland, P. 7, Q. Gò Vấp, TP. HCM</span>
            </div>
          </div>
        </div>

        {/* Col 3: Categories */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider text-survey-400">
            Danh Mục Thiết Bị
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/products?category=may-dinh-vi-gnss-rtk" className="hover:text-white transition-colors">
                Máy Định Vị GNSS RTK
              </Link>
            </li>
            <li>
              <Link href="/products?category=may-toan-dac-dien-tu" className="hover:text-white transition-colors">
                Máy Toàn Đạc Điện Tử
              </Link>
            </li>
            <li>
              <Link href="/products?category=may-thuy-binh-tu-dong" className="hover:text-white transition-colors">
                Máy Thủy Bình Tự Động
              </Link>
            </li>
            <li>
              <Link href="/products?category=phu-kien-trac-dia" className="hover:text-white transition-colors">
                Gương Đơn & Sào Gương Carbon
              </Link>
            </li>
            <li>
              <Link href="/products?category=phu-kien-trac-dia" className="hover:text-white transition-colors">
                Chân Máy Hợp Kim & Pin Dự Phòng
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Dịch Vụ & Pháp Lý */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider text-survey-400">
            Dịch Vụ Kỹ Thuật
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Hiệu chuẩn kiểm định máy trắc địa</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Cho thuê máy RTK & Toàn đạc</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Sửa chữa bảo dưỡng thiết bị đo</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Chuyển giao công nghệ bay chụp UAV</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Cài đặt trạm CORS Cục Đo Đạc</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 bg-black py-4 px-4 text-center text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 GeoSurvey Pro. Giấy phép hoạt động đo đạc bản đồ số 082/GP-BDĐ. Bản quyền thuộc về GeoSurvey Pro.</span>
          <div className="flex items-center gap-4">
            <Link href="/quote" className="text-slate-400 hover:text-white">Báo Giá VAT</Link>
            <Link href="/products" className="text-slate-400 hover:text-white">Sản Phẩm</Link>
            <span>Phòng Đo Lường Chuẩn ISO/IEC 17025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
