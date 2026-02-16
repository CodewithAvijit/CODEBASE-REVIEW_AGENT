import React from 'react';
import StatusBadge from './StatusBadge';

const SecurityReview = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
      <div className="border-t-4 border-rose-500 px-6 py-4 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h2 className="font-bold text-slate-800">Security Audit</h2>
        </div>
        <StatusBadge status={data.risk_level} />
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Detected Vulnerabilities</h4>
          <div className="flex flex-col gap-2">
            {data.vulnerabilities.map((vuln, index) => (
              <div key={index} className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-rose-100 hover:bg-rose-50/30 transition-colors">
                <span className="text-sm font-medium text-slate-700 group-hover:text-rose-700">{vuln}</span>
                <span className="text-xs font-bold text-rose-500 bg-rose-100 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">HIGH</span>
              </div>
            ))}
          </div>
        </div>
        
        <button className="w-full py-2 text-sm font-medium text-slate-500 hover:text-rose-600 border border-dashed border-slate-300 rounded hover:border-rose-300 hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
          View Compliance Report 
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
    </div>
  );
};

export default SecurityReview;