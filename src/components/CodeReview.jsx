import React from 'react';
import { Code, AlertCircle, Lightbulb, CheckCircle2, AlertTriangle } from 'lucide-react';
import ReviewCard from './ReviewCard';

const CodeReview = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  if (data.error) {
    return (
      <ReviewCard title="SYS_CODE_QUALITY" icon={Code} defaultExpanded={true}>
        <div className="flex flex-col gap-3 p-4 bg-[#1a0505] rounded-sm border border-dashed border-[#ff3333]/50 text-[#ff3333] font-mono text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold tracking-widest uppercase">PARSE_ERROR: RAW_FEED_DETECTED</span>
          </div>
          <pre className="text-gray-300 font-sans whitespace-pre-wrap leading-relaxed mt-2 p-4 bg-[#0a0a0a] border border-[#222] rounded-sm">
            {data.raw}
          </pre>
        </div>
      </ReviewCard>
    );
  }

  // Handle various possible score keys from LLM
  const displayScore = data.code_score ?? data.score;

  return (
    <ReviewCard title="SYS_CODE_QUALITY" score={displayScore} icon={Code}>
      <div className="space-y-6 font-sans">
        
        {/* Verdict Section */}
        <div className="relative overflow-hidden rounded-sm bg-[#0a0a0a] border border-[#00ff66]/30 p-5 group hover:border-[#00ff66]/60 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff66]"></div>
          <div className="flex gap-4 items-center">
            <div className="p-2 bg-[#00ff66]/10 border border-[#00ff66]/30 rounded-sm h-fit shadow-[0_0_15px_rgba(0,255,102,0.2)]">
               <CheckCircle2 className="w-5 h-5 text-[#00ff66]" />
            </div>
            <div>
              <h4 className="font-mono text-[10px] font-bold text-[#00ff66] uppercase tracking-widest mb-1">Verdict_Protocol</h4>
              <p className="text-gray-200 leading-relaxed text-sm">
                {data.code_review || data.quality_summary || "NO_SUMMARY_PROVIDED"}
              </p>
            </div>
          </div>
        </div>

        {/* Major Issues Section */}
        {data.major_issues && data.major_issues !== "None" && data.major_issues !== "N/A" && (
          <div>
            <div className="flex items-center gap-3 mb-3 border-b border-[#222] pb-2 font-mono">
              <h4 className="text-xs font-bold text-[#666] uppercase tracking-[0.2em]">Anomalies_Detected</h4>
            </div>
            <div className="flex gap-4 p-4 rounded-sm border bg-[#1a1500] border-[#ffcc00]/40 text-[#ffcc00] shadow-[0_0_10px_rgba(255,204,0,0.1)] hover:scale-[1.01] transition-all">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-yellow-100 text-sm font-medium leading-relaxed">{data.major_issues}</p>
                </div>
            </div>
          </div>
        )}

        {/* Refactoring Suggestions */}
        {data.refactoring_need && data.refactoring_need !== "None" && data.refactoring_need !== "N/A" && (
          <div>
            <div className="flex items-center gap-3 mb-3 border-b border-[#222] pb-2 font-mono">
                <h4 className="text-xs font-bold text-[#666] uppercase tracking-[0.2em]">Optimization_Vectors</h4>
            </div>
            <div className="group flex items-start gap-3 p-4 rounded-sm bg-[#0a0a0a] border border-[#222] hover:border-[#0099ff]/50 transition-colors">
                <div className="mt-0.5 p-1.5 bg-[#0099ff]/10 border border-[#0099ff]/30 rounded-sm group-hover:bg-[#0099ff]/20 transition-colors">
                  <Lightbulb className="w-4 h-4 text-[#0099ff]" />
                </div>
                <span className="text-sm text-gray-300 group-hover:text-gray-100 font-medium leading-relaxed">
                  {data.refactoring_need}
                </span>
            </div>
          </div>
        )}
      </div>
    </ReviewCard>
  );
};

export default CodeReview;