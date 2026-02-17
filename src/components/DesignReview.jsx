import React from 'react';
import { LayoutTemplate, AlertTriangle, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';
import ReviewCard from './ReviewCard';

const DesignReview = ({ data }) => {
  if (!data) return null;

  if (data.error) {
    return (
      <ReviewCard title="System Design" icon={LayoutTemplate} defaultExpanded={false}>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 italic">
          <AlertTriangle className="w-5 h-5 text-gray-400" />
          <span>{data.error}</span>
        </div>
      </ReviewCard>
    );
  }

  const getScalabilityStyle = (rating) => {
    switch (rating?.toUpperCase()) {
      case 'GOOD': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'POOR': return 'text-rose-700 bg-rose-50 border-rose-100';
      default: return 'text-amber-700 bg-amber-50 border-amber-100';
    }
  };

  return (
    <ReviewCard title="System Design" icon={LayoutTemplate}>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Architecture</span>
          <span className="font-semibold text-slate-800 text-sm">{data.architecture_style || 'Not detected'}</span>
        </div>
        
        <div className={`p-4 rounded-xl border ${getScalabilityStyle(data.scalability_rating)}`}>
          <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest block mb-1.5">Scalability</span>
          <span className="font-bold text-sm">{data.scalability_rating || 'UNKNOWN'}</span>
        </div>
      </div>

      <div className="space-y-8">
         {data.bottlenecks && data.bottlenecks.length > 0 && (
             <div>
                <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Potential Bottlenecks</h4>
                    <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {data.bottlenecks.length}
                    </span>
                </div>
                <div className="bg-rose-50/50 rounded-xl border border-rose-100 p-1">
                    {data.bottlenecks.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 text-sm text-rose-900/80">
                            <AlertCircle className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                            <span className="leading-relaxed">{item}</span>
                        </div>
                    ))}
                </div>
             </div>
         )}

         {data.design_improvements && data.design_improvements.length > 0 && (
             <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recommended Improvements</h4>
                <div className="grid gap-3">
                    {data.design_improvements.map((item, i) => (
                        <div key={i} className="group flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all duration-200">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm group-hover:text-indigo-600 transition-colors">
                                <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                            </div>
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 font-medium leading-relaxed pt-0.5">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
             </div>
         )}
      </div>
    </ReviewCard>
  );
};

export default DesignReview;