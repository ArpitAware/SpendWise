/**
 * components/home/PublicNavbar.jsx
 * Theme toggle REMOVED from public pages — dark design is fixed aesthetic
 */
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiGrid, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appDropOpen, setAppDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setAppDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/pricing', label: 'Pricing' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/10 shadow-xl'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-lg">₹</span>
            </div>
            <span className="font-black text-xl text-white tracking-tight">SpendWise</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} end
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/8'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side — NO theme toggle here */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              /* Logged-in: dropdown with Dashboard + Profile */
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setAppDropOpen(!appDropOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.name?.split(' ')[0]}
                  <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${appDropOpen ? 'rotate-180' : ''}`} />
                </button>
                {appDropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-slide-up">
                    <Link to="/dashboard" onClick={() => setAppDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 transition">
                      <FiGrid className="w-4 h-4 text-indigo-400" /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setAppDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 transition">
                      <FiUser className="w-4 h-4 text-indigo-400" /> Profile
                    </Link>
                    <hr className="my-1 border-white/10" />
                    <button onClick={() => { logout(); setAppDropOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition">
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition">
                  Log in
                </Link>
                <Link to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-xl text-gray-300 hover:bg-white/10 transition" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-4 bg-gray-950/95 rounded-b-2xl">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} end onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'
                  }`
                }
              >{label}</NavLink>
            ))}
            <div className="flex gap-2 mt-3 px-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="flex-1 text-center py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">Dashboard</Link>
                  <Link to="/profile"   className="flex-1 text-center py-2.5 border border-white/20 text-white rounded-xl text-sm font-medium">Profile</Link>
                </>
              ) : (
                <>
                  <Link to="/login"    className="flex-1 text-center py-2.5 border border-white/20 text-white rounded-xl text-sm">Log in</Link>
                  <Link to="/register" className="flex-1 text-center py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
