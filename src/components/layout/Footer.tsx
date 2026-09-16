'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Award,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  FileCheck,
  CheckCircle,
  Truck,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useSiteSettings } from '@/lib/SettingsContext';
import { SiteSettingsData } from '@/lib/settings';

interface FooterProps {
  settings?: SiteSettingsData;
}

export default function Footer({ settings: propSettings }: FooterProps) {
  const contextSettings = useSiteSettings();
  const settings = propSettings || contextSettings;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* 1. Core Guarantees Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-survey-500/10 border border-survey-500/30 flex items-center justify-center text-survey-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Chính Hãng</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Đại lý ủy quyền chính thức Leica, Trimble, CHCNAV, Topcon. Đầy đủ CO/CQ.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Kiểm Định Vilas 110</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Phòng hiệu chuẩn đo lường cấp tem & giấy chứng nhận có giá trị pháp lý nghiệm thu.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Cấp Máy Dự Phòng</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Không gián đoạn công trình: cung cấp máy đo thay thế trong thời gian bảo dưỡng.
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
                Kỹ sư mang máy đến tận thực địa đo thử, bàn giao công nghệ trên 63 tỉnh thành.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 text-xs">
        {/* Col 1: About & Legal Info (Span 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-survey-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-survey-600/30">
              GS
            </div>
            <span className="text-lg font-black tracking-wider text-white">
              {settings.siteName}
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed">
            {settings.aboutText}
          </p>

          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5 text-[11px] text-slate-400">
            <div className="font-bold text-slate-200">{settings.legalBusinessName}</div>
            <div>Mã số thuế: <strong className="text-survey-400 font-mono">{settings.taxCode}</strong></div>
            <div>{settings.businessLicense}</div>
          </div>

          <div className="space-y-2 pt-1 text-slate-300">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-survey-400 shrink-0" />
              <span>Hotline kỹ thuật 24/7: <a href={`tel:${settings.technicalSupportHotline}`} className="text-white font-bold hover:text-survey-400">{settings.technicalSupportHotline}</a></span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hotline báo giá dự án: <a href={`tel:${settings.salesHotline}`} className="text-white font-bold hover:text-survey-400">{settings.salesHotline}</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-survey-400 shrink-0" />
              <span>Email: <a href={`mailto:${settings.primaryEmail}`} className="text-white hover:text-survey-400">{settings.primaryEmail}</a></span>
            </div>
          </div>

          {/* Trust Badges & Certifications */}
          {settings.trustBadges && settings.trustBadges.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                Chứng Nhận & Kiểm Định
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {settings.trustBadges.map((badge, bIdx) => (
                  <div
                    key={bIdx}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 flex items-center gap-2 hover:border-slate-700 transition-colors"
                    title={badge.title}
                  >
                    {badge.imageUrl && (
                      <div className="relative w-6 h-6 rounded overflow-hidden shrink-0 bg-white/5">
                        <Image
                          src={badge.imageUrl}
                          alt={badge.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-[10px] text-slate-300 font-medium truncate max-w-[130px]">
                      {badge.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Col 2: Showroom & Service Centers */}
        <div className="lg:col-span-1 space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider text-survey-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>Showrooms</span>
          </h4>
          <div className="space-y-4 text-slate-400">
            {settings.showrooms.map((sr) => (
              <div key={sr.id} className="space-y-0.5 border-b border-slate-850 pb-2.5 last:border-0 last:pb-0">
                <strong className="text-slate-200 block text-xs font-semibold">{sr.branchName}:</strong>
                <span className="text-[11px] text-slate-400 block leading-relaxed">{sr.address}</span>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-survey-400 font-mono font-medium">Hotline: {sr.phone}</span>
                  {sr.googleMapsUrl && (
                    <a
                      href={sr.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white flex items-center gap-0.5"
                    >
                      <span>Bản đồ</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3, 4, 5: 3 Dynamic Customizable Link Columns */}
        {settings.footerColumns.slice(0, 3).map((col, idx) => (
          <div key={idx} className="lg:col-span-1 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-survey-400">
              {col.title}
            </h4>
            <ul className="space-y-2 text-slate-400">
              {col.links.map((lnk, lIdx) => (
                <li key={lIdx}>
                  <Link
                    href={lnk.url}
                    className="hover:text-white hover:translate-x-0.5 transition-all inline-block"
                  >
                    {lnk.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>


      {/* 3. Bottom Social & Copyright */}
      <div className="border-t border-slate-900 bg-black py-5 px-4 text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left leading-relaxed">
            {settings.copyrightText}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3 shrink-0">
            {settings.socialFacebook && (
              <a
                href={settings.socialFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Facebook
              </a>
            )}
            {settings.socialZalo && (
              <a
                href={settings.socialZalo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Zalo OA
              </a>
            )}
            {settings.socialYoutube && (
              <a
                href={settings.socialYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                YouTube
              </a>
            )}
            {settings.socialLinkedin && (
              <a
                href={settings.socialLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
