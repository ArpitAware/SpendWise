/**
 * components/ui/LoadingSpinner.jsx
 */

export default function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-950 z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
            <span className="text-white font-black text-xl">₹</span>
          </div>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
          <p className="text-sm text-gray-400">Loading SpendWise...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );
}
