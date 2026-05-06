/**
 * components/budget/BudgetForm.jsx
 */

import { useForm } from 'react-hook-form';

const CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
  'Personal Care', 'Other',
];

const inputClass =
  'w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

export default function BudgetForm({ initialData, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData || { alertThreshold: 80 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Category</label>
        <select
          {...register('category', { required: 'Category is required' })}
          className={inputClass}
          disabled={!!initialData}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Monthly Limit ($)</label>
        <input
          type="number"
          step="0.01"
          min="1"
          {...register('limit', {
            required: 'Limit is required',
            min: { value: 1, message: 'Must be at least $1' },
            valueAsNumber: true,
          })}
          className={inputClass}
          placeholder="500.00"
        />
        {errors.limit && <p className="mt-1 text-xs text-red-500">{errors.limit.message}</p>}
      </div>

      <div>
        <label className={labelClass}>
          Alert Threshold — <span className="text-indigo-600 dark:text-indigo-400">notify me at</span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="1"
            max="100"
            {...register('alertThreshold', {
              required: true,
              min: 1,
              max: 100,
              valueAsNumber: true,
            })}
            className={inputClass}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
        </div>
        <p className="mt-1 text-xs text-gray-400">You'll be alerted when this percentage of your budget is used.</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Budget' : 'Set Budget'}
        </button>
      </div>
    </form>
  );
}
