'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  Cloud,
} from 'lucide-react';

export interface UploadedFileData {
  url: string;
  originalName: string;
  size: number;
  mimeType: string;
}

interface FileUploadProps {
  onUploadComplete?: (url: string, fileData?: UploadedFileData) => void;
  onMultipleUploadComplete?: (urls: string[], filesData?: UploadedFileData[]) => void;
  accept?: 'image' | 'pdf' | 'all';
  multiple?: boolean;
  folder?: string;
  maxSizeBytes?: number;
  label?: string;
  helperText?: string;
  className?: string;
}

export default function FileUpload({
  onUploadComplete,
  onMultipleUploadComplete,
  accept = 'image',
  multiple = false,
  folder = 'products',
  maxSizeBytes = 15 * 1024 * 1024, // 15MB
  label,
  helperText,
  className = '',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [recentlyUploaded, setRecentlyUploaded] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptString = () => {
    switch (accept) {
      case 'image':
        return 'image/jpeg,image/png,image/webp,image/gif';
      case 'pdf':
        return 'application/pdf,.pdf';
      case 'all':
      default:
        return 'image/jpeg,image/png,image/webp,image/gif,application/pdf,.pdf';
    }
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `Tệp "${file.name}" vượt quá kích thước tối đa ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB.`;
    }

    if (accept === 'image' && !file.type.startsWith('image/')) {
      return `Tệp "${file.name}" không phải là định dạng hình ảnh hợp lệ (JPEG, PNG, WebP).`;
    }

    if (
      accept === 'pdf' &&
      file.type !== 'application/pdf' &&
      !file.name.toLowerCase().endsWith('.pdf')
    ) {
      return `Tệp "${file.name}" không phải là tệp tài liệu PDF hợp lệ.`;
    }

    return null;
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;

    setErrorMessage('');
    setIsUploading(true);
    setProgress(15);

    // Validate all files
    for (const f of files) {
      const error = validateFile(f);
      if (error) {
        setErrorMessage(error);
        setIsUploading(false);
        setProgress(0);
        return;
      }
    }

    // Interval to simulate progressive uploading feel
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 200);

    const uploadedUrls: string[] = [];
    const uploadedData: UploadedFileData[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || `Tải lên tệp ${file.name} thất bại.`);
        }

        uploadedUrls.push(data.url);
        uploadedData.push({
          url: data.url,
          originalName: data.originalName || file.name,
          size: data.size || file.size,
          mimeType: data.mimeType || file.type,
        });

        // Trigger individual complete
        if (onUploadComplete) {
          onUploadComplete(data.url, uploadedData[uploadedData.length - 1]);
        }
      }

      clearInterval(progressInterval);
      setProgress(100);

      // Trigger multiple complete if provided
      if (onMultipleUploadComplete && uploadedUrls.length > 0) {
        onMultipleUploadComplete(uploadedUrls, uploadedData);
      }

      setRecentlyUploaded((prev) => [...prev, ...uploadedUrls]);

      // Reset progress after a short moment
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 800);
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setProgress(0);
      setErrorMessage(err.message || 'Xảy ra lỗi khi gửi tệp lên máy chủ đám mây.');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const toUpload = multiple ? files : [files[0]];
      uploadFiles(toUpload);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const toUpload = multiple ? files : [files[0]];
      uploadFiles(toUpload);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={getAcceptString()}
        multiple={multiple}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all duration-200 group ${
          isDragging
            ? 'border-survey-500 bg-survey-500/10 scale-[1.01]'
            : 'border-slate-700 bg-slate-900/60 hover:border-survey-500/60 hover:bg-slate-900'
        } ${isUploading ? 'opacity-80 pointer-events-none' : ''}`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Animated Cloud Icon */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isDragging
                ? 'bg-survey-600 text-white scale-110 shadow-lg shadow-survey-600/30'
                : 'bg-slate-800 text-slate-400 group-hover:text-survey-400 group-hover:bg-slate-750'
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-survey-400" />
            ) : accept === 'pdf' ? (
              <FileText className="w-6 h-6" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          {/* Text Instructions */}
          <div>
            <p className="text-xs font-bold text-white group-hover:text-survey-400 transition-colors">
              {label ||
                (accept === 'pdf'
                  ? 'Kéo thả hồ sơ kiểm định PDF hoặc nhấp để tải từ thiết bị'
                  : multiple
                  ? 'Kéo thả nhiều ảnh thiết bị hoặc nhấp để chọn từ máy tính'
                  : 'Kéo thả ảnh hoặc nhấp để tải ảnh trực tiếp từ máy tính')}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {helperText ||
                (accept === 'pdf'
                  ? 'Hỗ trợ tệp PDF (Chứng thư Quatest 1, Giấy hiệu chuẩn Vilas, Hướng dẫn sử dụng) tối đa 15MB.'
                  : 'Hỗ trợ PNG, JPG, WebP. Tự động nén tối ưu WebP dưới 500KB chuẩn Core Web Vitals.')}
            </p>
          </div>

          {/* Badge Cloud Storage */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] text-slate-400">
            <Cloud className="w-3 h-3 text-sky-400" />
            <span>Lưu trữ Cloud CDN (Serverless Vercel Ready)</span>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="absolute inset-x-4 bottom-3">
            <div className="flex items-center justify-between text-[10px] text-survey-400 font-mono mb-1">
              <span>Đang tối ưu hóa & tải lên đám mây...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-survey-500 to-amber-400 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="p-1 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
