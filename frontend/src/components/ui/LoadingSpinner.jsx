/**
 * components/ui/LoadingSpinner.jsx
 */

export default function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-950 z-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center animate-pulse">
            <span className="text-white text-xl font-bold">$</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading SpendWise…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  );
}
