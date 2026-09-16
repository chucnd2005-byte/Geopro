'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  Package,
  PlusCircle,
  FileSpreadsheet,
  ShoppingCart,
  Image,
  FileText,
  ExternalLink,
  X,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { name: 'Bảng Điều Khiển Tổng Quan', href: '/admin/dashboard', icon: LayoutDashboard, category: 'Điều Hướng' },
    { name: 'Danh Sách Thiết Bị & Sản Phẩm', href: '/admin/products', icon: Package, category: 'Sản Phẩm' },
    { name: 'Thêm Thiết Bị Đo Đạc Mới', href: '/admin/products/new', icon: PlusCircle, category: 'Sản Phẩm' },
    { name: 'Yêu Cầu Báo Giá Doanh Nghiệp (B2B)', href: '/admin/quotes', icon: FileSpreadsheet, category: 'Kinh Doanh' },
    { name: 'Quản Lý Đơn Hàng & Xuất Kho', href: '/admin/orders', icon: ShoppingCart, category: 'Kinh Doanh' },
    { name: 'Thư Viện Media & Chứng Chỉ Kiểm Định PDF', href: '/admin/media', icon: Image, category: 'Tài Nguyên' },
    { name: 'Quản Lý Banner & Bài Viết SEO CMS', href: '/admin/content', icon: FileText, category: 'Nội Dung' },
    { name: 'Xem Giao Diện Cửa Hàng (Storefront)', href: '/', icon: ExternalLink, category: 'Hệ Thống' },
  ];

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    onClose();
    if (href === '/') {
      window.open('/', '_blank');
    } else {
      router.push(href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in text-white">
        {/* Input */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm nhanh module, chức năng... (Esc để thoát)"
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-2 max-h-80 overflow-y-auto divide-y divide-slate-800/50">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              Không tìm thấy lệnh hoặc trang nào phù hợp với "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.href)}
                  className="w-full p-2.5 rounded-lg hover:bg-slate-800/80 transition-colors flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-survey-400 group-hover:bg-survey-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white block">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono group-hover:text-slate-400">
                    Jump →
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
          <span>Điều hướng nhanh với phím tắt <strong>Cmd + K</strong> hoặc <strong>Ctrl + K</strong></span>
          <span>GeoSurvey Pro Admin</span>
        </div>
      </div>
    </div>
  );
}
