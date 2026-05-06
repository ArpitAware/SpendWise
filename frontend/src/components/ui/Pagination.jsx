/**
 * components/ui/Pagination.jsx
 */

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ current, total, onChange }) {
  const pages = [];

  // Build page number array with ellipsis logic
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const btnBase =
    'inline-flex items-center justify-center w-9 h-9 text-sm rounded-xl transition';
  const activeBtn = `${btnBase} bg-indigo-600 text-white font-semibold`;
  const inactiveBtn = `${btnBase} text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700`;
  const disabledBtn = `${btnBase} text-gray-300 dark:text-gray-600 cursor-not-allowed`;

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Prev */}
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className={current === 1 ? disabledBtn : inactiveBtn}
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={page === current ? activeBtn : inactiveBtn}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className={current === total ? disabledBtn : inactiveBtn}
      >
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
