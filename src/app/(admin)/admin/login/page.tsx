'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAdminAction } from '@/app/actions/admin/auth';
import {
  Crosshair,
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/admin/dashboard';

  const [identifier, setIdentifier] = useState('chucnd2005@gmail.com');
  const [password, setPassword] = useState('12345678Ab@');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await loginAdminAction({ identifier, password });
      if (res.success) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Đăng nhập không thành công.');
      }
    } catch (err) {
      setErrorMessage('Đã xảy ra lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Tên đăng nhập hoặc Email
        </label>
        <div className="relative">
          <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="chucnd2005@gmail.com"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-survey-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Mật khẩu quản trị
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-survey-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-survey-600 hover:bg-survey-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-survey-600/30 flex items-center justify-center gap-2 transition-all group"
      >
        <span>{isLoading ? 'Đang xác thực bảo mật...' : 'Đăng Nhập Quản Trị'}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-dark-grid">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-survey-600/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-survey-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-survey-600/30">
            <Crosshair className="w-7 h-7 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">GEOPRO ADMIN</h1>
            <p className="text-xs text-slate-400 mt-1">Cổng Quản Trị Hệ Thống Trắc Địa & Đo Đạc</p>
          </div>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Đang tải biểu mẫu...</div>}>
          <LoginForm />
        </Suspense>

        {/* Demo Credentials Box */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-survey-500" />
            <span>Tài khoản quản trị mặc định (Môi trường Dev):</span>
          </div>
          <div className="text-[11px] font-mono text-slate-300 space-y-0.5 pl-5">
            <div>Username: <strong className="text-survey-400">chucnd2005@gmail.com</strong></div>
            <div>Password: <strong className="text-survey-400">12345678Ab@</strong></div>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Phiên đăng nhập JWT 256-bit được mã hóa bảo mật</span>
        </div>
      </div>
    </div>
  );
}

