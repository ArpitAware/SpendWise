/**
 * components/expenses/FilterBar.jsx
 * Search input + category/date/payment filters
 */

import { FiSearch, FiX } from 'react-icons/fi';

const CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
  'Personal Care', 'Other',
];

const selectClass =
  'px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500';

export default function FilterBar({ filters, onChange }) {
  const hasActiveFilters =
    filters.search || filters.category || filters.startDate || filters.endDate || filters.paymentMethod;

  const clearAll = () =>
    onChange({ search: '', category: '', startDate: '', endDate: '', paymentMethod: '' });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search by title, notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className={selectClass}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Date Range */}
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onChange({ startDate: e.target.value })}
          className={selectClass}
          title="Start date"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onChange({ endDate: e.target.value })}
          className={selectClass}
          title="End date"
        />

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            onChange({ sortBy, order });
          }}
          className={selectClass}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 rounded-xl transition whitespace-nowrap"
          >
            <FiX className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
