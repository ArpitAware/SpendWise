/**
 * components/budget/BudgetCard.jsx
 * Displays budget limit vs actual spending with animated progress bar
 */

import { FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

const CATEGORY_EMOJI = {
  'Food & Dining': '🍔',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Bills & Utilities': '💡',
  'Healthcare': '💊',
  'Education': '📚',
  'Travel': '✈️',
  'Personal Care': '💆',
  'Other': '📦',
};

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const { category, limit, spent, remaining, usagePercent } = budget;

  // Determine status color based on usage
  const getStatusColor = () => {
    if (usagePercent >= 100) return { bar: 'bg-red-500', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (usagePercent >= budget.alertThreshold) return { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: '' };
  };

  const status = getStatusColor();
  const isOverBudget = usagePercent >= 100;
  const isWarning = usagePercent >= budget.alertThreshold && !isOverBudget;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 transition-all ${
      isOverBudget
        ? 'border-red-200 dark:border-red-800'
        : isWarning
        ? 'border-amber-200 dark:border-amber-800'
        : 'border-gray-100 dark:border-gray-700'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{CATEGORY_EMOJI[category] || '📦'}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{category}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Budget: ${limit.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Alert badge */}
        {(isOverBudget || isWarning) && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}>
            <FiAlertTriangle className="w-3 h-3" />
            {isOverBudget ? 'Over budget!' : 'Near limit'}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          <span>Spent: <span className="font-semibold text-gray-700 dark:text-gray-300">${spent.toFixed(2)}</span></span>
          <span>{Math.min(usagePercent, 100)}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${status.bar}`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Remaining */}
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {isOverBudget
            ? `$${(spent - limit).toFixed(2)} over budget`
            : `$${remaining.toFixed(2)} remaining`}
        </p>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(budget)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition"
            title="Edit budget"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(budget._id)}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
            title="Delete budget"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
