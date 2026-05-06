/**
 * pages/BudgetPage.jsx
 * Set monthly budget limits per category and track spending vs limit
 */

import { useEffect, useState } from 'react';
import { budgetAPI } from '../services/api';
import BudgetCard from '../components/budget/BudgetCard';
import BudgetForm from '../components/budget/BudgetForm';
import Modal from '../components/ui/Modal';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const { data } = await budgetAPI.getAll({ month, year });
      setBudgets(data.data);
    } catch {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBudgets(); }, [month, year]);

  const handleSubmit = async (formData) => {
    try {
      if (editingBudget) {
        await budgetAPI.update(editingBudget._id, formData);
        toast.success('Budget updated!');
      } else {
        await budgetAPI.create({ ...formData, month, year });
        toast.success('Budget created!');
      }
      setShowModal(false);
      fetchBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await budgetAPI.delete(id);
      toast.success('Budget deleted');
      fetchBudgets();
    } catch {
      toast.error('Failed to delete budget');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Set monthly spending limits and get alerted when approaching them
          </p>
        </div>
        <button
          onClick={() => { setEditingBudget(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition"
        >
          <FiPlus className="w-4 h-4" />
          Set Budget
        </button>
      </div>

      {/* Month/Year Selector */}
      <div className="flex gap-3">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300"
        >
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300"
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Budget Cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No budgets set for this month.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
          >
            Create your first budget →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingBudget ? 'Edit Budget' : 'Set Budget'}
      >
        <BudgetForm
          initialData={editingBudget}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}
