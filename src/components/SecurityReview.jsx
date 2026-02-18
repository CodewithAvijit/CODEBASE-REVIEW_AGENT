import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Hammer, ShieldCheck } from 'lucide-react';
import ReviewCard from './ReviewCard';

const SecurityReview = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  if (data.error) {
    return (
      <ReviewCard title="SYS_SECURITY_AUDIT" icon={ShieldAlert} defaultExpanded={true}>
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

  const isRiskHigh = ['CRITICAL', 'HIGH'].includes(data.risk_level?.toUpperCase());

  return (
    <ReviewCard title="SYS_SECURITY_AUDIT" icon={ShieldAlert} score={data.security_score}>
      <div className="space-y-6 font-sans">
        
        {/* Threat Level Indicator */}
        <div className={`flex items-center justify-between p-5 rounded-sm border relative overflow-hidden font-mono ${
          isRiskHigh 
            ? 'bg-[#1a0505] border-[#ff3333]/40 text-[#ff3333] shadow-[0_0_20px_rgba(255,51,51,0.1)]' 
            : 'bg-[#051a0f] border-[#00ff66]/40 text-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.1)]'
        }`}>
          <div className="absolute top-0 right-0 w-32 h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 20px)' }}></div>
          <div className="flex items-center gap-4 relative z-10">
             <div className={`p-3 rounded-sm border ${isRiskHigh ? 'bg-[#ff3333]/20 border-[#ff3333]/50 text-[#ff3333]' : 'bg-[#00ff66]/20 border-[#00ff66]/50 text-[#00ff66]'}`}>
                {isRiskHigh ? <ShieldAlert className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
             </div>
             <div>
                <span className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em] block mb-1">Threat_Level_Indicator</span>
                <span className={`text-xl font-black tracking-[0.2em] uppercase ${isRiskHigh ? 'text-[#ff3333]' : 'text-[#00ff66]'}`}>
                    {data.risk_level || 'UNKNOWN'}
                </span>
             </div>
          </div>
        </div>

        {/* Audit Summary */}
        <div className="p-4 bg-[#0a0a0a] rounded-sm border border-[#222] group hover:border-[#333] transition-colors">
            <h4 className="font-mono text-[10px] font-bold text-[#555] uppercase tracking-[0.2em] mb-2">Audit_Summary</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
                {data.security_analysis || "No detailed security analysis provided."}
            </p>
        </div>

        {/* Vulnerability Alert Block */}
        <div>
            <div className="flex items-center gap-3 mb-3 border-b border-[#222] pb-2 font-mono">
                <h4 className="text-xs font-bold text-[#666] uppercase tracking-[0.2em]">Vulnerabilities_Detected</h4>
            </div>

            {!data.critical_vulnerability || data.critical_vulnerability === "None" || data.critical_vulnerability === "N/A" ? (
            <div className="flex flex-col items-center justify-center p-8 bg-[#0a0a0a] rounded-sm border border-dashed border-[#00ff66]/20 text-center font-mono">
                <CheckCircle2 className="w-8 h-8 text-[#00ff66]/40 mb-3" />
                <p className="text-[11px] font-bold text-[#00ff66]/60 tracking-[0.2em] uppercase">No Critical Vulnerabilities</p>
            </div>
            ) : (
            <div className="group p-4 bg-[#1a0505] border border-[#ff3333]/30 rounded-sm hover:border-[#ff3333]/60 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#ff3333]/50 group-hover:bg-[#ff3333] transition-colors"></div>
                <div className="flex justify-between items-start mb-3 font-mono">
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] bg-[#ff3333]/20 text-[#ff3333] border border-[#ff3333]/30">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        CRITICAL_VULN
                    </span>
                </div>
                <p className="text-sm text-red-200/90 leading-relaxed font-medium">
                    {data.critical_vulnerability}
                </p>
            </div>
            )}
        </div>

        {/* Remediation Protocols */}
        {data.security_fix && data.security_fix !== "None" && data.security_fix !== "N/A" && (
            <div>
                <div className="flex items-center gap-3 mb-3 border-b border-[#222] pb-2 font-mono">
                    <h4 className="text-xs font-bold text-[#666] uppercase tracking-[0.2em]">Remediation_Protocols</h4>
                </div>
                <div className="bg-[#0a0a0a] rounded-sm border border-[#222]">
                    <div className="flex gap-4 p-4 hover:bg-[#111] transition-colors group">
                        <div className="mt-0.5 p-1.5 bg-[#0099ff]/10 text-[#0099ff] border border-[#0099ff]/30 rounded-sm shrink-0 h-fit group-hover:border-[#0099ff]/60">
                            <Hammer className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-gray-300 font-medium leading-relaxed">
                            {data.security_fix}
                        </span>
                    </div>
                </div>
            </div>
        )}
      </div>
    </ReviewCard>
  );
};

export default SecurityReview;