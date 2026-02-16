import React from 'react';

const CodeReview = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      {/* Modern Header: Clean white with colored accent line */}
      <div className="border-t-4 border-blue-500 px-6 py-4 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          </div>
          <h2 className="font-bold text-slate-800">Code Quality</h2>
        </div>
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
          Score: {data.score}/10
        </span>
      </div>
      
      <div className="p-6 space-y-6 flex-grow">
        {/* Issues Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Critical Issues</h3>
          <ul className="space-y-3">
            {data.issues.map((issue, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-600 bg-red-50/50 p-3 rounded-md border border-red-100/50">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Optimizations</h3>
          <ul className="space-y-3">
            {data.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-600 bg-emerald-50/50 p-3 rounded-md border border-emerald-100/50">
                <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeReview;