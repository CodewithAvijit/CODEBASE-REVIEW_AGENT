import React from 'react';
import { Rocket, XCircle, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import ReviewCard from './ReviewCard';

const ProductionLog = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  if (data.error) {
    return (
      <ReviewCard title="DEPLOYMENT_STATUS" icon={Rocket} defaultExpanded={true}>
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

  // Robust check for readiness (handles boolean or "true"/"false" strings)
  const isReady = data.is_ready === true || String(data.is_ready).toLowerCase() === 'true';

  return (
    <ReviewCard title="DEPLOYMENT_STATUS" icon={Rocket}>
      <div className="space-y-6 font-sans">
        
        {/* Visual Status Banner */}
        <div className={`relative overflow-hidden flex items-center gap-5 p-5 rounded-sm border transition-all font-mono ${
          isReady 
            ? 'bg-[#051a0f] border-[#00ff66]/40 text-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.1)]' 
            : 'bg-[#1a0505] border-[#ff3333]/40 text-[#ff3333] shadow-[0_0_20px_rgba(255,51,51,0.1)]'
        }`}>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 pointer-events-none"></div>
          
          <div className={`relative z-10 p-3 rounded-sm border ${isReady ? 'bg-[#00ff66]/20 border-[#00ff66]/50' : 'bg-[#ff3333]/20 border-[#ff3333]/50'}`}>
              {isReady ? <ShieldCheck className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-lg tracking-[0.2em] uppercase leading-tight">
              {isReady ? 'READY_FOR_LAUNCH' : 'LAUNCH_ABORTED'}
            </h4>
            <p className={`text-[10px] font-bold mt-1 tracking-widest uppercase ${isReady ? 'text-[#00ff66]/70' : 'text-[#ff3333]/70'}`}>
              {isReady 
                  ? '> ALL CORE REQUIREMENTS MET' 
                  : '> INTEGRITY FAILURE DETECTED'}
            </p>
          </div>
        </div>

        {/* Readiness Summary */}
        <div className="p-4 bg-[#0a0a0a] rounded-sm border border-[#222] group hover:border-[#333] transition-colors">
            <h4 className="font-mono text-[10px] font-bold text-[#555] uppercase tracking-[0.2em] mb-2">Readiness_Analysis</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
                {data.production_readiness || "No detailed readiness overview provided."}
            </p>
        </div>

        {/* Action Items / Risks */}
        <div className="space-y-4">
          {data.missing_component && data.missing_component !== "None" && data.missing_component !== "N/A" && (
              <div>
                  <div className="flex items-center gap-3 mb-2 border-b border-[#222] pb-1.5 font-mono">
                    <h4 className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em]">Missing_Directives</h4>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-sm border border-[#222] group hover:border-[#ff3333]/40 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-sm bg-[#ff3333]/60 group-hover:bg-[#ff3333] transition-all"></div>
                      <span className="text-sm text-gray-300 group-hover:text-gray-100">{data.missing_component}</span>
                  </div>
              </div>
          )}

          {data.deployment_risk && data.deployment_risk !== "None" && data.deployment_risk !== "N/A" && (
              <div>
                  <div className="flex items-center gap-3 mb-2 border-b border-[#222] pb-1.5 font-mono">
                    <h4 className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em]">Launch_Hazards</h4>
                  </div>
                  <div className="flex gap-4 p-4 rounded-sm bg-[#1a1500] border border-[#ffcc00]/30">
                      <AlertTriangle className="w-5 h-5 text-[#ffcc00] shrink-0" />
                      <span className="text-sm text-yellow-100/90 font-medium leading-relaxed">{data.deployment_risk}</span>
                  </div>
              </div>
          )}

          {(!data.missing_component || data.missing_component === "None" || data.missing_component === "N/A") && 
           (!data.deployment_risk || data.deployment_risk === "None" || data.deployment_risk === "N/A") && (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a] rounded-sm border border-dashed border-[#00ff66]/20 font-mono">
                  <CheckCircle2 className="w-8 h-8 text-[#00ff66]/40 mb-3" />
                  <p className="text-[10px] font-bold text-[#00ff66]/60 tracking-[0.2em] uppercase">No Critical Deployment Blockers</p>
              </div>
          )}
        </div>
      </div>
    </ReviewCard>
  );
};

export default ProductionLog;