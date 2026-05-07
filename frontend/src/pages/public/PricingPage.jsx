/**
 * pages/public/PricingPage.jsx - Full dark redesign
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/home/PublicNavbar';
import { FiCheck, FiArrowRight, FiZap, FiShield, FiPieChart, FiUsers, FiStar, FiDownload } from 'react-icons/fi';

function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const FEATURE_GROUPS = [
  {
    icon: FiPieChart, gradient:'from-emerald-500 to-teal-600',
    bg:'bg-emerald-500/5 border-emerald-500/15',
    title:'Expense Tracking',
    features:['Add, edit & delete expenses','Full-text search','Date & category filters','Payment method tracking','Notes & tags','Pagination support'],
  },
  {
    icon: FiZap, gradient:'from-indigo-500 to-blue-600',
    bg:'bg-indigo-500/5 border-indigo-500/15',
    title:'Dashboard & Analytics',
    features:['Monthly area chart','Category pie chart','Top categories bar chart','YTD totals & averages','Real-time aggregation','Refresh on demand'],
  },
  {
    icon: FiShield, gradient:'from-purple-500 to-violet-600',
    bg:'bg-purple-500/5 border-purple-500/15',
    title:'Budgeting',
    features:['Monthly budget limits','Per-category budgets','Animated progress bars','Threshold alerts (0–100%)','Spending vs limit live','Budget reset each month'],
  },
  {
    icon: FiUsers, gradient:'from-rose-500 to-pink-600',
    bg:'bg-rose-500/5 border-rose-500/15',
    title:'Account & Security',
    features:['JWT + refresh rotation','Bcrypt passwords (cost 12)','Profile customization','8 currency support','Dark/light/system theme','Rate limiting + Helmet'],
  },
  {
    icon: FiDownload, gradient:'from-amber-500 to-orange-600',
    bg:'bg-amber-500/5 border-amber-500/15',
    title:'Data & Export',
    features:['One-click CSV export','Full expense history','Sort by any field','No data limits','Date-range export','All fields included'],
  },
  {
    icon: FiStar, gradient:'from-cyan-500 to-sky-600',
    bg:'bg-cyan-500/5 border-cyan-500/15',
    title:'Developer Quality',
    features:['MVC architecture','express-validator inputs','Compound MongoDB indexes','Axios refresh interceptor','Lazy-loaded pages','Winston structured logs'],
  },
];

const FREE_FEATURES = [
  'Unlimited expenses — no cap',
  'All 3 dashboard chart types',
  'Monthly budget tracking',
  'CSV export — always free',
  'Dark/light mode',
  '₹ INR + 7 other currencies',
  'JWT authentication',
  'Mobile responsive UI',
  'No ads, no tracking',
];

export default function PricingPage() {
  const [billing, setBilling] = useState('yearly');
  useScrollReveal();

  return (
    <div className="min-h-screen bg-gray-950">
      <PublicNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
          <div className="animate-blob absolute top-20 left-1/4 w-72 h-72 bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="animate-blob delay-2000 absolute top-20 right-1/4 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="animate-slide-up inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 text-indigo-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            One Plan. Everything Included.
          </div>
          <h1 className="animate-slide-up delay-100 text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Simple,{' '}
            <span className="shimmer-text">honest</span>{' '}
            pricing.
          </h1>
          <p className="animate-slide-up delay-200 text-xl text-gray-500 max-w-2xl mx-auto">
            No tiers, no feature gates, no surprises. SpendWise gives you everything from day one — completely free.
          </p>
        </div>
      </section>

      {/* ── Pricing Card ─────────────────────────────────────────────────── */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto reveal">
          {/* Billing toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-900 border border-white/8 rounded-2xl p-1 gap-1">
              {['monthly','yearly'].map((b) => (
                <button key={b} onClick={() => setBilling(b)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${
                    billing === b
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}>
                  {b}
                  {b === 'yearly' && <span className="ml-1.5 text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Save 33%</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="relative rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl shadow-indigo-500/10">
            {/* Gradient border glow */}
            <div className="absolute inset-0 rounded-3xl" style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.05),rgba(99,102,241,0.1))', pointerEvents:'none' }} />

            {/* Full Access badge */}
            <div className="flex justify-center pt-6">
              <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                ✦ Full Access
              </span>
            </div>

            <div className="p-8">
              {/* App branding */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">₹</span>
                </div>
                <div>
                  <p className="font-black text-white text-lg">SpendWise</p>
                  <p className="text-gray-500 text-sm">Expense & Budget Tracker</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black text-white">₹0</span>
                </div>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-bold px-3 py-1.5 rounded-full">
                    ⭐ Always Free — Open Source
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {billing === 'yearly' ? 'Self-host or use the demo — free forever.' : 'No subscription, no credit card needed.'}
                </p>
              </div>

              <hr className="border-white/5 my-6" />

              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <FiCheck className="w-3 h-3 text-emerald-400" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/register"
                className="group flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
                Get Started Free
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-center text-xs text-gray-600 mt-4">
                ₹0 forever · No credit card · Full access from day one
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Everything You Get ───────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6" style={{ background:'linear-gradient(180deg,rgba(99,102,241,0.04) 0%,transparent 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-4xl font-black text-white mb-3">Everything You Get</h2>
            <p className="text-gray-500">One plan. No feature tiers. No hidden costs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURE_GROUPS.map((g, i) => (
              <div key={g.title} className={`reveal delay-${(i%3+1)*100} p-6 rounded-2xl border ${g.bg} card-hover`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.gradient} flex items-center justify-center flex-shrink-0`}>
                    <g.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white">{g.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {g.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
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

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12 reveal">
          <h2 className="text-4xl font-black text-white">Frequently asked</h2>
        </div>
        <div className="space-y-3 reveal">
          {[
            { q:'Is SpendWise really free?', a:'Yes — completely free and open source. No subscription, no credit card, no feature limits. You can also self-host it using the MIT-licensed codebase.' },
            { q:'Does it support Indian Rupee (₹)?', a:'Yes! ₹ INR is the default currency. Switch to USD, EUR, GBP, JPY, CAD, AUD, SGD, or AED anytime from the navbar or Profile settings.' },
            { q:'Is my financial data secure?', a:'Passwords are bcrypt-hashed (cost 12), JWT uses refresh token rotation, and the API has rate limiting, Helmet headers, and NoSQL injection protection.' },
            { q:'Why is the dashboard chart empty?', a:'The chart uses MongoDB aggregation with proper ObjectId casting — it updates in real time as you add expenses. Try adding a few expenses first.' },
            { q:'What tech stack is it built on?', a:'MongoDB + Express.js + React 18 + Node.js (MERN). Recharts for charts, Tailwind CSS, Axios with interceptors, JWT auth, and Vite as the build tool.' },
          ].map(({ q, a }) => (
            <details key={q} className="group bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-indigo-500/20 transition-all">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between list-none">
                {q}
                <span className="text-indigo-400 group-open:rotate-45 transition-transform text-2xl leading-none ml-4 flex-shrink-0">+</span>
              </summary>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto reveal">
          <div className="relative rounded-3xl overflow-hidden p-12"
            style={{ background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%)' }}>
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'30px 30px' }} />
            <div className="relative">
              <h2 className="text-3xl font-black text-white mb-4">Start tracking today</h2>
              <p className="text-indigo-300 mb-8">₹0 forever. No credit card. No catch.</p>
              <Link to="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                Create Free Account
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-4 text-center text-sm text-gray-700">
        <p>© 2025 SpendWise — MIT License. Made with ❤️ in India 🇮🇳</p>
      </footer>
    </div>
  );
}
