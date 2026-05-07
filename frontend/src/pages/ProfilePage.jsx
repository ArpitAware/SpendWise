/**
 * pages/ProfilePage.jsx
 * Profile management with currency selector built-in
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { FiUser, FiMail, FiSave, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { theme, setTheme } = useTheme();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email });
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await updateUser({ name: data.name, currency, theme });
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const inp = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const lbl = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Avatar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
          <span className="text-white font-black text-3xl">{user?.name?.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
          <p className="text-xs text-indigo-500 mt-1">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>

        <div>
          <label className={lbl}><FiUser className="inline w-4 h-4 mr-1" /> Full Name</label>
          <input {...register('name', { required: 'Name is required' })} className={inp} placeholder="Your name" />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className={lbl}><FiMail className="inline w-4 h-4 mr-1" /> Email</label>
          <input value={user?.email || ''} disabled className={`${inp} opacity-50 cursor-not-allowed`} />
          <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
        </div>

        {/* Currency */}
        <div>
          <label className={lbl}><FiGlobe className="inline w-4 h-4 mr-1" /> Default Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={inp}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-400">This affects how amounts are displayed across the app</p>
        </div>

        {/* Theme */}
        <div>
          <label className={lbl}>Theme</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'light', label: '☀️ Light' },
              { value: 'dark',  label: '🌙 Dark'  },
              { value: 'system',label: '💻 System' },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={`py-2.5 rounded-xl text-sm font-medium border transition ${
                  theme === value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 w-full justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition disabled:opacity-50"
        >
          <FiSave className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Danger zone */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-100 dark:border-red-900/40 p-6">
        <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Once you delete your account, all your data will be permanently removed.
        </p>
        <button
          onClick={() => toast.error('Account deletion not implemented in this demo')}
          className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
