import React from 'react';

const ProductionLog = ({ data }) => {
  return (
    <div className="bg-[#1e293b] rounded-xl shadow-lg overflow-hidden h-full border border-slate-700 flex flex-col">
      {/* Mac-style Window Header */}
      <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3" /></svg>
           logs.json
        </div>
        <div className="w-12"></div> {/* Spacer for centering */}
      </div>

      <div className="p-4 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto flex-grow">
        {data.error && (
          <div className="mb-4 p-3 bg-red-500/10 border-l-2 border-red-500 text-red-400 rounded-r">
            <span className="font-bold">ERROR:</span> {data.error}
          </div>
        )}
        
        <div className="text-slate-400 mb-2">
          <span className="text-green-400">root@server</span>:<span className="text-blue-400">~</span>$ cat raw_output.txt
        </div>
        
        <pre className="text-slate-300 opacity-90 whitespace-pre-wrap">
          {data.raw}
        </pre>
        
        <div className="mt-2 animate-pulse inline-block w-2 h-4 bg-slate-500 align-middle"></div>
      </div>
    </div>
  );
};

export default ProductionLog;