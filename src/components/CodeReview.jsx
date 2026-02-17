import React from 'react';
import { Code, AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import ReviewCard from './ReviewCard';

const CodeReview = ({ data }) => {
  if (!data) return null;

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-rose-50 border-rose-100 text-rose-900 icon-rose-600 badge-rose';
      case 'medium':
        return 'bg-amber-50 border-amber-100 text-amber-900 icon-amber-600 badge-amber';
      default:
        return 'bg-slate-50 border-slate-100 text-slate-700 icon-slate-500 badge-slate';
    }
  };

  const getBadgeStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-rose-100 text-rose-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <ReviewCard title="Code Quality" score={data.score} icon={Code}>
      <div className="space-y-8">
        
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6">
          <div className="flex gap-4">
            <div className="p-2 bg-indigo-100 rounded-lg h-fit">
               <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-1">Quality Verdict</h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                {data.quality_summary}
              </p>
            </div>
          </div>
        </div>

        {data.issues && data.issues.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Issues Identified</h4>
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {data.issues.length}
              </span>
            </div>
            <div className="space-y-3">
              {data.issues.map((issue, idx) => {
                const style = getSeverityStyles(issue.severity);
                const badgeStyle = getBadgeStyles(issue.severity);
                
                return (
                  <div key={idx} className={`flex gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${style}`}>
                    <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                        issue.severity === 'high' ? 'text-rose-500' : 
                        issue.severity === 'medium' ? 'text-amber-500' : 'text-slate-400'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider ${badgeStyle}`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-6 opacity-90">{issue.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {data.refactoring_suggestions && data.refactoring_suggestions.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Refactoring Tips</h4>
            <div className="grid gap-3">
              {data.refactoring_suggestions.map((tip, idx) => (
                <div key={idx} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-yellow-50/50 transition-colors">
                  <div className="mt-1 p-1.5 bg-yellow-100 rounded-md group-hover:bg-yellow-200 transition-colors">
                    <Lightbulb className="w-3.5 h-3.5 text-yellow-600" />
                  </div>
                  <span className="text-sm text-slate-600 font-medium leading-relaxed group-hover:text-slate-800">
                    {tip}
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

export default CodeReview;