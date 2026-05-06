/**
 * pages/DashboardPage.jsx
 * Main dashboard with stat cards, monthly chart, and category breakdown
 */

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { expenseAPI } from '../services/api';
import { format } from 'date-fns';
import {
  FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity,
} from 'react-icons/fi';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#6366f1','#22d3ee','#f59e0b','#10b981','#f43f5e','#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16'];

// ─── Stat Card Component ─────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
    {trend && (
      <div className="flex items-center gap-1 text-sm">
        {trend > 0 ? (
          <FiTrendingUp className="text-red-500 w-4 h-4" />
        ) : (
          <FiTrendingDown className="text-green-500 w-4 h-4" />
        )}
        <span className={trend > 0 ? 'text-red-500' : 'text-green-500'}>
          {Math.abs(trend)}% vs last month
        </span>
      </div>
    )}
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    expenseAPI
      .getStats({ year })
      .then(({ data }) => setStats(data.data))
      .finally(() => setLoading(false));
  }, [year]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Build full 12-month array (fill missing months with 0)
  const monthlyData = MONTHS.map((name, i) => {
    const found = stats?.monthly?.find((m) => m.month === i + 1);
    return { name, total: found?.total || 0, count: found?.count || 0 };
  });

  const totalSpent = stats?.totals?.totalSpent || 0;
  const totalCount = stats?.totals?.totalExpenses || 0;
  const avgExpense = stats?.totals?.avgExpense || 0;
  const currentMonth = new Date().getMonth();
  const thisMonth = monthlyData[currentMonth].total;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Overview for {year}
        </p>
      </div>

      {/* ─── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          icon={FiDollarSign}
          color="bg-indigo-500"
        />
        <StatCard
          title="This Month"
          value={`$${thisMonth.toFixed(2)}`}
          icon={FiActivity}
          color="bg-emerald-500"
        />
        <StatCard
          title="Total Expenses"
          value={totalCount}
          icon={FiTrendingUp}
          color="bg-amber-500"
        />
        <StatCard
          title="Avg per Expense"
          value={`$${avgExpense.toFixed(2)}`}
          icon={FiTrendingDown}
          color="bg-rose-500"
        />
      </div>

      {/* ─── Monthly Area Chart ──────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Spending — {year}
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ─── Category Pie Chart ──────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={stats?.byCategory || []}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ category, percent }) =>
                  `${category} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {(stats?.byCategory || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ─── Top Categories Bar Chart ─────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Categories
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={(stats?.byCategory || []).slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
              <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                {(stats?.byCategory || []).slice(0, 5).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
