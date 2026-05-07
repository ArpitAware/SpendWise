/**
 * pages/RegisterPage.jsx - dark aesthetic + back to home
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiCheck } from 'react-icons/fi';

const PERKS = [
  'Free forever — no credit card needed',
  '₹ INR support + 8 other currencies',
  'Beautiful dashboard with live charts',
  'Budget alerts & CSV export',
];

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-950 overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 relative overflow-hidden p-12 bg-gradient-to-br from-purple-950 via-indigo-950 to-gray-900">
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl animate-blob delay-2000" />
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
            Start your<br />
            <span className="shimmer-text">financial journey.</span>
          </h2>
          <p className="text-gray-400">Join hundreds of Indians who track their money smarter with SpendWise.</p>
          <ul className="space-y-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="w-3 h-3 text-emerald-400" />
                </div>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-gray-600 text-sm relative z-10">© 2025 SpendWise • MIT License</p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition group">
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <div className="w-full max-w-md animate-slide-up py-12">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-lg">₹</span>
            </div>
            <span className="font-black text-xl text-white">SpendWise</span>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">Create your account</h1>
          <p className="text-gray-400 mb-8">Free forever. Start in 30 seconds.</p>

          {serverError && (
            <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { name:'name', label:'Full Name', type:'text', Icon:FiUser, placeholder:'Your name',
                rules:{ required:'Name is required', maxLength:{value:50, message:'Max 50 chars'} } },
              { name:'email', label:'Email', type:'email', Icon:FiMail, placeholder:'you@example.com',
                rules:{ required:'Email is required', pattern:{value:/^\S+@\S+\.\S+$/, message:'Invalid email'} } },
            ].map(({ name, label, type, Icon, placeholder, rules }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input type={type} {...register(name, rules)} placeholder={placeholder}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-2xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
                </div>
                {errors[name] && <p className="mt-1.5 text-xs text-red-400">{errors[name].message}</p>}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input type={showPw ? 'text' : 'password'}
                  {...register('password', { required:'Password is required', minLength:{value:6,message:'Min 6 characters'}, pattern:{value:/\d/,message:'Must contain a number'} })}
                  className="w-full pl-11 pr-11 py-3 bg-gray-800/60 border border-gray-700 rounded-2xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="Min 6 chars with a number"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition">
                  {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input type={showPw ? 'text' : 'password'}
                  {...register('confirmPassword', { required:'Please confirm', validate: v => v === password || 'Passwords do not match' })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-2xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="Repeat password"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 text-sm mt-2">
              {isSubmitting ? 'Creating account...' : 'Create Free Account →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
