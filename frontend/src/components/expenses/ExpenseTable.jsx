/**
 * components/expenses/ExpenseTable.jsx
 * Responsive table/card list for expenses with edit/delete actions
 */

import { format } from 'date-fns';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const CATEGORY_COLORS = {
  'Food & Dining':     'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Transportation':    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Shopping':          'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'Entertainment':     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Bills & Utilities': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Healthcare':        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Education':         'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Travel':            'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Personal Care':     'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'Other':             'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function ExpenseTable({ expenses, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 dark:border-gray-700/50 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-28" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
        <p className="text-4xl mb-3">🧾</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No expenses found.</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Try adjusting your filters or add a new expense.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Title</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Payment</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{expense.title}</div>
                  {expense.notes && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-xs">{expense.notes}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                  ${expense.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS['Other']}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {format(new Date(expense.date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 capitalize">
                  {expense.paymentMethod?.replace('_', ' ')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
        {expenses.map((expense) => (
          <div key={expense._id} className="px-4 py-4 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{expense.title}</p>
                <span className="font-semibold text-gray-900 dark:text-white text-sm flex-shrink-0">
                  ${expense.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS['Other']}`}>
                  {expense.category}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {format(new Date(expense.date), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => onEdit(expense)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg transition">
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(expense._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
