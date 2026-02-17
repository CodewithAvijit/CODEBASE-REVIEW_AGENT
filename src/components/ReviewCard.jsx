import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ReviewCard = ({ title, score, icon: Icon, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getScoreColor = (s) => {
    if (s >= 8) return 'text-emerald-700 bg-emerald-50 border-emerald-200 ring-emerald-100';
    if (s >= 5) return 'text-amber-700 bg-amber-50 border-amber-200 ring-amber-100';
    return 'text-rose-700 bg-rose-50 border-rose-200 ring-rose-100';
  };

  return (
    <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300">
      <div 
        className="flex items-center justify-between p-5 cursor-pointer bg-white active:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-500">
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          <h3 className="font-bold text-slate-800 text-lg tracking-tight">{title}</h3>
        </div>
        
        <div className="flex items-center gap-5">
          {score !== undefined && score !== null && (
            <div className={`px-4 py-1.5 rounded-full text-sm font-extrabold border ring-1 ring-inset ${getScoreColor(score)}`}>
              {score}/10
            </div>
          )}
          <div className={`p-2 rounded-full transition-transform duration-300 ${isExpanded ? 'bg-slate-100 rotate-180' : 'hover:bg-slate-50'}`}>
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
            <div className="p-6 pt-2 border-t border-slate-100">
             {children}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;