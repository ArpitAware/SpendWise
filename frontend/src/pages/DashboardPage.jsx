/**
 * pages/DashboardPage.jsx
 * Fixed: stats use useCurrency for formatting, error state handled
 */

import { useEffect, useState, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { expenseAPI } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import {
  FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity, FiRefreshCw,
} from 'react-icons/fi';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#6366f1','#22d3ee','#f59e0b','#10b981','#f43f5e','#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16'];

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white truncate">{value}</div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatAmount } = useCurrency();
  const year = new Date().getFullYear();

  const loadStats = useCallback(() => {
    setLoading(true);
    setError(null);
    expenseAPI
      .getStats({ year })
      .then(({ data }) => setStats(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, [year]);

  useEffect(() => { loadStats(); }, [loadStats]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        <p className="text-sm text-gray-400">Loading your stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
        <button
          onClick={loadStats}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
        >
          <FiRefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  // Build 12-month array, filling missing months with 0
  const monthlyData = MONTHS.map((name, i) => {
    const found = stats?.monthly?.find((m) => m.month === i + 1);
    return { name, total: found?.total || 0, count: found?.count || 0 };
  });

  const totalSpent   = stats?.totals?.totalSpent   || 0;
  const totalCount   = stats?.totals?.totalExpenses || 0;
  const avgExpense   = stats?.totals?.avgExpense    || 0;
  const thisMonth    = monthlyData[new Date().getMonth()].total;
  const byCategory   = stats?.byCategory || [];

  // Custom tooltip formatter using currency context
  const CurrencyTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-lg">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="font-bold text-gray-900 dark:text-white">{formatAmount(payload[0].value)}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview for {year}</p>
        </div>
        <button
          onClick={loadStats}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition"
        >
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Spent"      value={formatAmount(totalSpent)} icon={FiDollarSign}  color="bg-indigo-500" />
        <StatCard title="This Month"       value={formatAmount(thisMonth)}  icon={FiActivity}    color="bg-emerald-500" />
        <StatCard title="Total Expenses"   value={totalCount}               icon={FiTrendingUp}  color="bg-amber-500" />
        <StatCard title="Avg per Expense"  value={formatAmount(avgExpense)} icon={FiTrendingDown} color="bg-rose-500" />
      </div>

      {/* Monthly Area Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Spending — {year}</h2>
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <span className="text-4xl mb-3">📊</span>
            <p className="text-sm">Add some expenses to see your spending chart</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatAmount(v).split('.')[0]} />
              <Tooltip content={<CurrencyTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Charts row */}
      {byCategory.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={({ category, percent }) => `${category.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [formatAmount(v), 'Spent']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Categories</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byCategory.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => formatAmount(v).split('.')[0]} />
                <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [formatAmount(v), 'Spent']} />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {byCategory.slice(0, 5).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Empty state for new users */}
      {totalCount === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <span className="text-5xl block mb-4">💸</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No expenses yet</h3>
          <p className="text-gray-400 text-sm">Head to the Expenses page and add your first expense to see your dashboard come alive.</p>
        </div>
      )}
    </div>
  );
}
