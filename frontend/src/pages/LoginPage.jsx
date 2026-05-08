/**
 * pages/LoginPage.jsx - ADDED: back to home button, dark aesthetic matching landing
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-950 overflow-hidden">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
        {/* BG orbs */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-blob delay-2000" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage:'linear-gradient(rgba(99,102,241,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,1) 1px,transparent 1px)', backgroundSize:'50px 50px' }} />

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-xl">₹</span>
          </div>
          <span className="font-black text-2xl text-white">SpendWise</span>
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-black text-white leading-tight">
            Track every rupee.<br />
            <span className="shimmer-text">Master your money.</span>
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Beautiful charts, smart budgets, and real-time analytics — all in one free app built for India.
          </p>
          {/* Floating stat cards */}
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            {[
              { label:'Total Tracked', value:'₹2Cr+', color:'from-indigo-600 to-indigo-700' },
              { label:'Active Users', value:'500+',   color:'from-purple-600 to-purple-700' },
              { label:'Categories',   value:'10',     color:'from-emerald-600 to-emerald-700' },
              { label:'Always Free',  value:'₹0',     color:'from-rose-600 to-rose-700' },
            ].map((s) => (
              <div key={s.label} className={`p-4 rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-sm relative z-10">© 2026 SpendWise • MIT License</p>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Back to home */}
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition group">
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-lg">₹</span>
            </div>
            <span className="font-black text-xl text-white">SpendWise</span>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-8">Sign in to your account to continue</p>

          {serverError && (
            <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <span className="text-lg">⚠️</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input type="email"
                  {...register('email', { required: 'Email is required', pattern: { value:/^\S+@\S+\.\S+$/, message:'Invalid email' } })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-2xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input type={showPw ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-11 pr-11 py-3 bg-gray-800/60 border border-gray-700 rounded-2xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition">
                  {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 text-sm mt-2">
              {isSubmitting ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
