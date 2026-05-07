/**
 * pages/public/HomePage.jsx
 * COMPLETE OVERHAUL:
 * - Dark premium aesthetic throughout
 * - 3D floating elements with CSS perspective
 * - Dynamic live chart when logged in
 * - Animated demo dashboard for logged-out users
 * - Scroll reveal, particle bg, glassmorphism cards
 * - Overscroll bg matches dark theme (no white flash)
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { expenseAPI } from '../../services/api';
import PublicNavbar from '../../components/home/PublicNavbar';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  FiTrendingUp, FiShield, FiZap, FiPieChart, FiBell,
  FiDownload, FiStar, FiArrowRight, FiCheck, FiGrid,
} from 'react-icons/fi';

// ── Scroll reveal ────────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal,.reveal-left').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── 3D card mouse tilt ───────────────────────────────────────────────────────
function use3DTilt(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`;
    };
    const onLeave = () => { el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [ref]);
}

// ── Demo data for logged-out hero ────────────────────────────────────────────
const DEMO_MONTHS = [
  {name:'J',total:8200},{name:'F',total:12400},{name:'M',total:9800},
  {name:'A',total:15600},{name:'M',total:11200},{name:'J',total:18900},
  {name:'J',total:14300},{name:'A',total:22100},{name:'S',total:16800},
  {name:'O',total:25400},{name:'N',total:19200},{name:'D',total:28700},
];
const DEMO_CATS = [
  {category:'Food & Dining',total:28400},
  {category:'Transport',total:15200},
  {category:'Shopping',total:22800},
  {category:'Bills',total:18600},
  {category:'Entertainment',total:9400},
];
const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981'];
const MONTHS_FULL = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const FEATURES = [
  { icon: FiPieChart,   color:'from-indigo-500 to-indigo-700',  title:'Smart Dashboard',    desc:'Real-time charts update as you add expenses. Area charts, pie charts, and bar charts give you complete clarity.' },
  { icon: FiShield,     color:'from-purple-500 to-purple-700',  title:'Budget Alerts',       desc:'Set monthly limits per category. Get alerted at your chosen threshold — 70%, 80%, or 90%. You decide.' },
  { icon: FiTrendingUp, color:'from-pink-500 to-rose-600',      title:'Expense Tracking',    desc:'10 categories, UPI/card/cash tracking, notes, tags, full-text search and powerful date-range filters.' },
  { icon: FiZap,        color:'from-amber-500 to-orange-600',   title:'Instant Insights',    desc:'MongoDB aggregation pipelines compute your year-over-year trends and category breakdowns in milliseconds.' },
  { icon: FiDownload,   color:'from-emerald-500 to-teal-600',   title:'CSV Export',          desc:'Download your complete expense history as CSV. Filter by date range before exporting for custom reports.' },
  { icon: FiBell,       color:'from-cyan-500 to-sky-600',       title:'Live Budget Status',  desc:'Animated progress bars show spending vs limit in real time. Red when over, amber when warning, green when safe.' },
];

const TESTIMONIALS = [
  { name:'Arjun Mehta', role:'Software Engineer, Bangalore', text:'The dashboard is stunning. Charts update live and INR support just works out of the box. I use it every single day.', rating:5 },
  { name:'Priya Sharma', role:'Freelance Designer, Mumbai', text:'Budget alerts literally saved me ₹8,000 last month. The UI is so clean, feels like a premium app.', rating:5 },
  { name:'Rohit Verma', role:'MBA Student, Delhi', text:'Best MERN project I\'ve seen. Clean code, real features. The animated landing page alone is portfolio-worthy.', rating:5 },
];

const TICKER = ['₹ Track Every Rupee','📊 Live Charts','🔒 JWT Auth','📱 Mobile First','💰 Budget Alerts','📤 CSV Export','🌙 Dark Mode','⚡ Real-time','🏷️ 10 Categories','🔍 Smart Search','🎯 Budget Goals','💳 UPI Support'];

// ── Animated counter ────────────────────────────────────────────────────────
function AnimatedNumber({ target, prefix='', suffix='' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setVal(target); clearInterval(t); }
          else setVal(Math.floor(start));
        }, 16);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>;
}

// ── Live dashboard preview (logged in) ───────────────────────────────────────
function LiveDashboard({ stats, formatAmount }) {
  const totalSpent = stats?.totals?.totalSpent || 0;
  const thisMonth = stats?.monthly?.find(m => m.month === new Date().getMonth() + 1)?.total || 0;
  const totalCount = stats?.totals?.totalExpenses || 0;
  const monthlyData = MONTHS_FULL.map((name, i) => {
    const found = stats?.monthly?.find(m => m.month === i + 1);
    return { name, total: found?.total || 0 };
  });
  const byCategory = stats?.byCategory || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Total Spent',    val: formatAmount(totalSpent), color:'from-indigo-600 to-indigo-800' },
          { label:'This Month',     val: formatAmount(thisMonth),  color:'from-purple-600 to-purple-800' },
          { label:'# Expenses',     val: totalCount,               color:'from-rose-600 to-rose-800'    },
        ].map((c) => (
          <div key={c.label} className={`p-4 rounded-2xl bg-gradient-to-br ${c.color} shadow-lg`}>
            <div className="text-lg font-black text-white truncate">{c.val}</div>
            <div className="text-white/60 text-xs mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
      {totalCount > 0 ? (
        <>
          <div className="bg-gray-800/60 rounded-2xl p-4">
            <p className="text-xs text-gray-400 font-medium mb-3">Monthly Spending {new Date().getFullYear()}</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize:10, fill:'#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [formatAmount(v),'Spent']} contentStyle={{ background:'#1f2937', border:'none', borderRadius:12, fontSize:12 }} />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} fill="url(#lg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {byCategory.length > 0 && (
            <div className="bg-gray-800/60 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-medium mb-3">By Category</p>
              <div className="space-y-2">
                {byCategory.slice(0,4).map((c,i) => (
                  <div key={c.category} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:COLORS[i]}} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300 truncate">{c.category}</span>
                        <span className="text-white font-semibold ml-2">{formatAmount(c.total)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${Math.min(100,(c.total/byCategory[0].total)*100)}%`, background:COLORS[i] }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Link to="/dashboard" className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-semibold transition group">
            <FiGrid className="w-4 h-4" />
            Open Full Dashboard
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </>
      ) : (
        <div className="bg-gray-800/60 rounded-2xl p-6 text-center">
          <span className="text-3xl block mb-2">💸</span>
          <p className="text-gray-300 text-sm font-medium">No expenses yet</p>
          <p className="text-gray-500 text-xs mt-1">Add your first expense to see live charts here</p>
          <Link to="/expenses" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition">
            Add Expense →
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Animated demo (logged out) ────────────────────────────────────────────────
function DemoPreview() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(i => (i+1)%12), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label:'Total Spent',  val:'₹84,320', color:'from-indigo-600 to-indigo-800', emoji:'💸' },
          { label:'This Month',   val:'₹12,450', color:'from-purple-600 to-purple-800', emoji:'📅' },
          { label:'# Expenses',   val:'247',     color:'from-rose-500 to-rose-700',     emoji:'📋' },
          { label:'Avg Expense',  val:'₹341',    color:'from-amber-500 to-orange-600',  emoji:'📊' },
        ].map((c,i) => (
          <div key={c.label} className={`p-4 rounded-2xl bg-gradient-to-br ${c.color} shadow-lg animate-float delay-${(i+1)*100}`}>
            <div className="text-xl mb-0.5">{c.emoji}</div>
            <div className="text-lg font-black text-white">{c.val}</div>
            <div className="text-white/60 text-xs">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Animated bar chart */}
      <div className="bg-gray-800/60 backdrop-blur rounded-2xl p-4">
        <div className="flex justify-between text-xs text-gray-400 mb-3">
          <span className="font-medium">Monthly Spending — 2025</span>
          <span className="text-indigo-400">This Year</span>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {DEMO_MONTHS.map((m,i) => (
            <div key={m.name} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full rounded-t-md transition-all duration-500 ${
                i === active ? 'bg-indigo-500 shadow-lg shadow-indigo-500/40' : 'bg-gray-700'
              }`} style={{ height:`${(m.total/28700)*100}%`, minHeight:4 }} />
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          {DEMO_MONTHS.map((m,i) => (
            <span key={m.name} className={`flex-1 text-center text-[10px] transition-colors ${i === active ? 'text-indigo-400 font-bold' : 'text-gray-600'}`}>{m.name}</span>
          ))}
        </div>
      </div>

      {/* Category mini breakdown */}
      <div className="bg-gray-800/60 backdrop-blur rounded-2xl p-4">
        <p className="text-xs text-gray-400 font-medium mb-3">Top Categories</p>
        <div className="space-y-2">
          {DEMO_CATS.map((c,i) => (
            <div key={c.category} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{background:COLORS[i]}} />
              <span className="text-xs text-gray-300 flex-1">{c.category}</span>
              <span className="text-xs font-semibold text-white">₹{(c.total/1000).toFixed(1)}K</span>
            </div>
          ))}
        </div>
      </div>

      <Link to="/register" className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-indigo-500/30 transition-all group">
        Get Your Own Dashboard Free
        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { formatAmount } = useCurrency();
  const [stats, setStats] = useState(null);
  const card3dRef = useRef(null);
  useScrollReveal();
  use3DTilt(card3dRef);

  useEffect(() => {
    if (user) {
      expenseAPI.getStats({ year: new Date().getFullYear() })
        .then(({ data }) => setStats(data.data))
        .catch(() => {});
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-950" style={{ overscrollBehavior:'none' }}>
      <PublicNavbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 70%)' }} />
          <div className="animate-blob absolute top-40 left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="animate-blob delay-3000 absolute top-60 right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="animate-blob delay-2000 absolute bottom-20 left-1/2 w-72 h-72 bg-pink-600/8 rounded-full blur-3xl" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage:'linear-gradient(rgba(99,102,241,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,1) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
          {/* Radial vignette */}
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at center,transparent 40%,#030712 100%)' }} />
        </div>

        {/* 3D floating icons */}
        <div className="absolute top-32 right-[10%] animate-float delay-100 opacity-20">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-2xl" style={{ transform:'perspective(400px) rotateY(-20deg) rotateX(10deg)' }}>💸</div>
        </div>
        <div className="absolute top-60 left-[8%] animate-float-slow delay-300 opacity-20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl shadow-2xl" style={{ transform:'perspective(400px) rotateY(15deg) rotateX(-8deg)' }}>📊</div>
        </div>
        <div className="absolute bottom-40 right-[15%] animate-float delay-500 opacity-15">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-xl shadow-2xl" style={{ transform:'perspective(400px) rotateY(20deg) rotateX(12deg)' }}>🎯</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <div className="animate-slide-up">
              {user ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Welcome back, {user.name?.split(' ')[0]}! 👋
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                  Free & Open Source — MERN Stack
                </div>
              )}
            </div>

            <h1 className="animate-slide-up delay-100 text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              Track money.<br />
              <span className="shimmer-text">Live smarter.</span>
            </h1>

            <p className="animate-slide-up delay-200 text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
              {user
                ? `Your financial dashboard is ready. ${stats?.totals?.totalExpenses || 0} expenses tracked, ${stats?.byCategory?.length || 0} categories active.`
                : 'A beautiful expense tracker with live charts, budget alerts, INR support, and CSV export — built on the MERN stack. 100% free.'
              }
            </p>

            <div className="animate-slide-up delay-300 flex flex-col sm:flex-row gap-4 mb-12">
              {user ? (
                <>
                  <Link to="/dashboard"
                    className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-1">
                    <FiGrid className="w-5 h-5" />
                    Open Dashboard
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/expenses"
                    className="flex items-center justify-center gap-2 px-8 py-4 glass text-white rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all hover:-translate-y-1 border border-white/10">
                    + Add Expense
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register"
                    className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-1">
                    Start for Free
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/pricing"
                    className="flex items-center justify-center gap-2 px-8 py-4 glass text-white rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all hover:-translate-y-1 border border-white/10">
                    View Pricing
                  </Link>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="animate-slide-up delay-400 flex flex-wrap gap-4">
              {['₹0 forever','JWT secured','INR + 8 currencies','Mobile-first'].map((b) => (
                <div key={b} className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <FiCheck className="w-3.5 h-3.5 text-emerald-500" /> {b}
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Dashboard Preview */}
          <div className="animate-slide-up delay-300">
            <div ref={card3dRef} className="relative transition-transform duration-150"
              style={{ transformStyle:'preserve-3d' }}>
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl" />
              
              <div className="relative glass-dark rounded-3xl p-6 shadow-2xl border border-indigo-500/20"
                style={{ transform:'translateZ(0)' }}>
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex-1 mx-3 h-6 bg-white/5 rounded-lg flex items-center px-3">
                    <span className="text-gray-600 text-xs">spendwise.app/dashboard</span>
                  </div>
                </div>

                {user ? (
                  <LiveDashboard stats={stats} formatAmount={formatAmount} />
                ) : (
                  <DemoPreview />
                )}
              </div>

              {/* Floating 3D accent cards */}
              <div className="absolute -top-4 -right-4 animate-float delay-200">
                <div className="glass-dark rounded-xl p-3 shadow-xl border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <span className="text-emerald-400 text-xs font-semibold">Budget on track</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 animate-float-slow delay-400">
                <div className="glass-dark rounded-xl p-3 shadow-xl border border-indigo-500/20">
                  <div className="text-indigo-400 text-xs font-semibold">+₹2,400 saved this month 🎉</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ──────────────────────────────────────────────────────── */}
      <div className="relative py-4 border-y border-white/5 overflow-hidden" style={{background:'linear-gradient(90deg,rgba(99,102,241,0.08),rgba(168,85,247,0.08),rgba(99,102,241,0.08))'}}>
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER,...TICKER].map((item,i) => (
            <span key={i} className="inline-flex items-center text-gray-400 text-sm font-medium px-8">
              {item} <span className="ml-8 text-indigo-600">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest">Everything You Need</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
            Built for real financial clarity
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            One plan. No feature tiers. No hidden costs. Every feature from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`reveal delay-${(i%3+1)*100} group relative p-6 bg-gray-900 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 card-hover overflow-hidden`}>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background:'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.08), transparent 70%)' }} />
              <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="relative font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="relative text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 border-y border-white/5" style={{ background:'linear-gradient(180deg,rgba(99,102,241,0.03) 0%,transparent 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl font-black text-white mt-3">Up and running in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            {[
              { num:'01', emoji:'🚀', title:'Sign Up Free',    desc:'Create your account in 30 seconds. No credit card, no commitment, no hidden fees.' },
              { num:'02', emoji:'📝', title:'Add Expenses',    desc:'Log expenses by category, date, and payment method. Supports UPI, card, cash.' },
              { num:'03', emoji:'📊', title:'See Your Trends', desc:'Your dashboard populates instantly with live charts, budget status, and insights.' },
            ].map((s,i) => (
              <div key={s.num} className={`reveal delay-${(i+1)*100} text-center`}>
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl mb-4 shadow-xl shadow-indigo-500/30 animate-pulse-glow">
                  {s.emoji}
                </div>
                <div className="text-5xl font-black text-white/5 mb-2 -mt-2">{s.num}</div>
                <h3 className="font-bold text-white text-lg mb-2 -mt-8">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background:'linear-gradient(135deg,#312e81 0%,#4c1d95 50%,#1e1b4b 100%)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
          {[
            { target:10000, suffix:'+', label:'Expenses Tracked' },
            { target:200,   suffix:'Cr+', prefix:'₹', label:'Money Managed' },
            { target:500,   suffix:'+', label:'Active Users' },
            { target:100,   suffix:'%', label:'Free Forever' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-1">
                <AnimatedNumber target={s.target} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-indigo-300 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest">Loved By Users</span>
          <h2 className="text-4xl font-black text-white mt-3">What people say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t,i) => (
            <div key={t.name} className={`reveal delay-${(i+1)*100} p-6 bg-gray-900 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all card-hover`}>
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_,j) => <FiStar key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-gray-600 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto reveal">
          <div className="relative rounded-3xl overflow-hidden p-12 text-center" style={{ background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#4c1d95 100%)' }}>
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-4xl font-black text-white mb-4">
                {user ? 'Your dashboard awaits.' : 'Start tracking for free.'}
              </h2>
              <p className="text-indigo-300 mb-8 text-lg">
                {user ? `${stats?.totals?.totalExpenses || 0} expenses logged. Keep going!` : 'No credit card. No subscription. 100% free forever.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <>
                    <Link to="/dashboard" className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                      <FiGrid className="w-5 h-5" />
                      Open Dashboard
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/expenses" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-2xl font-semibold text-lg hover:bg-white/15 transition-all border border-white/10">
                      + Add Expense
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                      Create Free Account
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/about" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-2xl font-semibold text-lg hover:bg-white/15 transition-all border border-white/10">
                      Meet the Builder
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">₹</span>
            </div>
            <span className="font-black text-white">SpendWise</span>
          </Link>
          <div className="flex gap-6 text-sm text-gray-600">
            {[['/', 'Home'], ['/about', 'About'], ['/pricing', 'Pricing'], ['/login', 'Login']].map(([to, label]) => (
              <Link key={to} to={to} className="hover:text-indigo-400 transition">{label}</Link>
            ))}
          </div>
          <p className="text-gray-700 text-sm">© 2025 SpendWise — MIT License 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
}
