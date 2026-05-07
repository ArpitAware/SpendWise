/**
 * pages/public/AboutPage.jsx
 * About page with founder section (inspired by Settleezy design)
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/home/PublicNavbar';
import { FiArrowRight, FiCode, FiHeart, FiAward, FiGlobe } from 'react-icons/fi';

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

const VALUES = [
  { icon: FiCode,   color: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400', title: 'Clean Code',       desc: 'Every component is well-documented, modular, and follows industry best practices.' },
  { icon: FiHeart,  color: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',         title: 'User First',       desc: 'Every design decision starts with what makes the experience simpler and more delightful.' },
  { icon: FiAward,  color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',     title: 'Portfolio Grade',  desc: 'Built to showcase real full-stack skills — from MongoDB aggregation to JWT refresh tokens.' },
  { icon: FiGlobe,  color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400', title: 'Open Source', desc: 'Free to use, fork, and learn from. Transparency is a feature, not an afterthought.' },
];

const TECH_STACK = [
  { name: 'MongoDB', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',       icon: '🍃' },
  { name: 'Express.js', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',            icon: '⚡' },
  { name: 'React 18', color: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400',           icon: '⚛️' },
  { name: 'Node.js', color: 'bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-400',            icon: '🟢' },
  { name: 'Tailwind CSS', color: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400',           icon: '🎨' },
  { name: 'JWT Auth', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400',   icon: '🔐' },
  { name: 'Recharts', color: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400',   icon: '📊' },
  { name: 'Vite', color: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',       icon: '⚡' },
];

export default function AboutPage() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PublicNavbar />

      {/* ── Page Hero ───────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-blob absolute top-10 left-1/4 w-72 h-72 bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-50" />
          <div className="animate-blob delay-2000 absolute top-10 right-1/4 w-60 h-60 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-50" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <span className="animate-slide-up inline-block text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">Our Story</span>
          <h1 className="animate-slide-up delay-100 text-5xl font-black text-gray-900 dark:text-white mb-6">
            Built with purpose,
            <span className="shimmer-text"> for real people.</span>
          </h1>
          <p className="animate-slide-up delay-200 text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
            SpendWise started as a portfolio project and became a tool people actually use. Here's the story behind it.
          </p>
        </div>
      </section>

      {/* ── Founder Section (Settleezy-inspired layout) ─────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">

          {/* Left: Founder photo */}
          <div className="relative p-8 lg:p-0">
            <div className="relative lg:h-full min-h-80">
              {/* Dark overlay card with photo placeholder */}
              <div className="lg:absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl lg:rounded-none flex flex-col items-center justify-center p-10">
                {/* Avatar circle (initials — replace src with real photo) */}
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-black shadow-2xl mb-6">
                  YN
                </div>
                <div className="text-center">
                  <p className="text-white text-xl font-bold">Your Name</p>
                  <p className="text-indigo-300 text-sm mt-1">Founder & Full-Stack Developer</p>
                </div>
                {/* Credential pills */}
                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                  {['MERN Developer', 'Open Source', 'India 🇮🇳'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Founder message */}
          <div className="p-8 lg:p-12">
            <span className="text-indigo-500 text-xs font-bold uppercase tracking-widest block mb-4">— A Message from the Founder</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              Built from <span className="text-indigo-600 dark:text-indigo-400">real frustration,</span> for real users.
            </h2>

            <blockquote className="border-l-4 border-indigo-500 pl-5 mb-6">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">
                "I couldn't find a simple, beautiful expense tracker that worked in ₹ INR and didn't charge me a subscription. So I built one — and made it completely free."
              </p>
            </blockquote>

            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <p>
                SpendWise was born out of a real problem: existing tools were either too complex, too expensive, or didn't support Indian currency properly. As a developer, I knew I could build something better.
              </p>
              <p>
                I designed every feature — from the MongoDB aggregation pipelines to the animated dashboard charts — to be both technically impressive and genuinely useful for everyday budgeting.
              </p>
              <p>
                This is not a side project collecting dust. It's a commitment to clean code, honest design, and financial clarity for everyone.
              </p>
            </div>

            {/* Credential badges */}
            <div className="flex flex-wrap gap-3 mt-8">
              {[
                { icon: '✅', text: 'Full-Stack MERN Developer' },
                { icon: '🇮🇳', text: 'Based in India' },
                { icon: '🎓', text: 'Computer Science Graduate' },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
                  <span>{b.icon}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest">What We Stand For</span>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2">Our values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((v, i) => (
            <div key={v.title} className={`reveal delay-${(i+1)*100} p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 card-hover flex gap-4`}>
              <div className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center flex-shrink-0`}>
                <v.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{v.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest">Technology</span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2">Built with modern tools</h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center reveal">
            {TECH_STACK.map((t) => (
              <div key={t.name} className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${t.color} border-current/20 font-medium text-sm card-hover`}>
                <span>{t.icon}</span> {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto reveal">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Ready to start?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Join hundreds of users who track their money with SpendWise.</p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            Create Free Account
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-4 text-center text-sm text-gray-400">
        <p>© 2025 SpendWise — MIT License. Made with ❤️ in India 🇮🇳</p>
      </footer>
    </div>
  );
}
