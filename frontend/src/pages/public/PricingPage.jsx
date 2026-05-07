/**
 * pages/public/PricingPage.jsx
 * Pricing page inspired by Spendify — clean card layout with feature grid
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/home/PublicNavbar';
import { FiCheck, FiArrowRight, FiZap, FiShield, FiPieChart, FiUsers, FiStar, FiDownload } from 'react-icons/fi';

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const FEATURE_GROUPS = [
  {
    icon: FiPieChart,
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    title: 'Expense Tracking',
    features: [
      'Add, edit & delete expenses',
      'Search & full-text filter',
      'Date range & category filters',
      'Payment method tracking',
      'Notes & tags support',
      'Pagination (10/25/50 per page)',
    ],
  },
  {
    icon: FiZap,
    color: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    title: 'Dashboard & Analytics',
    features: [
      'Monthly spending area chart',
      'Category breakdown pie chart',
      'Top categories bar chart',
      'YTD totals & stats',
      'Month-over-month view',
      'Real-time aggregation',
    ],
  },
  {
    icon: FiShield,
    color: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-200 dark:border-violet-800',
    title: 'Budgeting',
    features: [
      'Monthly budget limits',
      'Per-category budgets',
      'Visual progress bars',
      'Alert thresholds (0–100%)',
      'Spending vs limit tracking',
      'Budget reset each month',
    ],
  },
  {
    icon: FiUsers,
    color: 'from-pink-400 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    border: 'border-pink-200 dark:border-pink-800',
    title: 'Account & Security',
    features: [
      'JWT + refresh token auth',
      'Secure bcrypt passwords',
      'Profile customization',
      'Currency switcher (8 currencies)',
      'Dark / light / system theme',
      'Rate limiting & Helmet',
    ],
  },
  {
    icon: FiDownload,
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    title: 'Data & Export',
    features: [
      'One-click CSV export',
      'Full expense history',
      'Sort by any field',
      'Category-based reports',
      'Date-range export',
      'No data limits',
    ],
  },
  {
    icon: FiStar,
    color: 'from-cyan-400 to-sky-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    border: 'border-cyan-200 dark:border-cyan-800',
    title: 'Developer Quality',
    features: [
      'MVC architecture',
      'Express-validator inputs',
      'Compound MongoDB indexes',
      'Axios interceptor refresh',
      'Lazy-loaded React pages',
      'Winston logging',
    ],
  },
];

const FREE_FEATURES = [
  'Unlimited expenses & history',
  'All 3 dashboard charts',
  'Monthly budget tracking',
  'CSV export — always free',
  'Dark mode + theme toggle',
  '8 currencies incl. ₹ INR',
  'JWT authentication',
  'Mobile responsive UI',
  'No ads, no upsells',
];

export default function PricingPage() {
  const [billing, setBilling] = useState('yearly');
  useScrollReveal();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PublicNavbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-blob absolute top-10 left-1/4 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-40" />
          <div className="animate-blob delay-2000 absolute top-10 right-1/4 w-72 h-72 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-40" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="animate-slide-up inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 rounded-full px-4 py-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            One Plan. Everything Included.
          </div>
          <h1 className="animate-slide-up delay-100 text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
            Simple,{' '}
            <span className="shimmer-text">honest</span>{' '}
            pricing.
          </h1>
          <p className="animate-slide-up delay-200 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            No tiers, no feature gates, no surprises. SpendWise gives you everything from day one — completely free.
          </p>
        </div>
      </section>

      {/* ── Pricing Card ────────────────────────────────────────────────── */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto reveal">
          {/* Billing toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
              {['monthly', 'yearly'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    billing === b
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {b} {b === 'yearly' && <span className="ml-1 text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">-33%</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Main pricing card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-indigo-500 shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/30 overflow-hidden relative">
            {/* Badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">Full Access</span>
            </div>

            <div className="p-8 pt-10">
              {/* App identity */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">₹</span>
                </div>
                <div>
                  <p className="font-black text-gray-900 dark:text-white text-lg">SpendWise</p>
                  <p className="text-gray-400 text-sm">Expense & Budget Tracker</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-2">
                <div className="flex items-end gap-2">
                  <span className="text-7xl font-black text-gray-900 dark:text-white">
                    {billing === 'yearly' ? '₹0' : '₹0'}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    ⭐ Always Free — Open Source
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {billing === 'yearly' ? 'Self-host or use our demo — forever free.' : 'No subscription, no credit card needed.'}
                </p>
              </div>

              <hr className="border-gray-100 dark:border-gray-800 my-6" />

              {/* Feature list */}
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                      <FiCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className="group flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-indigo-200 dark:hover:shadow-indigo-900 transition-all hover:-translate-y-0.5"
              >
                Get Started Free
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-center text-xs text-gray-400 mt-4">
                ₹0 forever · No credit card · Full access from day one
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Everything You Get ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Everything You Get</h2>
            <p className="text-gray-500 dark:text-gray-400">One subscription. No feature tiers. No hidden costs. Here's what's included.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_GROUPS.map((group, i) => (
              <div
                key={group.title}
                className={`reveal delay-${(i % 3 + 1) * 100} p-6 rounded-2xl border ${group.bg} ${group.border} card-hover`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center`}>
                    <group.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{group.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {group.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-12 reveal">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">Frequently asked</h2>
        </div>
        <div className="space-y-4 reveal">
          {[
            { q: 'Is SpendWise really free?', a: 'Yes — completely free and open source. No subscription, no credit card, no feature limits. You can also self-host it using the code on GitHub.' },
            { q: 'Does it support Indian Rupee (₹)?', a: 'Yes! INR is the default currency. You can also switch to USD, EUR, GBP, JPY, CAD, AUD, SGD, or AED from the navbar.' },
            { q: 'Is my financial data secure?', a: 'All passwords are hashed with bcrypt, authentication uses JWT with refresh token rotation, and the API has rate limiting, Helmet headers, and NoSQL injection protection.' },
            { q: 'Can I export my data?', a: 'Yes — one-click CSV export from the Expenses page downloads all your expenses with full details: title, amount, category, date, payment method, and notes.' },
            { q: 'What tech stack is it built on?', a: 'MongoDB + Express.js + React 18 + Node.js (MERN). Uses Tailwind CSS, Recharts for charts, Axios with interceptors, JWT auth, and Vite for the build.' },
          ].map(({ q, a }) => (
            <details key={q} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 group">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer flex items-center justify-between list-none">
                {q}
                <span className="text-indigo-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 text-center reveal">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-4">Start tracking today</h2>
          <p className="text-indigo-200 mb-8">₹0 forever. No credit card. No catch.</p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Create Free Account
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-4 text-center text-sm text-gray-400">
        <p>© 2025 SpendWise — MIT License. Made with ❤️ in India 🇮🇳</p>
      </footer>
    </div>
  );
}
