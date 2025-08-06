// src/components/ExportReset.jsx

export default function ExportReset({ aiAnalysis, resetAnalysis }) {
  const exportResults = () => {
    if (!aiAnalysis) return;
    const dataStr = JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        aiAnalysis,
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acoustic-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <button
        onClick={exportResults}
        disabled={!aiAnalysis}
        className="flex items-center justify-center gap-2 py-3 px-6 bg-green-600 hover:bg-green-700 rounded disabled:opacity-70"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Export JSON
      </button>
      <button
        onClick={resetAnalysis}
        className="flex items-center justify-center gap-2 py-3 px-6 bg-gray-600 hover:bg-gray-700 rounded"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 3v5h5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Complete Reset
      </button>
    </div>
  );
}