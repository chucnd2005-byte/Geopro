'use client';

import React from 'react';
import { useAppStore } from '@/store/useStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, showToast } = useAppStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    warning: 'bg-amber-50 border-amber-200 text-amber-950',
    info: 'bg-blue-50 border-blue-200 text-blue-950',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl ${
          bgColors[toast.type]
        }`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
        <button
          onClick={() => useAppStore.setState({ toast: null })}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
