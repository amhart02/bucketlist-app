export default function EmptyListsState() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No bucket lists yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Create your first bucket list to start tracking your goals and dreams. Organize them by theme like travel, learning, or personal growth.
      </p>
      <p className="text-sm text-gray-500">
        Click the &quot;Create List&quot; button above to get started
      </p>
    </div>
  );
}
