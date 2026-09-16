'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DynamicSpecBuilder from './DynamicSpecBuilder';
import RichTextEditor from './RichTextEditor';
import FileUpload from './FileUpload';
import { createProductAction, updateProductAction, validateOrGenerateSlugAction } from '@/app/actions/admin/products';
import { slugify } from '@/lib/utils/slugify';
import {
  Save,
  ArrowLeft,
  UploadCloud,
  FileText,
  Plus,
  Trash2,
  Package,
  Layers,
  Sparkles,
  Link as LinkIcon,
  RefreshCw,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Star,
  Eye,
  Paperclip,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  initialProduct?: any;
  categories: any[];
  brands: any[];
}

export default function ProductForm({ initialProduct, categories, brands }: Props) {
  const router = useRouter();
  const isEdit = !!initialProduct;

  // Basic Info
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [brandId, setBrandId] = useState(initialProduct?.brandId || (brands[0]?.id || ''));
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || (categories[0]?.id || ''));
  const [origin, setOrigin] = useState(initialProduct?.origin || 'Trung Quốc');
  const [condition, setCondition] = useState(initialProduct?.condition || 'NEW_100');
  const [warrantyMonths, setWarrantyMonths] = useState(initialProduct?.warrantyMonths || 24);

  // Pricing & Inventory
  const [basePrice, setBasePrice] = useState(initialProduct?.basePrice || 68000000);
  const [salePrice, setSalePrice] = useState(initialProduct?.salePrice || '');
  const [stock, setStock] = useState(initialProduct?.stock || 10);
  const [isQuoteOnly, setIsQuoteOnly] = useState(initialProduct?.isQuoteOnly || false);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);

  // Media
  const [mainImage, setMainImage] = useState(
    initialProduct?.mainImage ||
    'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=800&q=80'
  );
  const [gallery, setGallery] = useState<string[]>(
    initialProduct?.gallery ? JSON.parse(initialProduct.gallery) : [mainImage]
  );

  // Descriptions
  const [shortDesc, setShortDesc] = useState(
    initialProduct?.shortDesc || 'Đầu thu GNSS RTK thế hệ mới trang bị cảm biến bù nghiêng IMU 60°.'
  );
  const [fullDesc, setFullDesc] = useState(
    initialProduct?.fullDesc ||
    '<h2>Giới thiệu sản phẩm</h2><p>Thiết bị trắc địa chính xác cao phục vụ đo đạc địa chính và công trình giao thông.</p>'
  );

  // Highlights & Package checklist
  const [highlights, setHighlights] = useState<string[]>(
    initialProduct?.highlights
      ? JSON.parse(initialProduct.highlights)
      : ['1408 Kênh đa vệ tinh', 'Bù nghiêng IMU 60°', 'Pin 15h liên tục']
  );
  const [standardPackage, setStandardPackage] = useState<string[]>(
    initialProduct?.standardPackage
      ? JSON.parse(initialProduct.standardPackage)
      : ['01 Thân máy chính', '01 Sổ tay điều khiển', '01 Sào đo carbon 2.2m', '01 Hộp máy chống sốc']
  );

  // Specs & Downloads
  const [specs, setSpecs] = useState(initialProduct?.specs || {});
  const [downloads, setDownloads] = useState<any[]>(
    initialProduct?.downloads || [
      {
        title: 'Catalog Thông Số Kỹ Thuật (PDF)',
        docType: 'CATALOG_PDF',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: '3.2 MB',
      },
    ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAutoSlug, setIsAutoSlug] = useState(!isEdit || !initialProduct?.slug);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugSuggestion, setSlugSuggestion] = useState<string | null>(null);

  // Auto-generate slug from name in real-time
  const handleNameChange = (val: string) => {
    setName(val);
    if (isAutoSlug) {
      const generated = slugify(val);
      setSlug(generated);
      checkSlugUniqueness(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setIsAutoSlug(false);
    setSlug(val);
    checkSlugUniqueness(val);
  };

  const handleToggleAutoSlug = () => {
    const nextAuto = !isAutoSlug;
    setIsAutoSlug(nextAuto);
    if (nextAuto) {
      const generated = slugify(name);
      setSlug(generated);
      checkSlugUniqueness(generated);
    }
  };

  const checkSlugUniqueness = async (slugToCheck: string) => {
    if (!slugToCheck || slugToCheck.trim().length < 2) return;
    setSlugChecking(true);
    try {
      const res = await validateOrGenerateSlugAction(slugToCheck, initialProduct?.id);
      if (res.success && res.uniqueSlug && res.uniqueSlug !== slugToCheck) {
        setSlugSuggestion(res.uniqueSlug);
      } else {
        setSlugSuggestion(null);
      }
    } catch (e) {
      // ignore
    } finally {
      setSlugChecking(false);
    }
  };

  const handleAddHighlight = () => setHighlights([...highlights, '']);
  const handleRemoveHighlight = (idx: number) => setHighlights(highlights.filter((_, i) => i !== idx));

  const handleAddPackageItem = () => setStandardPackage([...standardPackage, '']);
  const handleRemovePackageItem = (idx: number) => setStandardPackage(standardPackage.filter((_, i) => i !== idx));

  const handleAddDownload = () => {
    setDownloads([
      ...downloads,
      { title: 'Giấy Kiểm Định Quatest 1', docType: 'CALIBRATION_CERT', fileUrl: '', fileSize: '2.0 MB' },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const payload = {
      name,
      slug,
      sku,
      brandId,
      categoryId,
      basePrice: Number(basePrice),
      salePrice: salePrice ? Number(salePrice) : null,
      stock: Number(stock),
      condition,
      origin,
      warrantyMonths: Number(warrantyMonths),
      isQuoteOnly,
      isFeatured,
      mainImage,
      gallery,
      shortDesc,
      fullDesc,
      highlights: highlights.filter((h) => h.trim()),
      standardPackage: standardPackage.filter((p) => p.trim()),
      specs,
      downloads,
    };

    try {
      const res = isEdit
        ? await updateProductAction(initialProduct.id, payload)
        : await createProductAction(payload);

      if (res.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Thao tác không thành công.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi hệ thống');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">
              {isEdit ? `Chỉnh Sửa Thiết Bị: ${initialProduct.name}` : 'Thêm Thiết Bị Đo Đạc Mới'}
            </h1>
            <p className="text-xs text-slate-400">
              Nhập cấu hình thông số kỹ thuật, hồ sơ kiểm định và giá bán thiết bị.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-survey-600 hover:bg-survey-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-survey-600/30 flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Đang lưu...' : isEdit ? 'Lưu Thay Đổi' : 'Đăng Sản Phẩm'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
          {errorMessage}
        </div>
      )}

      {/* 1. Basic Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
          1. Thông Tin Định Danh & Phân Loại
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-bold mb-1">Tên Thiết Bị Đo <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="vd: Máy Định Vị GNSS RTK CHCNAV i73+"
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:ring-1 focus:ring-survey-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Mã SKU Thiết Bị <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="RTK-CHCNAV-I73P"
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-slate-300 font-bold text-xs flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-survey-400" />
                  <span>Đường Dẫn SEO Slug URL</span>
                  <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isAutoSlug
                      ? 'bg-survey-500/15 text-survey-400 border border-survey-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isAutoSlug ? 'Tự động tạo từ tên' : 'Tùy chỉnh thủ công'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleAutoSlug}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  {isAutoSlug ? (
                    <>
                      <Lock className="w-3 h-3 text-survey-400" />
                      <span>Khóa tự động</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 text-amber-400" />
                      <span>Mở tự động từ tên</span>
                    </>
                  )}
                </button>
                {name && (
                  <button
                    type="button"
                    onClick={() => {
                      const gen = slugify(name);
                      setSlug(gen);
                      setIsAutoSlug(true);
                      checkSlugUniqueness(gen);
                    }}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Tạo lại slug từ tên thiết bị"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="may-dinh-vi-gnss-rtk-chcnav-i73-plus"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-survey-500 focus:outline-none"
              />
              {slugChecking && (
                <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 animate-pulse">
                  Đang kiểm tra trùng lặp...
                </span>
              )}
            </div>

            {/* Live SEO URL Preview */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
              <div className="flex items-center gap-1 truncate">
                <span className="text-slate-500">Xem trước URL:</span>
                <span className="font-mono text-survey-400">
                  https://geopro.vn/products/{slug || '...'}
                </span>
              </div>

              {slugSuggestion ? (
                <div className="text-amber-400 flex items-center gap-1 text-[11px]">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Slug gốc đã tồn tại, hệ thống sẽ tự gắn đuôi: <strong className="font-mono">{slugSuggestion}</strong></span>
                </div>
              ) : slug ? (
                <div className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Slug hợp lệ & chuẩn SEO</span>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Hãng Sản Xuất <span className="text-red-500">*</span></label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.country})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Danh Mục Trắc Địa <span className="text-red-500">*</span></label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Xuất Xứ Thiết Bị</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Thụy Sĩ, Nhật Bản, Trung Quốc..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Tình Trạng Hàng Hóa</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
            >
              <option value="NEW_100">Mới 100% Nguyên Hộp</option>
              <option value="REFURBISHED_99">Lướt 99% (Bảo hành như mới)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Thời Hạn Bảo Hành (Tháng)</label>
            <input
              type="number"
              value={warrantyMonths}
              onChange={(e) => setWarrantyMonths(parseInt(e.target.value) || 24)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. Pricing & B2B Options */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
          2. Giá Bán & Chính Sách Báo Giá Dự Án
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Giá Niêm Yết (VNĐ) <span className="text-red-500">*</span></label>
            <input
              type="number"
              required
              value={basePrice}
              onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Giá Khuyến Mãi (VNĐ)</label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="Để trống nếu không giảm"
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Số Lượng Tồn Kho (Bộ)</label>
            <input
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-6 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isQuoteOnly}
              onChange={(e) => setIsQuoteOnly(e.target.checked)}
              className="w-4 h-4 rounded text-survey-600 focus:ring-survey-500"
            />
            <span className="font-bold text-amber-400">
              Bật chế độ "Nhận Báo Giá Dự Án B2B" (Ẩn giá bán lẻ, ưu tiên đấu thầu)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-survey-600 focus:ring-survey-500"
            />
            <span className="font-bold text-survey-400">
              Đánh dấu sản phẩm Nổi Bật / Bán Chạy trên trang chủ
            </span>
          </label>
        </div>
      </div>

      {/* 3. Media & Visuals (Direct Local Upload to Cloud Storage CDN) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-survey-400" />
              <span>3. Hình Ảnh & Bộ Sưu Tập Thiết Bị (Direct Cloud Upload)</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tải ảnh trực tiếp từ máy tính cá nhân lên Cloud CDN. Tự động nén WebP dưới 500KB chuẩn Core Web Vitals.
            </p>
          </div>
        </div>

        {/* 3.1 Main Primary Image */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <span>Ảnh Đại Diện Chính (Primary Instrument Photo)</span>
              <span className="text-red-500">*</span>
            </label>
            {mainImage && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Đã chọn ảnh chính
              </span>
            )}
          </div>

          {mainImage ? (
            <div className="flex flex-col sm:flex-row items-start gap-4 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <div className="relative w-40 h-28 sm:w-48 sm:h-32 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 shadow-md">
                <Image src={mainImage} alt="Main Preview" fill className="object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-survey-600 text-white font-bold text-[9px] uppercase tracking-wider rounded shadow">
                  Ảnh chính
                </span>
              </div>

              <div className="flex-1 space-y-2 text-xs">
                <div className="font-mono text-[11px] text-slate-300 break-all bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {mainImage}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMainImage('')}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa / Thay ảnh chính khác</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <FileUpload
              accept="image"
              multiple={false}
              folder="products"
              label="Kéo thả hoặc nhấp để tải Ảnh Đại Diện Chính từ máy tính"
              helperText="Hỗ trợ JPG, PNG, WebP tối đa 15MB. Tự động chuyển đổi sang WebP nén tối ưu hiển thị nhanh."
              onUploadComplete={(url) => {
                setMainImage(url);
                if (!gallery.includes(url)) {
                  setGallery((prev) => [url, ...prev]);
                }
              }}
            />
          )}
        </div>

        {/* 3.2 Multi-Image Gallery */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <div>
              <label className="font-bold text-slate-200">
                Thư Viện Ảnh Đa Góc Độ (Product Gallery - Tải Nhiều Ảnh)
              </label>
              <p className="text-[11px] text-slate-400">
                Tải lên nhiều ảnh chụp góc cạnh, vali đựng máy, sổ tay điều khiển, phụ kiện đi kèm.
              </p>
            </div>
            <span className="text-[11px] font-mono text-survey-400 font-bold bg-survey-500/10 px-2.5 py-0.5 rounded border border-survey-500/30">
              {gallery.length} ảnh trong bộ sưu tập
            </span>
          </div>

          {/* Multiple File Uploader Zone */}
          <FileUpload
            accept="image"
            multiple={true}
            folder="products"
            label="Kéo thả nhiều ảnh cùng lúc hoặc nhấp để tải bộ sưu tập từ thiết bị"
            helperText="Có thể chọn hoặc kéo thả nhiều tệp ảnh cùng lúc. Tất cả sẽ được lưu trữ an toàn trên Cloud CDN."
            onMultipleUploadComplete={(urls) => {
              setGallery((prev) => Array.from(new Set([...prev, ...urls])));
            }}
          />

          {/* Gallery Thumbnails Grid with Remove & Make Primary Buttons */}
          {gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
              {gallery.map((imgUrl, idx) => {
                const isPrimary = imgUrl === mainImage;
                return (
                  <div
                    key={idx}
                    className={`group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border transition-all ${
                      isPrimary
                        ? 'border-survey-500 ring-2 ring-survey-500/40'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <Image src={imgUrl} alt={`Gallery ${idx + 1}`} fill className="object-cover" />

                    {/* Primary Badge */}
                    {isPrimary && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-survey-600 text-white font-bold text-[9px] uppercase rounded shadow z-10">
                        Chính
                      </span>
                    )}

                    {/* Hover Controls Overlay */}
                    <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => setMainImage(imgUrl)}
                          className="w-full py-1 bg-survey-600 hover:bg-survey-500 text-white text-[10px] font-bold rounded flex items-center justify-center gap-1 shadow"
                        >
                          <Star className="w-3 h-3" />
                          <span>Đặt làm ảnh chính</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const updated = gallery.filter((_, i) => i !== idx);
                          setGallery(updated);
                          if (isPrimary && updated.length > 0) {
                            setMainImage(updated[0]);
                          } else if (isPrimary) {
                            setMainImage('');
                          }
                        }}
                        className="w-full py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 text-[10px] font-bold rounded flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa ảnh</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Dynamic Technical Specs Builder */}
      <DynamicSpecBuilder
        categoryType={categories.find((c) => c.id === categoryId)?.slug || 'GNSS_RTK'}
        initialSpecs={specs}
        onChange={setSpecs}
      />

      {/* 5. Rich Text Description & Checklists */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
          5. Mô Tả Chi Tiết & Danh Mục Bàn Giao
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Tóm Tắt Ngắn (Mô tả hiển thị trên thẻ card)</label>
          <textarea
            rows={2}
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">Bài Viết & Hướng Dẫn Đo Đạc Thực Địa (WYSIWYG Editor)</label>
          <RichTextEditor value={fullDesc} onChange={setFullDesc} />
        </div>

        {/* Highlights */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">Điểm Nổi Bật (Highlights)</label>
            <button
              type="button"
              onClick={handleAddHighlight}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-survey-400 rounded text-[11px] font-semibold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Thêm điểm
            </button>
          </div>
          {highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={h}
                onChange={(e) => {
                  const updated = [...highlights];
                  updated[i] = e.target.value;
                  setHighlights(updated);
                }}
                className="flex-1 p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
              <button
                type="button"
                onClick={() => handleRemoveHighlight(i)}
                className="p-2 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Standard Package Checklist */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">Trọn Bộ Phụ Kiện Hộp Máy (Standard Package)</label>
            <button
              type="button"
              onClick={handleAddPackageItem}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-survey-400 rounded text-[11px] font-semibold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Thêm phụ kiện
            </button>
          </div>
          {standardPackage.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...standardPackage];
                  updated[i] = e.target.value;
                  setStandardPackage(updated);
                }}
                className="flex-1 p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
              <button
                type="button"
                onClick={() => handleRemovePackageItem(i)}
                className="p-2 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Technical Downloads & PDF Attachment */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-sm font-bold text-white">
            6. Tài Liệu Kỹ Thuật & Giấy Kiểm Định Vilas / Quatest 1
          </h2>
          <button
            type="button"
            onClick={handleAddDownload}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-survey-400 rounded text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Tài Liệu
          </button>
        </div>

        <div className="space-y-3">
          {downloads.map((d, i) => (
            <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-[10px] mb-1">Tiêu đề tài liệu</label>
                <input
                  type="text"
                  value={d.title}
                  onChange={(e) => {
                    const up = [...downloads];
                    up[i].title = e.target.value;
                    setDownloads(up);
                  }}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Loại tài liệu</label>
                <select
                  value={d.docType}
                  onChange={(e) => {
                    const up = [...downloads];
                    up[i].docType = e.target.value;
                    setDownloads(up);
                  }}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="CATALOG_PDF">Catalog PDF</option>
                  <option value="CALIBRATION_CERT">Chứng Nhận Kiểm Định</option>
                  <option value="USER_MANUAL">Hướng Dẫn Sử Dụng</option>
                  <option value="FIRMWARE">Firmware Cập Nhật</option>
                </select>
              </div>

              <div className="sm:col-span-4 pt-2 border-t border-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-1 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-survey-400" />
                      <span>Tệp Hồ Sơ PDF ({d.fileSize || 'Chưa tải tệp'})</span>
                    </span>
                    {d.fileUrl && (
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Đã đính kèm tệp
                      </span>
                    )}
                  </div>

                  {d.fileUrl ? (
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="font-mono text-[11px] text-slate-300 truncate flex-1">
                        {d.fileUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const up = [...downloads];
                          up[i].fileUrl = '';
                          setDownloads(up);
                        }}
                        className="p-1 text-slate-400 hover:text-red-400"
                        title="Đổi tệp PDF khác"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <FileUpload
                      accept="pdf"
                      folder="certificates"
                      label={`Tải tệp PDF ${d.title || 'kiểm định'} từ máy tính`}
                      helperText="Hỗ trợ PDF tối đa 15MB. Lưu trữ vĩnh viễn trên Cloud CDN."
                      onUploadComplete={(url, fileData) => {
                        const up = [...downloads];
                        up[i].fileUrl = url;
                        if (fileData?.size) {
                          up[i].fileSize = `${(fileData.size / (1024 * 1024)).toFixed(1)} MB`;
                        }
                        setDownloads(up);
                      }}
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setDownloads(downloads.filter((_, idx) => idx !== i))}
                  className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 self-end sm:self-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa mục</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Footer */}
      <div className="flex justify-end gap-3 pt-4">
        <Link
          href="/admin/products"
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
        >
          Hủy Bỏ
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-survey-600 hover:bg-survey-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-survey-600/30 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Đang lưu...' : isEdit ? 'Cập Nhật Thiết Bị' : 'Xuất Bản Sản Phẩm'}</span>
        </button>
      </div>
    </form>
  );
}
