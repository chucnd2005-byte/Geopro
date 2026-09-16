'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SiteSettingsData, HeaderMenuItem, ShowroomItem, FooterColumnItem, TrustBadgeItem } from '@/lib/settings';
import { updateSiteSettingsAction } from '@/app/actions/admin/settings';
import FileUpload from './FileUpload';
import {
  Settings,
  Image as ImageIcon,
  Menu,
  Building,
  MapPin,
  Share2,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  PhoneCall,
  Mail,
  ShieldCheck,
  Globe,
  Radio,
  Sparkles,
} from 'lucide-react';

interface Props {
  initialSettings: SiteSettingsData;
}

export default function SiteSettingsClient({ initialSettings }: Props) {
  const [activeTab, setActiveTab] = useState<'general' | 'header' | 'company' | 'showrooms' | 'footer'>('general');
  const [settings, setSettings] = useState<SiteSettingsData>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFieldChange = (field: keyof SiteSettingsData, val: any) => {
    setSettings((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    try {
      const res = await updateSiteSettingsAction(settings);
      if (res.success && res.settings) {
        setSettings(res.settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(res.error || 'Lưu cài đặt không thành công.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Menu Builder Helpers ---
  const handleAddMenuItem = () => {
    const newItem: HeaderMenuItem = {
      id: `m-${Date.now()}`,
      label: 'Mục Menu Mới',
      url: '/products',
      isDropdown: false,
      subItems: [],
    };
    setSettings((prev) => ({
      ...prev,
      headerMenu: [...prev.headerMenu, newItem],
    }));
  };

  const handleUpdateMenuItem = (index: number, field: keyof HeaderMenuItem, value: any) => {
    const updated = [...settings.headerMenu];
    updated[index] = { ...updated[index], [field]: value };
    setSettings((prev) => ({ ...prev, headerMenu: updated }));
  };

  const handleRemoveMenuItem = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      headerMenu: prev.headerMenu.filter((_, i) => i !== index),
    }));
  };

  const handleAddSubItem = (menuIndex: number) => {
    const updated = [...settings.headerMenu];
    const subItems = updated[menuIndex].subItems || [];
    updated[menuIndex].subItems = [...subItems, { label: 'Menu Con Mới', url: '/products' }];
    updated[menuIndex].isDropdown = true;
    setSettings((prev) => ({ ...prev, headerMenu: updated }));
  };

  const handleUpdateSubItem = (menuIndex: number, subIndex: number, field: 'label' | 'url', val: string) => {
    const updated = [...settings.headerMenu];
    const subItems = [...(updated[menuIndex].subItems || [])];
    subItems[subIndex] = { ...subItems[subIndex], [field]: val };
    updated[menuIndex].subItems = subItems;
    setSettings((prev) => ({ ...prev, headerMenu: updated }));
  };

  const handleRemoveSubItem = (menuIndex: number, subIndex: number) => {
    const updated = [...settings.headerMenu];
    const subItems = (updated[menuIndex].subItems || []).filter((_, i) => i !== subIndex);
    updated[menuIndex].subItems = subItems;
    if (subItems.length === 0) updated[menuIndex].isDropdown = false;
    setSettings((prev) => ({ ...prev, headerMenu: updated }));
  };

  // --- Showrooms Helpers ---
  const handleAddShowroom = () => {
    const newSr: ShowroomItem = {
      id: `sr-${Date.now()}`,
      branchName: 'Chi Nhánh Mới',
      address: 'Địa chỉ chi nhánh...',
      phone: '0988.355.688',
      googleMapsUrl: '',
    };
    setSettings((prev) => ({
      ...prev,
      showrooms: [...prev.showrooms, newSr],
    }));
  };

  const handleUpdateShowroom = (index: number, field: keyof ShowroomItem, val: string) => {
    const updated = [...settings.showrooms];
    updated[index] = { ...updated[index], [field]: val };
    setSettings((prev) => ({ ...prev, showrooms: updated }));
  };

  const handleRemoveShowroom = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      showrooms: prev.showrooms.filter((_, i) => i !== index),
    }));
  };

  // --- Footer Column Helpers ---
  const handleAddFooterColumn = () => {
    const newCol: FooterColumnItem = {
      title: 'Cột Liên Kết Mới',
      links: [{ label: 'Liên kết 1', url: '/products' }],
    };
    setSettings((prev) => ({
      ...prev,
      footerColumns: [...prev.footerColumns, newCol],
    }));
  };

  const handleUpdateFooterColumnTitle = (index: number, title: string) => {
    const updated = [...settings.footerColumns];
    updated[index] = { ...updated[index], title };
    setSettings((prev) => ({ ...prev, footerColumns: updated }));
  };

  const handleAddFooterLink = (colIndex: number) => {
    const updated = [...settings.footerColumns];
    updated[colIndex].links = [...updated[colIndex].links, { label: 'Liên kết mới', url: '/products' }];
    setSettings((prev) => ({ ...prev, footerColumns: updated }));
  };

  const handleUpdateFooterLink = (colIndex: number, linkIndex: number, field: 'label' | 'url', val: string) => {
    const updated = [...settings.footerColumns];
    const links = [...updated[colIndex].links];
    links[linkIndex] = { ...links[linkIndex], [field]: val };
    updated[colIndex].links = links;
    setSettings((prev) => ({ ...prev, footerColumns: updated }));
  };

  const handleRemoveFooterLink = (colIndex: number, linkIndex: number) => {
    const updated = [...settings.footerColumns];
    updated[colIndex].links = updated[colIndex].links.filter((_, i) => i !== linkIndex);
    setSettings((prev) => ({ ...prev, footerColumns: updated }));
  };

  const handleRemoveFooterColumn = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      footerColumns: prev.footerColumns.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header & Sticky Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl sticky top-20 z-30 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-survey-400 text-xs font-bold uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Trung Tâm Cấu Hình Toàn Cục</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Cài Đặt Website, Header & Footer</h1>
          <p className="text-xs text-slate-400">
            Cập nhật tức thì logo, thanh thông báo, số điện thoại hotline, showroom và pháp lý doanh nghiệp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã lưu & Revalidate Storefront!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-survey-600 hover:bg-survey-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-survey-600/30 flex items-center gap-2 transition-all group"
          >
            <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{isSaving ? 'Đang cập nhật...' : 'Lưu Thay Đổi (Revalidate)'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 border border-slate-800 rounded-2xl overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'general'
              ? 'bg-survey-600 text-white shadow-md shadow-survey-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>1. Logo & Nhận Diện</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'header'
              ? 'bg-survey-600 text-white shadow-md shadow-survey-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>2. Header & Menu Bar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'company'
              ? 'bg-survey-600 text-white shadow-md shadow-survey-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>3. Pháp Lý & Hotline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('showrooms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'showrooms'
              ? 'bg-survey-600 text-white shadow-md shadow-survey-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>4. Chi Nhánh Showroom ({settings.showrooms.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'footer'
              ? 'bg-survey-600 text-white shadow-md shadow-survey-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>5. Footer & Mạng Xã Hội</span>
        </button>
      </div>

      {/* TAB 1: General & Logo */}
      {activeTab === 'general' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">Cấu Hình Nhận Diện Thương Hiệu & Logo</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Thiết lập tên trang web, khẩu hiệu trắc địa và tải lên logo sắc nét chuẩn hiển thị đa thiết bị.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Tên Nền Tảng (Site Name)</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleFieldChange('siteName', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:ring-1 focus:ring-survey-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Khẩu Hiệu Thương Hiệu (Slogan)</label>
              <input
                type="text"
                value={settings.slogan}
                onChange={(e) => handleFieldChange('slogan', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-survey-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold mb-1.5">Mô Tả SEO Mặc Định (Meta Description)</label>
              <textarea
                rows={3}
                value={settings.metaDescription}
                onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white leading-relaxed focus:ring-1 focus:ring-survey-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Logo Uploaders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {/* Light Logo */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">Logo Giao Diện Sáng (Light Logo)</label>
              {settings.lightLogoUrl ? (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div className="relative w-36 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center overflow-hidden">
                    <Image src={settings.lightLogoUrl} alt="Light Logo" fill className="object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('lightLogoUrl', null)}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold"
                  >
                    Xóa Logo
                  </button>
                </div>
              ) : (
                <FileUpload
                  accept="image"
                  folder="branding"
                  label="Tải Logo Sáng từ máy tính"
                  helperText="Khuyên dùng PNG trong suốt hoặc SVG tỉ lệ ngang"
                  onUploadComplete={(url) => handleFieldChange('lightLogoUrl', url)}
                />
              )}
            </div>

            {/* Dark Logo */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">Logo Giao Diện Tối (Dark Logo)</label>
              {settings.darkLogoUrl ? (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div className="relative w-36 h-12 bg-slate-900 rounded-lg p-1.5 flex items-center justify-center overflow-hidden">
                    <Image src={settings.darkLogoUrl} alt="Dark Logo" fill className="object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('darkLogoUrl', null)}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold"
                  >
                    Xóa Logo
                  </button>
                </div>
              ) : (
                <FileUpload
                  accept="image"
                  folder="branding"
                  label="Tải Logo Tối từ máy tính"
                  helperText="Phù hợp nền tối Header Admin & Footer"
                  onUploadComplete={(url) => handleFieldChange('darkLogoUrl', url)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Header & Navigation */}
      {activeTab === 'header' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">Cấu Hình Thanh Thông Báo & Menu Điều Hướng (Header)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Quản lý thanh thông báo khuyến mãi, số hotline trực tiếp và menu điều hướng sản phẩm trên đầu trang.
            </p>
          </div>

          {/* Top Announcement Bar */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-survey-400" />
                <span className="text-xs font-bold text-white">Thanh Thông Báo Trên Cùng (Announcement Bar)</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={settings.announcementActive}
                  onChange={(e) => handleFieldChange('announcementActive', e.target.checked)}
                  className="w-4 h-4 rounded text-survey-600 focus:ring-survey-500"
                />
                <span className={settings.announcementActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {settings.announcementActive ? 'Đang hiển thị' : 'Đang tắt'}
                </span>
              </label>
            </div>

            {settings.announcementActive && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Nội dung thông báo</label>
                  <input
                    type="text"
                    value={settings.announcementMessage}
                    onChange={(e) => handleFieldChange('announcementMessage', e.target.value)}
                    placeholder="Miễn phí hiệu chuẩn & kiểm định thiết bị..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Văn bản nút bấm (CTA)</label>
                  <input
                    type="text"
                    value={settings.announcementButtonText || ''}
                    onChange={(e) => handleFieldChange('announcementButtonText', e.target.value)}
                    placeholder="Đăng Ký Kiểm Định"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Header Hotline & Quote Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Nhãn Hotline Header</label>
              <input
                type="text"
                value={settings.hotlineLabel}
                onChange={(e) => handleFieldChange('hotlineLabel', e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Số Điện Thoại Hotline</label>
              <input
                type="text"
                value={settings.hotlineNumber}
                onChange={(e) => handleFieldChange('hotlineNumber', e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Nút Nhận Báo Giá (Label)</label>
              <input
                type="text"
                value={settings.quoteButtonText}
                onChange={(e) => handleFieldChange('quoteButtonText', e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Đường Dẫn Báo Giá (URL)</label>
              <input
                type="text"
                value={settings.quoteButtonUrl}
                onChange={(e) => handleFieldChange('quoteButtonUrl', e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          {/* Visual Menu Builder */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Menu className="w-4 h-4 text-survey-400" />
                  <span>Cây Menu Điều Hướng Chính (Header Navigation Builder)</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Thêm, xóa và cấu hình menu thả xuống (dropdown) với danh mục con.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMenuItem}
                className="px-3 py-1.5 bg-survey-600 hover:bg-survey-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Mục Menu</span>
              </button>
            </div>

            <div className="space-y-3">
              {settings.headerMenu.map((item, mIdx) => (
                <div key={item.id || mIdx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs items-center">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleUpdateMenuItem(mIdx, 'label', e.target.value)}
                        placeholder="Tên menu (vd: Máy GNSS RTK)"
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleUpdateMenuItem(mIdx, 'url', e.target.value)}
                        placeholder="Đường dẫn (vd: /products?category=rtk)"
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleAddSubItem(mIdx)}
                        className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-survey-400 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                        title="Thêm mục con thả xuống"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Menu Con</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveMenuItem(mIdx)}
                        className="p-1.5 text-slate-500 hover:text-red-400"
                        title="Xóa mục menu này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sub-items (Dropdown) */}
                  {item.subItems && item.subItems.length > 0 && (
                    <div className="pl-4 sm:pl-6 border-l-2 border-survey-500/40 space-y-2 pt-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                        Menu thả xuống con (Dropdown Links):
                      </span>
                      {item.subItems.map((sub, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 text-xs">
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          <input
                            type="text"
                            value={sub.label}
                            onChange={(e) => handleUpdateSubItem(mIdx, sIdx, 'label', e.target.value)}
                            placeholder="Tên danh mục con"
                            className="w-1/2 p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs"
                          />
                          <input
                            type="text"
                            value={sub.url}
                            onChange={(e) => handleUpdateSubItem(mIdx, sIdx, 'url', e.target.value)}
                            placeholder="URL con"
                            className="flex-1 p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSubItem(mIdx, sIdx)}
                            className="p-1 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Company Legal & Hotlines */}
      {activeTab === 'company' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">Hồ Sơ Pháp Lý Doanh Nghiệp & Đường Dây Nóng</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Thông tin công ty xuất hóa đơn điện tử VAT, giấy phép kinh doanh và các kênh hỗ trợ kỹ sư đo đạc.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold mb-1">Tên Doanh Nghiệp Đăng Ký Pháp Lý</label>
              <input
                type="text"
                value={settings.legalBusinessName}
                onChange={(e) => handleFieldChange('legalBusinessName', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-1 focus:ring-survey-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Mã Số Thuế Doanh Nghiệp (MST)</label>
              <input
                type="text"
                value={settings.taxCode}
                onChange={(e) => handleFieldChange('taxCode', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:ring-1 focus:ring-survey-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Email Tiếp Nhận Hồ Sơ / Dự Án</label>
              <input
                type="email"
                value={settings.primaryEmail}
                onChange={(e) => handleFieldChange('primaryEmail', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-survey-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold mb-1">Giấy Phép Kinh Doanh & Đơn Vị Cấp</label>
              <input
                type="text"
                value={settings.businessLicense}
                onChange={(e) => handleFieldChange('businessLicense', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-survey-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Hotline Phòng Kinh Doanh & Báo Giá</label>
              <input
                type="text"
                value={settings.salesHotline}
                onChange={(e) => handleFieldChange('salesHotline', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Tổng Đài Kỹ Thuật & Cứu Hộ Máy 24/7</label>
              <input
                type="text"
                value={settings.technicalSupportHotline}
                onChange={(e) => handleFieldChange('technicalSupportHotline', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Số Zalo Hỗ Trợ Kỹ Thuật (Official)</label>
              <input
                type="text"
                value={settings.zaloNumber}
                onChange={(e) => handleFieldChange('zaloNumber', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Showrooms & Branches */}
      {activeTab === 'showrooms' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-survey-400" />
                <span>Mạng Lưới Showroom & Trung Tâm Kiểm Định Toàn Quốc</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Các văn phòng đại diện nơi kỹ sư có thể đến trải nghiệm máy, đo thử thực địa hoặc gửi hiệu chuẩn Quatest.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddShowroom}
              className="px-3.5 py-1.5 bg-survey-600 hover:bg-survey-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Chi Nhánh</span>
            </button>
          </div>

          <div className="space-y-4">
            {settings.showrooms.map((sr, idx) => (
              <div key={sr.id || idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-survey-400 font-mono">Chi nhánh #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveShowroom(idx)}
                    className="p-1 text-slate-500 hover:text-red-400"
                    title="Xóa chi nhánh này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Tên Chi Nhánh / Trung Tâm</label>
                    <input
                      type="text"
                      value={sr.branchName}
                      onChange={(e) => handleUpdateShowroom(idx, 'branchName', e.target.value)}
                      placeholder="vd: Trụ sở Hà Nội, Chi nhánh TP.HCM..."
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Số Điện Thoại Trực Tiếp</label>
                    <input
                      type="text"
                      value={sr.phone}
                      onChange={(e) => handleUpdateShowroom(idx, 'phone', e.target.value)}
                      placeholder="0988.355.688"
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">Địa Chỉ Chi Tiết</label>
                    <input
                      type="text"
                      value={sr.address}
                      onChange={(e) => handleUpdateShowroom(idx, 'address', e.target.value)}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">Đường Dẫn Google Maps (Link Chỉ Đường)</label>
                    <input
                      type="text"
                      value={sr.googleMapsUrl || ''}
                      onChange={(e) => handleUpdateShowroom(idx, 'googleMapsUrl', e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Footer & Social */}
      {activeTab === 'footer' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">Cấu Hình Chân Trang (Footer) & Kênh Truyền Thông</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tùy chỉnh 3 cột liên kết chân trang, huy hiệu chứng nhận tin cậy và thông báo bản quyền.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Đoạn Giới Thiệu Năng Lực Tại Footer</label>
              <textarea
                rows={3}
                value={settings.aboutText}
                onChange={(e) => handleFieldChange('aboutText', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Thông Báo Bản Quyền (Copyright Text)</label>
              <input
                type="text"
                value={settings.copyrightText}
                onChange={(e) => handleFieldChange('copyrightText', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
              Kênh Mạng Xã Hội & Cộng Đồng Kỹ Sư
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Facebook Fanpage URL</label>
                <input
                  type="text"
                  value={settings.socialFacebook || ''}
                  onChange={(e) => handleFieldChange('socialFacebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Zalo Official Account URL</label>
                <input
                  type="text"
                  value={settings.socialZalo || ''}
                  onChange={(e) => handleFieldChange('socialZalo', e.target.value)}
                  placeholder="https://zalo.me/..."
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">YouTube Kênh Đo Đạc URL</label>
                <input
                  type="text"
                  value={settings.socialYoutube || ''}
                  onChange={(e) => handleFieldChange('socialYoutube', e.target.value)}
                  placeholder="https://youtube.com/@..."
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">LinkedIn Công Ty URL</label>
                <input
                  type="text"
                  value={settings.socialLinkedin || ''}
                  onChange={(e) => handleFieldChange('socialLinkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Footer Link Columns Builder */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Các Cột Liên Kết Chân Trang ({settings.footerColumns.length} cột)
              </h3>
              <button
                type="button"
                onClick={handleAddFooterColumn}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-survey-400 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Cột</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {settings.footerColumns.map((col, cIdx) => (
                <div key={cIdx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => handleUpdateFooterColumnTitle(cIdx, e.target.value)}
                      placeholder="Tiêu đề cột"
                      className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFooterColumn(cIdx)}
                      className="p-1 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-850">
                    {col.links.map((lnk, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-1.5 text-xs">
                        <input
                          type="text"
                          value={lnk.label}
                          onChange={(e) => handleUpdateFooterLink(cIdx, lIdx, 'label', e.target.value)}
                          placeholder="Tên link"
                          className="w-1/2 p-1 bg-slate-900 border border-slate-800 rounded text-[11px] text-white"
                        />
                        <input
                          type="text"
                          value={lnk.url}
                          onChange={(e) => handleUpdateFooterLink(cIdx, lIdx, 'url', e.target.value)}
                          placeholder="URL"
                          className="flex-1 p-1 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-400 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFooterLink(cIdx, lIdx)}
                          className="p-1 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddFooterLink(cIdx)}
                      className="w-full py-1 text-[11px] text-slate-400 hover:text-survey-400 border border-dashed border-slate-800 hover:border-survey-500/50 rounded-lg flex items-center justify-center gap-1 mt-2"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm link</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
