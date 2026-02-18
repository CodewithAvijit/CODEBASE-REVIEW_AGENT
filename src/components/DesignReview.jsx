import React from 'react';
import { LayoutTemplate, AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react';
import ReviewCard from './ReviewCard';

const DesignReview = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  if (data.error) {
    return (
      <ReviewCard title="SYS_ARCHITECTURE" icon={LayoutTemplate} defaultExpanded={true}>
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

  const getScalabilityStyle = (rating) => {
    switch (rating?.toUpperCase()) {
      case 'GOOD': return 'text-[#00ff66] bg-[#00ff66]/10 border-[#00ff66]/40 shadow-[0_0_10px_rgba(0,255,102,0.1)]';
      case 'POOR': return 'text-[#ff3333] bg-[#1a0505] border-[#ff3333]/40 shadow-[0_0_10px_rgba(255,51,51,0.1)]';
      default: return 'text-[#ffcc00] bg-[#1a1500] border-[#ffcc00]/40 shadow-[0_0_10px_rgba(255,204,0,0.1)]';
    }
  };

  return (
    <ReviewCard title="SYS_ARCHITECTURE" icon={LayoutTemplate}>
      <div className="space-y-6 font-sans">
        
        {/* Topology and Scalability Badges */}
        <div className="grid grid-cols-2 gap-4 mb-4 font-mono">
          <div className="p-4 bg-[#0a0a0a] rounded-sm border border-[#222] relative overflow-hidden group hover:border-[#00ff66]/50 transition-colors">
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ff66]/50"></div>
            <span className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em] block mb-2">Topology</span>
            <span className="font-bold text-[#eee] text-sm tracking-wide">
                {data.architecture_type || data.architecture_style || 'UNKNOWN_TOPOLOGY'}
            </span>
          </div>
          
          <div className={`p-4 rounded-sm border relative overflow-hidden ${getScalabilityStyle(data.scalability || data.scalability_rating)}`}>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-50"></div>
            <span className="text-[10px] font-bold opacity-70 uppercase tracking-[0.2em] block mb-2">Scale_Factor</span>
            <span className="font-bold text-sm tracking-wide">
                {data.scalability || data.scalability_rating || 'UNDETERMINED'}
            </span>
          </div>
        </div>

        {/* Main Design Analysis */}
        <div className="p-4 bg-[#0a0a0a] rounded-sm border border-[#222] group hover:border-[#333] transition-colors">
            <h4 className="font-mono text-[10px] font-bold text-[#555] uppercase tracking-[0.2em] mb-2">Structural_Overview</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
                {data.system_design || "No design overview provided."}
            </p>
        </div>

        {/* Bottlenecks Section */}
        <div>
            {(data.design_issue && data.design_issue !== "None" && data.design_issue !== "N/A") && (
                <div>
                  <div className="flex items-center gap-3 mb-3 border-b border-[#222] pb-2 font-mono">
                      <h4 className="text-xs font-bold text-[#666] uppercase tracking-[0.2em]">Structural_Bottlenecks</h4>
                  </div>
                  <div className="bg-[#1a0505] rounded-sm border border-[#ff3333]/30 p-2 text-red-200">
                    <div className="flex items-start gap-3 p-3 text-sm font-medium">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#ff3333]" />
                        <span className="leading-relaxed">{data.design_issue}</span>
                    </div>
                  </div>
                </div>
            )}
        </div>
      </div>
    </ReviewCard>
  );
};

export default DesignReview;