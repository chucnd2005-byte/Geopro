'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { deleteMediaAction, updateMediaAltAction } from '@/app/actions/admin/media';
import {
  UploadCloud,
  FileText,
  Copy,
  Trash2,
  Edit2,
  Check,
  Search,
  Filter,
  Folder,
  X,
  ExternalLink,
  Plus,
  RefreshCw,
} from 'lucide-react';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  folder: string;
  altText: string | null;
  createdAt: string | Date;
}

export default function MediaManagerPage() {
  const [medias, setMedias] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFolder, setUploadFolder] = useState('products');
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Edit Alt Modal state
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [altInput, setAltInput] = useState('');

  const fetchMedias = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/upload?folder=${selectedFolder}`);
      const data = await res.json();
      if (data.success) {
        setMedias(data.medias);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedias();
  }, [selectedFolder]);

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa file media này khỏi hệ thống?')) {
      const res = await deleteMediaAction(id);
      if (res.success) {
        setMedias((prev) => prev.filter((m) => m.id !== id));
      }
    }
  };

  const handleUpdateAlt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;
    const res = await updateMediaAltAction(editingMedia.id, altInput);
    if (res.success) {
      setMedias((prev) =>
        prev.map((m) => (m.id === editingMedia.id ? { ...m, altText: altInput } : m))
      );
      setEditingMedia(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('folder', uploadFolder);
      formData.append('altText', uploadAlt);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMedias((prev) => [data.media, ...prev]);
        setIsUploadModalOpen(false);
        setUploadFile(null);
        setUploadAlt('');
      } else {
        alert(data.error || 'Tải lên không thành công');
      }
    } catch (err) {
      alert('Lỗi kết nối trong quá trình upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredMedias = medias.filter((m) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.originalName.toLowerCase().includes(q) || m.filename.toLowerCase().includes(q);
      const matchAlt = m.altText?.toLowerCase().includes(q);
      return matchName || matchAlt;
    }
    return true;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Quản Lý Thư Viện Media & Chứng Chỉ PDF
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Lưu trữ ảnh thiết bị trắc địa, file giấy kiểm định Quatest 1 / Vilas 110 và catalog kỹ thuật.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMedias}
            className="p-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs transition-colors"
            title="Làm mới"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-survey-600 hover:bg-survey-500 text-white text-xs font-bold rounded-xl shadow-md shadow-survey-600/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tải Lên File Mới</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Folder Navigation */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Tất Cả' },
            { id: 'products', label: 'Ảnh Thiết Bị' },
            { id: 'catalogs', label: 'Chứng Chỉ & PDF' },
            { id: 'banners', label: 'Banner Quảng Cáo' },
            { id: 'articles', label: 'Ảnh Bài Viết' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedFolder === f.id
                  ? 'bg-survey-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên file, alt text..."
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-950/60 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-survey-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs animate-pulse">
          Đang tải danh sách media...
        </div>
      ) : filteredMedias.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl space-y-3">
          <UploadCloud className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-400">Chưa có file nào trong thư mục này</p>
          <p className="text-xs text-slate-500">Bấm nút "Tải Lên File Mới" để thêm ảnh hoặc tài liệu PDF kiểm định.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedias.map((item) => {
            const isPdf = item.mimeType === 'application/pdf' || item.filename.endsWith('.pdf');

            return (
              <div
                key={item.id}
                className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-survey-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                  {isPdf ? (
                    <div className="flex flex-col items-center justify-center text-red-400 p-3 text-center space-y-1">
                      <FileText className="w-10 h-10" />
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 px-1.5 py-0.5 rounded">
                        PDF DOC
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.altText || item.originalName}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Folder Badge */}
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-[9px] font-mono text-survey-400 border border-slate-700">
                    {item.folder}
                  </span>
                </div>

                {/* Details */}
                <div className="p-2.5 space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-200 truncate" title={item.originalName}>
                    {item.originalName}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{formatFileSize(item.size)}</span>
                    <span className="text-survey-500/80">{item.altText ? 'Alt ✓' : 'Thiếu Alt'}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => handleCopyUrl(item)}
                      className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${
                        copiedId === item.id
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Sao chép đường dẫn URL"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        setEditingMedia(item);
                        setAltInput(item.altText || '');
                      }}
                      className="p-1.5 text-slate-400 hover:text-survey-400 hover:bg-slate-800 rounded transition-colors"
                      title="Chỉnh sửa Alt-Text (SEO)"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                      title="Mở tab mới"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                      title="Xóa media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-fade-in text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm">Tải Lên File Media / Chứng Chỉ Mới</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Chọn Thư Mục</label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="products">Sản Phẩm (Ảnh máy đo, thiết bị)</option>
                  <option value="catalogs">Chứng Chỉ Kiểm Định & Catalog PDF</option>
                  <option value="banners">Banner Khuyến Mãi & Hero</option>
                  <option value="articles">Bài Viết & Hướng Dẫn Kỹ Thuật</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">File Ảnh Hoặc Tài Liệu PDF</label>
                <input
                  type="file"
                  required
                  accept="image/*,.pdf"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-survey-600 file:text-white hover:file:bg-survey-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Mô Tả Alt-Text (Tối ưu Google Image SEO)
                </label>
                <input
                  type="text"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="vd: Giấy kiểm định Quatest 1 máy RTK CHCNAV i73+..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-survey-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadFile}
                  className="px-5 py-2 bg-survey-600 hover:bg-survey-500 disabled:opacity-50 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isUploading ? 'Đang tải lên...' : 'Bắt Đầu Upload'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Alt Modal */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-fade-in text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm">Chỉnh Sửa Alt-Text SEO</h3>
              <button onClick={() => setEditingMedia(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAlt} className="space-y-4 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Mô tả ảnh chính xác với từ khóa kỹ thuật giúp hình ảnh thiết bị dễ dàng lên Top Google Image Search.
              </p>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Nội Dung Alt-Text</label>
                <textarea
                  rows={3}
                  required
                  value={altInput}
                  onChange={(e) => setAltInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-survey-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-survey-600 hover:bg-survey-500 text-white font-bold rounded-lg"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
