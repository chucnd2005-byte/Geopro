import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroBanner from '@/components/home/HeroBanner';
import ProductCard from '@/components/products/ProductCard';
import GearAdvisorWizard from '@/components/advisor/GearAdvisorWizard';
import { getAllProducts, getCategories, getBrands } from '@/lib/db-service';
import { FaqJsonLd } from '@/components/seo/JsonLd';
import {
  Satellite,
  Crosshair,
  Layers,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  BookOpen,
  FileCheck,
  Users,
  Compass,
} from 'lucide-react';

export default async function HomePage() {
  const products = await getAllProducts();
  const categories = await getCategories();
  const brands = await getBrands();

  const rtkProducts = products.filter((p) => p.category.slug === 'may-dinh-vi-gnss-rtk');
  const tsProducts = products.filter((p) => p.category.slug === 'may-toan-dac-dien-tu');
  const levelProducts = products.filter((p) => p.category.slug === 'may-thuy-binh-tu-dong');
  const accessoryProducts = products.filter((p) => p.category.slug === 'phu-kien-trac-dia');

  const faqs = [
    {
      question: 'Máy định vị RTK GNSS có bắt được tín hiệu tốt dưới tán cây và khe hẹp không?',
      answer:
        'Các dòng máy RTK thế hệ mới như CHCNAV i73+ hay Leica GS18 T trang bị hơn 1408 kênh và thuật toán chống nhiễu đa đường dẫn (Multipath), kết hợp theo dõi đồng thời vệ tinh BeiDou-3, GPS, GLONASS, Galileo. Máy cho phép đạt trạng thái Fixed nhanh và giữ tín hiệu ổn định ngay cả dưới tán cây râm mát và chân taluy cao.',
    },
    {
      question: 'Thiết bị mua tại GeoSurvey Pro có được cấp giấy kiểm định Quatest để nghiệm thu dự án không?',
      answer:
        'Tất cả máy toàn đạc, máy RTK, máy thủy bình xuất kho đều được dán tem kiểm định và cấp Giấy Chứng Nhận Hiệu Chuẩn Đo Lường (Vilas 110 / Quatest 1) có hiệu lực pháp lý toàn quốc, phục vụ đầy đủ hồ sơ nghiệm thu kỹ thuật và thanh quyết toán dự án.',
    },
    {
      question: 'Công ty có hỗ trợ mang máy đến thực địa công trình để đo thử trước khi ký hợp đồng không?',
      answer:
        'Có. Đội ngũ kỹ sư ứng dụng của GeoSurvey Pro sẵn sàng mang máy trực tiếp đến công trình của quý khách tại 63 tỉnh thành để đo kiểm chứng độ chính xác thực tế, hướng dẫn xuất số liệu và chuyển giao công nghệ hoàn toàn miễn phí.',
    },
    {
      question: 'Chính sách bảo hành và hỗ trợ khi thiết bị gặp sự cố tại công trường ra sao?',
      answer:
        'Bảo hành chính hãng 24 - 36 tháng. Trong trường hợp máy cần gửi về trung tâm bảo trì hoặc cân chỉnh bọt thủy, chúng tôi sẽ cấp ngay 01 máy đo tương đương để quý khách mượn sử dụng, đảm bảo tuyệt đối không làm gián đoạn tiến độ thi công của dự án.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Category Navigation Hub */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-survey-600">
              Phân Loại Thiết Bị Đo
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Danh Mục Thiết Bị Trắc Địa Chuyên Dụng
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-survey-600 hover:text-survey-700 flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>Xem tất cả danh mục</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/products?category=may-dinh-vi-gnss-rtk"
            className="group p-5 rounded-xl border border-slate-200 hover:border-survey-500 bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 text-survey-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Satellite className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-survey-600 transition-colors">
                Máy Định Vị GNSS RTK
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                1408 kênh, bù nghiêng IMU 60°, kết nối trạm CORS Cục Đo Đạc, radio 4W.
              </p>
            </div>
            <div className="text-[11px] font-bold text-survey-600 mt-4 flex items-center gap-1">
              <span>{rtkProducts.length} model thiết bị</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/products?category=may-toan-dac-dien-tu"
            className="group p-5 rounded-xl border border-slate-200 hover:border-cyan-500 bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-cyan-50 text-laser flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Crosshair className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-600 transition-colors">
                Máy Toàn Đạc Điện Tử
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Độ chính xác góc 1" - 2", EDM không gương 1000m, tự đo chiều cao AutoHeight.
              </p>
            </div>
            <div className="text-[11px] font-bold text-cyan-600 mt-4 flex items-center gap-1">
              <span>{tsProducts.length} model thiết bị</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/products?category=may-thuy-binh-tu-dong"
            className="group p-5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                Máy Thủy Bình Tự Động
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Độ phóng đại 24x - 30x, sai số 0.7mm/km, con lắc từ tính chống rung động.
              </p>
            </div>
            <div className="text-[11px] font-bold text-emerald-600 mt-4 flex items-center gap-1">
              <span>{levelProducts.length} model thiết bị</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/products?category=phu-kien-trac-dia"
            className="group p-5 rounded-xl border border-slate-200 hover:border-amber-500 bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                Phụ Kiện Trắc Địa Cao Cấp
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Gương đơn, sào carbon 2.6m, chân nhôm nặng ISO 12858, pin sạc GEB221/BP-5S.
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-600 mt-4 flex items-center gap-1">
              <span>{accessoryProducts.length} phụ kiện</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Featured Flagship GNSS RTK Receivers */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-survey-600 uppercase tracking-wider">
              <Satellite className="w-3.5 h-3.5" />
              <span>Định Vị Vệ Tinh Độ Chính Xác Milimet</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Máy Định Vị GNSS RTK Bán Chạy Nhất 2026
            </h2>
          </div>
          <Link
            href="/products?category=may-dinh-vi-gnss-rtk"
            className="text-xs font-bold text-survey-600 hover:text-survey-700 flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>Xem tất cả máy RTK</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rtkProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Interactive Gear Advisor Wizard */}
      <section className="max-w-7xl mx-auto px-4">
        <GearAdvisorWizard />
      </section>

      {/* 5. Total Stations & Optical Levels Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-survey-600 uppercase tracking-wider">
              <Crosshair className="w-3.5 h-3.5" />
              <span>Đo Góc & Thủy Chuẩn Kỹ Thuật</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Máy Toàn Đạc Điện Tử & Máy Thủy Bình Tự Động
            </h2>
          </div>
          <Link
            href="/products?category=may-toan-dac-dien-tu"
            className="text-xs font-bold text-survey-600 hover:text-survey-700 flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>Xem máy toàn đạc</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...tsProducts, ...levelProducts].map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Precision Surveying Accessories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-survey-600">
              Phụ Kiện Tiêu Chuẩn Hiện Trường
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Gương, Sào Carbon, Chân Máy & Pin Sạc Dự Phòng
            </h2>
          </div>
          <Link
            href="/products?category=phu-kien-trac-dia"
            className="text-xs font-bold text-survey-600 hover:text-survey-700 flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>Xem phụ kiện</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Brand Partners Carousel / Grid */}
      <section className="bg-white border-y border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            Đại Lý Phân Phối Ủy Quyền Các Thương Hiệu Trắc Địa Hàng Đầu Thế Giới
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
            {brands.map((b) => (
              <div
                key={b.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center hover:border-survey-500 transition-colors"
              >
                <div className="font-bold text-xs text-slate-800">{b.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{b.country}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Technical FAQ Section with Schema.org */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-survey-600">
            Hỏi Đáp Chuyên Ngành
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Các Câu Hỏi Thường Gặp Về Thiết Bị Đo Đạc & Hiệu Chuẩn
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-survey-600 shrink-0 mt-0.5" />
                <span>{f.question}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-2 pl-6.5 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>

        <FaqJsonLd faqs={faqs} />
      </section>
    </div>
  );
}
