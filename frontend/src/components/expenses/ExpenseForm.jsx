/**
 * components/expenses/ExpenseForm.jsx
 * Add / Edit expense form using react-hook-form
 */

import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

const CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
  'Personal Care', 'Other',
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
];

export default function ExpenseForm({ initialData, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData
      ? {
          ...initialData,
          date: format(new Date(initialData.date), 'yyyy-MM-dd'),
        }
      : {
          date: format(new Date(), 'yyyy-MM-dd'),
          paymentMethod: 'other',
        },
  });

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';
  const errorClass = 'mt-1 text-xs text-red-500';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className={labelClass}>Title</label>
        <input
          {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Max 100 chars' } })}
          className={inputClass}
          placeholder="e.g. Grocery run"
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      {/* Amount + Date side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Amount ($)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Must be > 0' },
              valueAsNumber: true,
            })}
            className={inputClass}
            placeholder="0.00"
          />
          {errors.amount && <p className={errorClass}>{errors.amount.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            className={inputClass}
          />
          {errors.date && <p className={errorClass}>{errors.date.message}</p>}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>Category</label>
        <select
          {...register('category', { required: 'Category is required' })}
          className={inputClass}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className={errorClass}>{errors.category.message}</p>}
      </div>

      {/* Payment Method */}
      <div>
        <label className={labelClass}>Payment Method</label>
        <select {...register('paymentMethod')} className={inputClass}>
          {PAYMENT_METHODS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea
          {...register('notes', { maxLength: { value: 500, message: 'Max 500 chars' } })}
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="Any additional details..."
        />
        {errors.notes && <p className={errorClass}>{errors.notes.message}</p>}
      </div>

      {/* Actions */}
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
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
