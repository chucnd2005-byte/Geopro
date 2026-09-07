'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/store/useStore';
import { formatVND } from '@/lib/format';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Satellite,
  Crosshair,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export default function GearAdvisorWizard() {
  const { openQuoteForProduct } = useAppStore();
  const [step, setStep] = useState(1);
  const [taskType, setTaskType] = useState('dia-chinh');
  const [environment, setEnvironment] = useState('cors-4g');
  const [budget, setBudget] = useState('tam-trung');

  // Recommendation logic
  let recommendation = {
    title: 'Máy Định Vị GNSS RTK CHCNAV i73+ (1408 Kênh)',
    subtitle: 'Lựa chọn số 1 cho đo đạc địa chính và khảo sát hiện trường đô thị',
    price: '68.000.000 ₫',
    image: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=800&q=80',
    slug: 'may-dinh-vi-gnss-rtk-chcnav-i73-plus',
    reason:
      'Với 1408 kênh và cảm biến bù nghiêng IMU 60°, model này kết nối cực nhanh với trạm CORS Cục Đo Đạc Bản Đồ qua 4G, đo tốt dưới tán cây và sát góc tường mà không cần cân bằng bọt thủy. Trọng lượng siêu nhẹ chỉ 0.73kg giúp giảm mệt mỏi khi đi tuyến dài.',
    highlights: ['1408 Kênh đa vệ tinh', 'IMU bù nghiêng 60°', 'Pin 15 giờ liên tục', 'Sổ tay Android LandStar 8'],
  };

  if (taskType === 'xay-dung' || budget === 'cao-cap') {
    recommendation = {
      title: 'Máy Toàn Đạc Điện Tử Leica FlexLine TS07 (1" / 2")',
      subtitle: 'Chuẩn mực kỹ thuật cho công trình cao tầng, cầu đường và ngầm',
      price: 'Liên hệ báo giá dự án',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      slug: 'may-toan-dac-dien-tu-leica-flexline-ts07',
      reason:
        'Trang bị công nghệ AutoHeight tự động đo chiều cao máy đầu tiên trên thế giới, độ chính xác góc 1" tiêu chuẩn quốc tế và khả năng đo không gương 1000m. Thiết bị đáp ứng các yêu cầu kiểm định khắt khe nhất của tư vấn giám sát.',
      highlights: ['Độ chính xác góc 1"', 'Đo không gương 1000m', 'Tự đo chiều cao AutoHeight', 'Bù trục 4 phương'],
    };
  } else if (taskType === 'san-lap' || budget === 'tiet-kiem') {
    recommendation = {
      title: 'Máy Thủy Bình Tự Động Sokkia B40A (Chính Hãng Nhật Bản)',
      subtitle: 'Bền bỉ vô địch trên công trường san lấp và giao thông',
      price: '5.400.000 ₫',
      image: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=800&q=80',
      slug: 'may-thuy-binh-tu-dong-sokkia-b40a',
      reason:
        'Con lắc từ tính giảm chấn giúp triệt tiêu hoàn toàn rung chấn từ xe lu và máy ủi hoạt động xung quanh. Độ phóng đại 24x và sai số 1.5mm/km là giải pháp kinh tế và chuẩn xác hàng đầu cho công tác dẫn mốc cao độ.',
      highlights: ['Độ phóng đại 24x', 'Sai số 1.5mm/km', 'Giảm chấn từ tính chống rung', 'Tặng kèm chân + mia nhôm'],
    };
  } else if (environment === 'rung-nui') {
    recommendation = {
      title: 'Máy Định Vị GNSS RTK South Galaxy G1 Plus (Radio 4W)',
      subtitle: 'Chuyên trị vùng sâu vùng xa, không phụ thuộc trạm phát sóng 4G',
      price: '59.000.000 ₫',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      slug: 'may-dinh-vi-gnss-rtk-south-galaxy-g1-plus',
      reason:
        'Công suất phát Radio UHF trong cực mạnh 4W truyền xa tới 15km giúp trạm Base và Rover liên lạc thông suốt trong thung lũng đồi núi hiểm trở nơi sóng điện thoại chập chờn. Pin kép thay nóng giữ máy hoạt động liên tục suốt ca đo.',
      highlights: ['1598 Kênh SoC', 'Radio trong 4W phát xa 15km', 'Pin kép thay nóng', 'IMU 60° không từ tính'],
    };
  }

  return (
    <div id="advisor-section" className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-survey-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-laser/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-2xl mb-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-survey-500/10 border border-survey-500/30 text-survey-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hệ Thống Đề Xuất Cấu Hình Trắc Địa Chuẩn Xác</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Chưa Rõ Nên Đầu Tư Thiết Bị Nào Phù Hợp Với Dự Án?
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
          Trả lời 3 câu hỏi nhanh dưới đây. Kỹ sư trưởng GeoSurvey Pro sẽ gợi ý model máy và cấu hình trạm đo có tỷ suất hiệu quả / chi phí tối ưu nhất cho bạn.
        </p>
      </div>

      {/* Steps Progress */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              step >= i ? 'bg-survey-500' : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Loại công việc */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h4 className="text-sm font-bold text-slate-200">
            Bước 1: Mục đích chính công tác đo đạc của bạn là gì?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setTaskType('dia-chinh');
                setStep(2);
              }}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                taskType === 'dia-chinh'
                  ? 'bg-survey-600/20 border-survey-500 text-white'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <Satellite className="w-6 h-6 text-survey-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-white">Đo Đạc Địa Chính & Bản Đồ Địa Hình</strong>
                <p className="text-[11px] text-slate-400 mt-1">Đo ranh giới thửa đất, cắm mốc quy hoạch, khảo sát hiện trạng tỷ lệ lớn.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setTaskType('xay-dung');
                setStep(2);
              }}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                taskType === 'xay-dung'
                  ? 'bg-survey-600/20 border-survey-500 text-white'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <Crosshair className="w-6 h-6 text-laser shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-white">Thi Công Xây Dựng & Công Trình Ngầm</strong>
                <p className="text-[11px] text-slate-400 mt-1">Gửi mốc tim trục, quan trắc độ nghiêng nhà cao tầng, đường hầm, cầu cảng.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setTaskType('san-lap');
                setStep(2);
              }}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                taskType === 'san-lap'
                  ? 'bg-survey-600/20 border-survey-500 text-white'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <Layers className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-white">San Lấp Mặt Bằng & Dẫn Mốc Cao Độ</strong>
                <p className="text-[11px] text-slate-400 mt-1">Đo lưới độ cao thủy chuẩn hạng III - IV, kiểm tra cốt cao độ đổ bê tông sàn.</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Môi trường đo */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <h4 className="text-sm font-bold text-slate-200">
            Bước 2: Điều kiện hạ tầng và thực địa công trường?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setEnvironment('cors-4g');
                setStep(3);
              }}
              className="p-4 rounded-xl border bg-slate-800/60 border-slate-700 hover:border-survey-500 text-left transition-all"
            >
              <strong className="block text-xs font-bold text-white">Khu Vực Có Sóng 4G (Trạm CORS Quốc Gia)</strong>
              <p className="text-[11px] text-slate-400 mt-1">Chỉ cần dùng 01 máy Rover kết nối mạng VNGEONET hoặc Base 4G tư nhân.</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setEnvironment('rung-nui');
                setStep(3);
              }}
              className="p-4 rounded-xl border bg-slate-800/60 border-slate-700 hover:border-survey-500 text-left transition-all"
            >
              <strong className="block text-xs font-bold text-white">Vùng Rừng Núi, Thung Lũng Mất Sóng Di Động</strong>
              <p className="text-[11px] text-slate-400 mt-1">Cần trọn bộ Base + Rover truyền tín hiệu Radio nội bộ công suất cao 4W-35W.</p>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mt-2"
          >
            ← Quay lại bước trước
          </button>
        </div>
      )}

      {/* Step 3: Ngân sách */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <h4 className="text-sm font-bold text-slate-200">
            Bước 3: Dự toán ngân sách đầu tư thiết bị của bạn?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setBudget('tiet-kiem');
                setStep(4);
              }}
              className="p-4 rounded-xl border bg-slate-800/60 border-slate-700 hover:border-survey-500 text-left transition-all"
            >
              <strong className="block text-xs font-bold text-white">Dưới 20 Triệu</strong>
              <p className="text-[11px] text-slate-400 mt-1">Ưu tiên máy thủy bình tự động cao cấp kèm trọn bộ phụ kiện chân mia.</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setBudget('tam-trung');
                setStep(4);
              }}
              className="p-4 rounded-xl border bg-slate-800/60 border-slate-700 hover:border-survey-500 text-left transition-all"
            >
              <strong className="block text-xs font-bold text-white">50 - 90 Triệu</strong>
              <p className="text-[11px] text-slate-400 mt-1">Bộ máy RTK Pocket GNSS 1408 kênh, bù nghiêng IMU 60° bắt trọn vệ tinh.</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setBudget('cao-cap');
                setStep(4);
              }}
              className="p-4 rounded-xl border bg-slate-800/60 border-slate-700 hover:border-survey-500 text-left transition-all"
            >
              <strong className="block text-xs font-bold text-white">Trên 100 Triệu</strong>
              <p className="text-[11px] text-slate-400 mt-1">Dòng cao cấp Leica / Trimble, máy toàn đạc 1" hoặc trọn bộ Base + Rover.</p>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mt-2"
          >
            ← Quay lại bước trước
          </button>
        </div>
      )}

      {/* Step 4: Output Recommendation */}
      {step === 4 && (
        <div className="bg-slate-800/90 border border-survey-500/40 rounded-xl p-6 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative w-full md:w-56 aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
              <Image src={recommendation.image} alt={recommendation.title} fill className="object-cover" />
            </div>

            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cấu Hình Tối Ưu Nhất Cho Nhu Cầu Của Bạn</span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-white">{recommendation.title}</h4>
              <p className="text-xs text-survey-400 font-semibold">{recommendation.subtitle}</p>

              <div className="text-sm font-bold text-white">
                Giá tham khảo: <span className="text-survey-400">{recommendation.price}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-700/50">
                <strong>Lý do lựa chọn:</strong> {recommendation.reason}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {recommendation.highlights.map((h, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-700 text-slate-200 px-2 py-1 rounded font-medium">
                    ✓ {h}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  href={`/products/${recommendation.slug}`}
                  className="px-4 py-2 bg-survey-600 hover:bg-survey-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-survey-600/30"
                >
                  <span>Xem Chi Tiết Máy & Kiểm Định</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Chọn lại tiêu chí</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
