'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import SerpPreview from '@/components/admin/SerpPreview';
import RichTextEditor from '@/components/admin/RichTextEditor';
import {
  createBannerAction,
  deleteBannerAction,
  createArticleAction,
  deleteArticleAction,
} from '@/app/actions/admin/content';
import {
  FileText,
  Image as ImageIcon,
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Sparkles,
  Tag,
  BookOpen,
} from 'lucide-react';

interface Props {
  initialBanners: any[];
  initialArticles: any[];
}

export default function ContentClient({ initialBanners, initialArticles }: Props) {
  const [activeTab, setActiveTab] = useState<'banners' | 'articles' | 'serp'>('banners');

  // Banners state
  const [banners, setBanners] = useState(initialBanners);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80');
  const [newBannerTarget, setNewBannerTarget] = useState('/products?category=may-dinh-vi-gnss-rtk');
  const [newBannerBadge, setNewBannerBadge] = useState('KHUYẾN MÃI DỰ ÁN 2026');
  const [isAddingBanner, setIsAddingBanner] = useState(false);

  // Articles state
  const [articles, setArticles] = useState(initialArticles);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [artTitle, setArtTitle] = useState('');
  const [artSlug, setArtSlug] = useState('');
  const [artCategory, setArtCategory] = useState('Kỹ thuật RTK');
  const [artCover, setArtCover] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80');
  const [artExcerpt, setArtExcerpt] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artSeoTitle, setArtSeoTitle] = useState('');
  const [artSeoDesc, setArtSeoDesc] = useState('');

  // SERP Inspector Live Sandbox
  const [serpTitle, setSerpTitle] = useState('Máy Định Vị GNSS RTK 1408 Kênh Bù Nghiêng IMU 60° | GeoSurvey Pro');
  const [serpSlug, setSerpSlug] = useState('products/may-dinh-vi-gnss-rtk-chcnav-i73-plus');
  const [serpDesc, setSerpDesc] = useState(
    'Chuyên phân phối máy định vị GNSS RTK 1408 kênh bù nghiêng IMU 60 độ, máy toàn đạc 1 giây, máy thủy bình tự động chính hãng Leica, Topcon, CHCNAV. Đầy đủ tem kiểm định Quatest 1 nghiệm thu công trình.'
  );

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerImage) return;

    const res = await createBannerAction({
      title: newBannerTitle,
      subtitle: newBannerSubtitle,
      imageUrl: newBannerImage,
      targetUrl: newBannerTarget,
      badge: newBannerBadge,
    });

    if (res.success) {
      setBanners([...banners, res.banner]);
      setIsAddingBanner(false);
      setNewBannerTitle('');
      setNewBannerSubtitle('');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Xóa banner này khỏi trang chủ?')) {
      const res = await deleteBannerAction(id);
      if (res.success) {
        setBanners(banners.filter((b) => b.id !== id));
      }
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artSlug || !artContent) return;

    const res = await createArticleAction({
      title: artTitle,
      slug: artSlug,
      category: artCategory,
      coverImage: artCover,
      excerpt: artExcerpt,
      content: artContent,
      seoTitle: artSeoTitle || artTitle,
      seoDesc: artSeoDesc || artExcerpt,
    });

    if (res.success) {
      setArticles([res.article, ...articles]);
      setIsArticleModalOpen(false);
      setArtTitle('');
      setArtSlug('');
      setArtContent('');
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (confirm(`Xóa bài viết "${title}"?`)) {
      const res = await deleteArticleAction(id);
      if (res.success) {
        setArticles(articles.filter((a) => a.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('banners')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'banners' ? 'border-survey-500 text-survey-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Banner & Sliders Trang Chủ ({banners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'articles' ? 'border-survey-500 text-survey-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bài Viết & Kiến Thức Trắc Địa ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('serp')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'serp' ? 'border-survey-500 text-survey-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Visual Google SERP Inspector</span>
        </button>
      </div>

      {/* Tab 1: Banners */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Quản Lý Banner Quảng Cáo</h2>
              <p className="text-xs text-slate-400">Hiển thị trên slider đầu trang chủ và các chiến dịch trợ giá thiết bị.</p>
            </div>
            <button
              onClick={() => setIsAddingBanner(!isAddingBanner)}
              className="px-3.5 py-1.5 bg-survey-600 hover:bg-survey-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingBanner ? 'Đóng Form' : 'Thêm Banner Mới'}</span>
            </button>
          </div>

          {isAddingBanner && (
            <form onSubmit={handleCreateBanner} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tiêu Đề Banner <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    placeholder="Chiến Dịch Trợ Giá Thu Cũ Đổi Mới RTK..."
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tag Nhãn (Badge)</label>
                  <input
                    type="text"
                    value={newBannerBadge}
                    onChange={(e) => setNewBannerBadge(e.target.value)}
                    placeholder="KHUYẾN MÃI DỰ ÁN 2026"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Phụ Đề (Subtitle)</label>
                  <input
                    type="text"
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                    placeholder="Thu hồi máy cũ, trợ giá lên đến 15 triệu..."
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Đường Dẫn URL Ảnh Banner</label>
                  <input
                    type="text"
                    required
                    value={newBannerImage}
                    onChange={(e) => setNewBannerImage(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Liên Kết Đích (Target Link)</label>
                  <input
                    type="text"
                    required
                    value={newBannerTarget}
                    onChange={(e) => setNewBannerTarget(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-survey-600 hover:bg-survey-500 text-white font-bold rounded-lg"
                >
                  Lưu Banner
                </button>
              </div>
            </form>
          )}

          {/* Banners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                <div className="relative aspect-[21/9] bg-slate-950 overflow-hidden">
                  <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
                  {b.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-survey-600 text-white font-bold text-[9px] uppercase tracking-wider">
                      {b.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-white text-sm line-clamp-1">{b.title}</h4>
                  {b.subtitle && <p className="text-slate-400 text-xs line-clamp-2">{b.subtitle}</p>}
                  <div className="text-[11px] text-survey-400 font-mono truncate">Đích: {b.targetUrl}</div>

                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Articles */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Bài Viết Chuyên Ngành & Kinh Nghiệm Đo Đạc</h2>
              <p className="text-xs text-slate-400">Các bài viết chuẩn SEO chia sẻ kinh nghiệm sử dụng máy RTK và toàn đạc.</p>
            </div>
            <button
              onClick={() => setIsArticleModalOpen(true)}
              className="px-3.5 py-1.5 bg-survey-600 hover:bg-survey-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Viết Bài Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((art) => (
              <div key={art.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3 flex flex-col justify-between">
                <div className="flex gap-3">
                  <div className="relative w-24 h-20 rounded-lg bg-slate-950 overflow-hidden shrink-0">
                    <Image src={art.coverImage} alt={art.title} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-survey-400 text-[10px] font-bold">
                      {art.category}
                    </span>
                    <h4 className="font-bold text-xs text-white line-clamp-2 mt-1">{art.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{art.excerpt}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Tác giả: {art.author}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-400 font-semibold">Đã xuất bản</span>
                    <button
                      onClick={() => handleDeleteArticle(art.id, art.title)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Article Modal */}
          {isArticleModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl p-6 space-y-4 text-white text-xs max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm">Soạn Thảo Bài Viết Kỹ Thuật Trắc Địa</h3>
                  <button onClick={() => setIsArticleModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleCreateArticle} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Tiêu Đề Bài Viết</label>
                      <input
                        type="text"
                        required
                        value={artTitle}
                        onChange={(e) => {
                          setArtTitle(e.target.value);
                          const sl = e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
                          setArtSlug(sl);
                        }}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Chuyên Mục</label>
                      <select
                        value={artCategory}
                        onChange={(e) => setArtCategory(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      >
                        <option value="Kỹ thuật RTK">Kỹ thuật RTK</option>
                        <option value="Kinh nghiệm thực địa">Kinh nghiệm thực địa</option>
                        <option value="Đánh giá thiết bị">Đánh giá thiết bị</option>
                        <option value="Tiêu chuẩn kiểm định">Tiêu chuẩn kiểm định</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1">Đường Dẫn URL Slug</label>
                      <input
                        type="text"
                        required
                        value={artSlug}
                        onChange={(e) => setArtSlug(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1">Tóm Tắt Ngắn (Excerpt)</label>
                      <textarea
                        rows={2}
                        value={artExcerpt}
                        onChange={(e) => setArtExcerpt(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Nội Dung Bài Viết (WYSIWYG Editor)</label>
                    <RichTextEditor value={artContent} onChange={setArtContent} />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsArticleModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-survey-600 hover:bg-survey-500 text-white font-bold rounded-lg"
                    >
                      Xuất Bản Bài Viết
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Google SERP Preview Sandbox */}
      {activeTab === 'serp' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold text-white">Visual Google SERP Inspector</h2>
            <p className="text-xs text-slate-400">
              Kiểm tra trực quan đoạn trích tìm kiếm Google (Title Tag, Meta Description, URL Slug) theo thời gian thực.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
              <h3 className="font-bold text-white border-b border-slate-800 pb-2">
                Thông Số Thẻ Meta SEO Cần Kiểm Tra
              </h3>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Thẻ Tiêu Đề (SEO Title Tag)</label>
                <input
                  type="text"
                  value={serpTitle}
                  onChange={(e) => setSerpTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:ring-1 focus:ring-survey-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Đường Dẫn URL Con (Slug)</label>
                <input
                  type="text"
                  value={serpSlug}
                  onChange={(e) => setSerpSlug(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Thẻ Mô Tả (Meta Description)</label>
                <textarea
                  rows={4}
                  value={serpDesc}
                  onChange={(e) => setSerpDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white leading-relaxed focus:ring-1 focus:ring-survey-500"
                />
              </div>
            </div>

            {/* Live Visual Inspector */}
            <div>
              <SerpPreview
                title={serpTitle}
                slug={serpSlug}
                description={serpDesc}
                price={68000000}
                inStock={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
