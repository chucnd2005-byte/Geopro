'use client';

import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Table,
  Image as ImageIcon,
  Code,
  Eye,
  Edit3,
} from 'lucide-react';

interface Props {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const [isPreview, setIsPreview] = useState(false);

  const insertTag = (openTag: string, closeTag: string = '') => {
    const textarea = document.getElementById('rich-text-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = `${openTag}${selected || 'Nội dung...'}${closeTag}`;

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + replacement.length - closeTag.length);
    }, 50);
  };

  const handleInsertTable = () => {
    const tableHtml = `
<table class="w-full text-xs border border-slate-700 my-3">
  <thead>
    <tr class="bg-slate-800 text-white">
      <th class="p-2 border border-slate-700">Hạng Mục</th>
      <th class="p-2 border border-slate-700">Thông Số</th>
      <th class="p-2 border border-slate-700">Ghi Chú Nghiệm Thu</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="p-2 border border-slate-700">Độ chính xác RTK</td>
      <td class="p-2 border border-slate-700">8mm + 1ppm RMS</td>
      <td class="p-2 border border-slate-700">Theo tiêu chuẩn Cục Đo Đạc</td>
    </tr>
  </tbody>
</table>
`;
    onChange(value + '\n' + tableHtml);
  };

  const handleInsertImage = () => {
    const url = prompt('Nhập đường dẫn URL ảnh (từ Thư viện Media hoặc CDN):');
    if (url) {
      const alt = prompt('Nhập mô tả Alt-text cho ảnh:', 'Hình ảnh thiết bị đo đạc thực tế tại công trình');
      const imgHtml = `\n<img src="${url}" alt="${alt || 'Thiết bị trắc địa'}" class="rounded-xl border border-slate-700 my-4 max-w-full" />\n`;
      onChange(value + imgHtml);
    }
  };

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-950">
      {/* Toolbar */}
      <div className="p-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-1.5 text-xs text-slate-300">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded"
            title="Đậm (Bold)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<em>', '</em>')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded"
            title="Nghiêng (Italic)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <span className="text-slate-700">|</span>

          <button
            type="button"
            onClick={() => insertTag('<h2>', '</h2>')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded"
            title="Tiêu đề H2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded"
            title="Tiêu đề H3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
          <span className="text-slate-700">|</span>

          <button
            type="button"
            onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded"
            title="Danh sách gạch đầu dòng"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded"
            title="Danh sách số"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<blockquote>', '</blockquote>')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded"
            title="Trích dẫn kỹ thuật"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <span className="text-slate-700">|</span>

          <button
            type="button"
            onClick={handleInsertTable}
            className="p-1.5 hover:bg-slate-800 hover:text-survey-400 rounded flex items-center gap-1"
            title="Chèn bảng kỹ thuật"
          >
            <Table className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Chèn Bảng</span>
          </button>
          <button
            type="button"
            onClick={handleInsertImage}
            className="p-1.5 hover:bg-slate-800 hover:text-survey-400 rounded flex items-center gap-1"
            title="Chèn hình ảnh từ URL"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Chèn Ảnh</span>
          </button>
        </div>

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
            isPreview ? 'bg-survey-600 text-white' : 'bg-slate-800 hover:text-white text-slate-300'
          }`}
        >
          {isPreview ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          <span>{isPreview ? 'Chế Độ Soạn Thảo' : 'Xem Trước HTML'}</span>
        </button>
      </div>

      {/* Editor Content Body */}
      {isPreview ? (
        <div
          className="p-4 min-h-[220px] max-h-[400px] overflow-y-auto text-slate-200 text-xs leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-500 italic">Chưa có nội dung mô tả...</p>' }}
        />
      ) : (
        <textarea
          id="rich-text-area"
          rows={10}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Nhập mô tả chi tiết, bài đánh giá thực địa, hoặc dán mã HTML...'}
          className="w-full p-4 bg-transparent text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none font-mono leading-relaxed resize-y min-h-[220px]"
        />
      )}
    </div>
  );
}
