/**
 * pages/public/HomePage.jsx
 * Animated landing page with hero, features, stats ticker, and CTA
 */

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/home/PublicNavbar';
import {
  FiTrendingUp, FiShield, FiZap, FiPieChart,
  FiBell, FiDownload, FiUsers, FiStar, FiArrowRight,
  FiCheck, FiSmartphone,
} from 'react-icons/fi';

// ── Scroll reveal hook ──────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Feature card ────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
  <div className={`reveal card-hover delay-${delay} p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm`}>
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

// ── Stat card ───────────────────────────────────────────────────────────────
const StatItem = ({ value, label }) => (
  <div className="text-center">
    <div className="text-4xl font-black text-white mb-1">{value}</div>
    <div className="text-indigo-200 text-sm">{label}</div>
  </div>
);

// ── Testimonial ─────────────────────────────────────────────────────────────
const Testimonial = ({ name, role, text, rating }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm card-hover">
    <div className="flex gap-1 mb-3">
      {[...Array(rating)].map((_, i) => (
        <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">"{text}"</p>
    <div>
      <p className="font-semibold text-gray-900 dark:text-white text-sm">{name}</p>
      <p className="text-gray-400 text-xs">{role}</p>
    </div>
  </div>
);

const FEATURES = [
  { icon: FiPieChart,    color: 'bg-indigo-500',  title: 'Smart Dashboard',      desc: 'Visual charts and analytics give you a complete picture of your spending at a glance.',    delay: 100 },
  { icon: FiShield,      color: 'bg-emerald-500', title: 'Budget Alerts',        desc: 'Set monthly limits per category and get notified before you overspend.',                      delay: 200 },
  { icon: FiTrendingUp,  color: 'bg-purple-500',  title: 'Expense Tracking',     desc: 'Add expenses in seconds. Filter, search, sort and paginate through your history easily.',    delay: 300 },
  { icon: FiZap,         color: 'bg-amber-500',   title: 'Instant Insights',     desc: 'MongoDB aggregation pipelines compute your stats in real-time as you add data.',             delay: 100 },
  { icon: FiDownload,    color: 'bg-rose-500',     title: 'CSV Export',           desc: 'Export all your expenses to CSV with one click for reporting or offline analysis.',           delay: 200 },
  { icon: FiBell,        color: 'bg-cyan-500',    title: 'Smart Notifications',  desc: 'Alert thresholds you control — get warned at 80% of budget, not when it\'s too late.',       delay: 300 },
];

const TESTIMONIALS = [
  { name: 'Arjun Mehta', role: 'Software Engineer, Bangalore', text: 'Finally an expense tracker that just works. The dashboard charts are incredibly clear and the INR support is a lifesaver.', rating: 5 },
  { name: 'Priya Sharma', role: 'Freelance Designer, Mumbai', text: 'Budget alerts changed how I manage money. I can see exactly where my rupees are going every month.', rating: 5 },
  { name: 'Rohit Verma', role: 'MBA Student, Delhi', text: 'Clean UI, fast, and the CSV export works perfectly. Best MERN project I\'ve seen — I use it daily.', rating: 5 },
];

const TICKER_ITEMS = [
  '₹ Track Every Rupee',
  '📊 Visual Analytics',
  '🔒 Secure JWT Auth',
  '📱 Mobile Responsive',
  '💰 Budget Alerts',
  '📤 CSV Export',
  '🌙 Dark Mode',
  '⚡ Real-time Stats',
  '🏷️ 10 Categories',
  '🔍 Smart Search',
];

export default function HomePage() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PublicNavbar />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="animate-blob absolute top-20 left-10 w-96 h-96 bg-indigo-200 dark:bg-indigo-900 opacity-30 rounded-full blur-3xl" />
          <div className="animate-blob delay-2000 absolute top-40 right-10 w-80 h-80 bg-purple-200 dark:bg-purple-900 opacity-30 rounded-full blur-3xl" />
          <div className="animate-blob delay-3000 absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-200 dark:bg-cyan-900 opacity-20 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            Free & Open Source — Built with MERN Stack
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up delay-100 text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Track Your Money,{' '}
            <span className="shimmer-text">Master Your</span>
            <br />
            <span className="shimmer-text">Future.</span>
          </h1>

          <p className="animate-slide-up delay-200 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SpendWise is a full-stack expense tracker with beautiful charts, budget alerts, 
            smart search and ₹ INR support — built for modern Indians who want clarity on their finances.
          </p>

          {/* CTA Buttons */}
          <div className="animate-slide-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-lg font-semibold shadow-xl shadow-indigo-200 dark:shadow-indigo-900 hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              Start Tracking Free
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/pricing"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl text-lg font-semibold border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all hover:-translate-y-1"
            >
              View Pricing
            </Link>
          </div>

          {/* Hero mockup cards */}
          <div className="animate-slide-up delay-400 relative max-w-4xl mx-auto">
            {/* Floating stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Spent', value: '₹84,320', color: 'from-indigo-500 to-indigo-600', icon: '💸' },
                { label: 'This Month', value: '₹12,450', color: 'from-emerald-500 to-emerald-600', icon: '📅' },
                { label: 'Expenses', value: '247', color: 'from-amber-500 to-orange-500', icon: '📋' },
                { label: 'Avg Expense', value: '₹341', color: 'from-rose-500 to-pink-500', icon: '📊' },
              ].map((c, i) => (
                <div key={i} className={`animate-float delay-${(i+1)*200} p-4 rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-xl`}>
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className="text-xl font-bold">{c.value}</div>
                  <div className="text-xs opacity-80 mt-0.5">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Fake chart bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Spending — 2025</span>
                <span className="text-xs text-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-1 rounded-full">This Year</span>
              </div>
              <div className="flex items-end gap-2 h-24">
                {[35,55,40,70,45,90,60,80,50,75,40,65].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md transition-all ${i === 9 ? 'bg-indigo-500' : 'bg-indigo-200 dark:bg-indigo-800'}`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m,i) => (
                  <span key={i} className="flex-1 text-center text-xs text-gray-400">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ──────────────────────────────────────────────────────── */}
      <div className="bg-indigo-600 dark:bg-indigo-900 py-3 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-white text-sm font-medium px-8">
              {item} <span className="text-indigo-300">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest">Everything You Need</span>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2 mb-4">
            Built for real financial clarity
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            One subscription. No feature tiers. No hidden costs. Here's what SpendWise includes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2">Three steps to clarity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { num: '01', title: 'Sign Up Free', desc: 'Create your account in 30 seconds. No credit card, no commitment.', emoji: '🚀' },
              { num: '02', title: 'Add Expenses', desc: 'Log expenses by category, date, and payment method. Add notes and tags.', emoji: '📝' },
              { num: '03', title: 'See the Picture', desc: 'Your dashboard updates instantly with charts, stats, and budget status.', emoji: '📊' },
            ].map((step, i) => (
              <div key={i} className="reveal text-center" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
                  {step.emoji}
                </div>
                <div className="text-5xl font-black text-indigo-100 dark:text-indigo-900 mb-2">{step.num}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
          <StatItem value="10K+" label="Expenses Tracked" />
          <StatItem value="₹2Cr+" label="Money Managed" />
          <StatItem value="500+" label="Active Users" />
          <StatItem value="99.9%" label="Uptime" />
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest">Loved By Users</span>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2">What people are saying</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => <Testimonial key={t.name} {...t} />)}
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center reveal">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 shadow-2xl shadow-indigo-200 dark:shadow-indigo-900">
            <h2 className="text-4xl font-black text-white mb-4">Start tracking for free</h2>
            <p className="text-indigo-200 mb-8">No credit card needed. Set up in under 2 minutes.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Create Free Account
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Meet the Founder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">₹</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">SpendWise</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <Link to="/about" className="hover:text-indigo-600 transition">About</Link>
            <Link to="/pricing" className="hover:text-indigo-600 transition">Pricing</Link>
          </div>
          <p className="text-sm text-gray-400">© 2025 SpendWise. MIT License.</p>
        </div>
      </footer>
    </div>
  );
}
