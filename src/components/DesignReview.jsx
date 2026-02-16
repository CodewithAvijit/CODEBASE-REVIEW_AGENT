import React from 'react';

const DesignReview = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
      <div className="border-t-4 border-indigo-500 px-6 py-4 flex items-center gap-3 bg-slate-50/50">
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </div>
        <h2 className="font-bold text-slate-800">System Design</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Architecture</span>
            <span className="block text-slate-800 font-bold text-base">{data.architecture}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Scalability</span>
            <span className={`block font-bold text-base ${data.scalability === 'GOOD' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {data.scalability}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recommended Improvements</h3>
          <div className="flex flex-wrap gap-2">
            {data.improvements.map((item, index) => (
              <span key={index} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md border border-indigo-100">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignReview;