'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, Layers } from 'lucide-react';

interface Props {
  categoryType: string;
  initialSpecs?: any;
  onChange: (specs: any) => void;
}

export default function DynamicSpecBuilder({ categoryType, initialSpecs = {}, onChange }: Props) {
  const [specs, setSpecs] = useState<any>({
    categoryType: categoryType || 'GNSS_RTK',
    channels: initialSpecs.channels || 1408,
    constellations: initialSpecs.constellations || 'GPS, GLONASS, BDS (B1/B2/B3), Galileo, QZSS',
    horizontalAccuracy: initialSpecs.horizontalAccuracy || '8mm + 1ppm RMS',
    verticalAccuracy: initialSpecs.verticalAccuracy || '15mm + 1ppm RMS',
    tiltCompensation: initialSpecs.tiltCompensation || 'IMU 60° không cần cân bằng, miễn nhiễm từ trường',
    uhfPower: initialSpecs.uhfPower || '1W - 4W dải tần 410-470MHz',
    batteryLifeHours: initialSpecs.batteryLifeHours || 15,
    weightKg: initialSpecs.weightKg || 0.85,
    ingressProtection: initialSpecs.ingressProtection || 'IP68',
    angularAccuracy: initialSpecs.angularAccuracy || '1"',
    reflectorlessRange: initialSpecs.reflectorlessRange || '1000m',
    prismRange: initialSpecs.prismRange || '5000m',
    edmSpeed: initialSpecs.edmSpeed || '0.3s',
    magnification: initialSpecs.magnification || '30x',
    stdDevPerKm: initialSpecs.stdDevPerKm || '0.7mm/km',
    customSpecs: initialSpecs.customSpecs || [],
  });

  useEffect(() => {
    onChange(specs);
  }, [specs]);

  const handleFieldChange = (field: string, val: any) => {
    setSpecs((prev: any) => ({ ...prev, [field]: val }));
  };

  const handleAddCustomSpec = () => {
    setSpecs((prev: any) => ({
      ...prev,
      customSpecs: [...(prev.customSpecs || []), { key: '', value: '' }],
    }));
  };

  const handleCustomChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...(specs.customSpecs || [])];
    updated[index][field] = value;
    setSpecs((prev: any) => ({ ...prev, customSpecs: updated }));
  };

  const handleRemoveCustom = (index: number) => {
    const updated = specs.customSpecs.filter((_: any, i: number) => i !== index);
    setSpecs((prev: any) => ({ ...prev, customSpecs: updated }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-white font-bold text-xs">
          <Sparkles className="w-4 h-4 text-survey-400" />
          <span>Thông Số Kỹ Thuật Chuyên Ngành (Dynamic Technical Specs)</span>
        </div>
        <span className="text-[10px] text-survey-400 font-mono font-bold uppercase bg-survey-500/10 px-2 py-0.5 rounded border border-survey-500/30">
          Preset: {categoryType}
        </span>
      </div>

      {/* GNSS RTK Preset Fields */}
      {(categoryType === 'GNSS_RTK' || categoryType.includes('rtk')) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Số Kênh Thu Nhận (Channels)</label>
            <input
              type="number"
              value={specs.channels || ''}
              onChange={(e) => handleFieldChange('channels', parseInt(e.target.value) || 0)}
              placeholder="1408"
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Độ Chính Xác Ngang (Horizontal RMS)</label>
            <input
              type="text"
              value={specs.horizontalAccuracy || ''}
              onChange={(e) => handleFieldChange('horizontalAccuracy', e.target.value)}
              placeholder="8mm + 1ppm RMS"
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Độ Chính Xác Cao Độ (Vertical RMS)</label>
            <input
              type="text"
              value={specs.verticalAccuracy || ''}
              onChange={(e) => handleFieldChange('verticalAccuracy', e.target.value)}
              placeholder="15mm + 1ppm RMS"
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-400 mb-1">Cảm Biến Bù Nghiêng (Tilt Sensor IMU)</label>
            <input
              type="text"
              value={specs.tiltCompensation || ''}
              onChange={(e) => handleFieldChange('tiltCompensation', e.target.value)}
              placeholder="Cảm biến IMU 60° bù nghiêng tự động, miễn nhiễm từ trường"
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Công Suất Radio Trong (UHF Power)</label>
            <input
              type="text"
              value={specs.uhfPower || ''}
              onChange={(e) => handleFieldChange('uhfPower', e.target.value)}
              placeholder="1W - 4W dải tần 410-470MHz"
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-slate-400 mb-1">Chòm Sao Vệ Tinh Hỗ Trợ</label>
            <input
              type="text"
              value={specs.constellations || ''}
              onChange={(e) => handleFieldChange('constellations', e.target.value)}
              placeholder="GPS, GLONASS, BDS (B1/B2/B3), Galileo, QZSS, NavIC"
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>
        </div>
      )}

      {/* Total Station Preset Fields */}
      {(categoryType === 'TOTAL_STATION' || categoryType.includes('toan-dac')) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Độ Chính Xác Đo Góc</label>
            <input
              type="text"
              value={specs.angularAccuracy || ''}
              onChange={(e) => handleFieldChange('angularAccuracy', e.target.value)}
              placeholder={'1" hoặc 2"'}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Cự Ly Đo Không Gương (EDM)</label>
            <input
              type="text"
              value={specs.reflectorlessRange || ''}
              onChange={(e) => handleFieldChange('reflectorlessRange', e.target.value)}
              placeholder="1000m (Mở rộng 2000m)"
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Cự Ly Đo Có Gương (Prism Range)</label>
            <input
              type="text"
              value={specs.prismRange || ''}
              onChange={(e) => handleFieldChange('prismRange', e.target.value)}
              placeholder="5000m"
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Tốc Độ Đo EDM</label>
            <input
              type="text"
              value={specs.edmSpeed || ''}
              onChange={(e) => handleFieldChange('edmSpeed', e.target.value)}
              placeholder="0.3s"
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>
        </div>
      )}

      {/* Optical Level Preset Fields */}
      {(categoryType === 'OPTICAL_LEVEL' || categoryType.includes('thuy-binh')) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Độ Phóng Đại Ống Kính</label>
            <input
              type="text"
              value={specs.magnification || ''}
              onChange={(e) => handleFieldChange('magnification', e.target.value)}
              placeholder="30x hoặc 24x"
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Sai Số Đo Lặp 1km Đi Về</label>
            <input
              type="text"
              value={specs.stdDevPerKm || ''}
              onChange={(e) => handleFieldChange('stdDevPerKm', e.target.value)}
              placeholder="0.7mm/km hoặc 1.5mm/km"
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>
        </div>
      )}

      {/* Common Physical Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-800">
        <div>
          <label className="block text-slate-400 mb-1">Chuẩn Chống Nước Bụi (IP)</label>
          <input
            type="text"
            value={specs.ingressProtection || ''}
            onChange={(e) => handleFieldChange('ingressProtection', e.target.value)}
            placeholder="IP67 hoặc IP68"
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Thời Lượng Pin (Giờ)</label>
          <input
            type="number"
            step="0.5"
            value={specs.batteryLifeHours || ''}
            onChange={(e) => handleFieldChange('batteryLifeHours', parseFloat(e.target.value) || 0)}
            placeholder="15"
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Trọng Lượng (kg)</label>
          <input
            type="number"
            step="0.05"
            value={specs.weightKg || ''}
            onChange={(e) => handleFieldChange('weightKg', parseFloat(e.target.value) || 0)}
            placeholder="0.73"
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
          />
        </div>
      </div>

      {/* Custom Key-Value Specs */}
      <div className="pt-2 border-t border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Thông Số Tùy Biến Thêm (Custom Attributes)</span>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-survey-400 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Dòng</span>
          </button>
        </div>

        {specs.customSpecs && specs.customSpecs.length > 0 && (
          <div className="space-y-2">
            {specs.customSpecs.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tên thông số (vd: Bộ nhớ trong)"
                  value={item.key}
                  onChange={(e) => handleCustomChange(idx, 'key', e.target.value)}
                  className="w-1/3 p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Giá trị (vd: 8GB eMMC lưu 30 ngày)"
                  value={item.value}
                  onChange={(e) => handleCustomChange(idx, 'value', e.target.value)}
                  className="flex-1 p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustom(idx)}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
