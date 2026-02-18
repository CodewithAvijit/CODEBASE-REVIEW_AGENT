import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { ChevronLeft, LayoutDashboard, ShieldAlert, CheckCircle2, AlertTriangle, Terminal } from 'lucide-react';

import CodeReview from '../components/CodeReview';
import SecurityReview from '../components/SecurityReview';
import DesignReview from '../components/DesignReview';
import ProductionLog from '../components/ProductionLog';
import StatusBadge from '../components/StatusBadge';

const ReportPage = () => {
  const location = useLocation();
  const rawReportData = location.state?.reportData;

  if (!rawReportData) {
    return <Navigate to="/home" replace />;
  }

  // 1. Data Normalization
  const data = rawReportData.result || rawReportData;
  const source = rawReportData.source || 'LOCAL_SYSTEM_SCAN';

  // 2. Destructure Sections Safely
  const code_review = data?.code_review || {};
  const security_review = data?.security_review || {};
  const design_review = data?.design_review || {};
  const production_review = data?.production_review || {};
  
  // 3. Robust Unwrap of Final Report (Handles nested keys from different LLM responses)
  const finalReportObject = data?.final_report || {};
  const finalContent = finalReportObject.final_report || finalReportObject;

  // 4. Data Extraction with Fallbacks
  const isError = !!finalContent.error;
  const finalScore = finalContent.final_score || code_review.code_score || '?';
  const mergeVerdict = finalContent.verdict || finalContent.approved_for_production || 'UNKNOWN';
  
  // Clean up the text: if overall_health is missing, use the system_design or security_analysis
  const overallHealth = finalContent.overall_health || finalContent.system_design || 'Analysis complete. System status evaluated.';
  const strength = finalContent.strength || 'Modular implementation logic';
  const weakness = finalContent.weakness || 'Incomplete production configuration';
  const priorityFix = finalContent.priority_fix || 'Enable logging and monitoring';

  // Convert improvements to array safely
  const rawImps = finalContent.improvements || [];
  const improvements = Array.isArray(rawImps) ? rawImps : [rawImps];

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-gray-300 pb-20 selection:bg-[#00ff66] selection:text-black relative overflow-x-hidden">
      
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,100,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"></div>

      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-[#222] transition-all font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 sm:gap-5">
            <Link 
                to="/home" 
                className="group p-2 -ml-2 text-[#666] hover:text-[#00ff66] hover:bg-[#111] border border-transparent hover:border-[#00ff66]/30 rounded-sm transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-[#00ff66]/10 w-10 h-10 rounded-sm flex items-center justify-center text-[#00ff66] border border-[#00ff66]/30 shadow-[0_0_15px_rgba(0,255,102,0.1)]">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-widest uppercase leading-none truncate">System_Audit_Log</h1>
                <p className="hidden sm:flex text-[10px] text-[#555] font-bold tracking-[0.2em] mt-1.5 items-center gap-2 uppercase">
                   <span className="w-1.5 h-1.5 rounded-sm bg-[#00ff66] animate-pulse shadow-[0_0_5px_#00ff66]"></span>
                   {source}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8 shrink-0">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em] mb-1">Integrity_Score</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl sm:text-3xl font-black tracking-widest ${
                  finalScore >= 8 ? 'text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.3)]' : 
                  finalScore >= 5 ? 'text-[#ffcc00] drop-shadow-[0_0_8px_rgba(255,204,0,0.3)]' : 'text-[#ff3333]'
                }`}>
                  {finalScore}
                </span>
                <span className="text-sm font-bold text-[#444]">/10</span>
              </div>
            </div>
            <div className="h-8 w-px bg-[#222] hidden md:block"></div>
            <StatusBadge status={mergeVerdict} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* TOP LEVEL OVERVIEW */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="xl:col-span-2 bg-[#0a0a0a] rounded-sm p-6 sm:p-8 border border-[#222] relative overflow-hidden group flex flex-col hover:border-[#00ff66]/30 transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff66]/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
                
                <h3 className="font-mono text-[11px] font-bold text-[#00ff66] uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                    <span className="w-8 h-px bg-[#00ff66]/50"></span>
                    Executive_Summary
                </h3>
                
                <p className="text-gray-100 leading-relaxed text-base sm:text-lg font-medium relative z-10 mb-8 max-w-4xl">
                    {overallHealth}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto relative z-10">
                    <div className="p-4 bg-[#050505] border border-[#222] rounded-sm border-l-2 border-l-[#00ff66]">
                        <span className="block font-mono text-[10px] text-[#666] font-bold uppercase tracking-[0.2em] mb-1">Key_Strength</span>
                        <span className="text-sm text-gray-300">{strength}</span>
                    </div>
                    <div className="p-4 bg-[#050505] border border-[#222] rounded-sm border-l-2 border-l-[#0099ff]">
                        <span className="block font-mono text-[10px] text-[#666] font-bold uppercase tracking-[0.2em] mb-1">Priority_Fix</span>
                        <span className="text-sm text-gray-300">{priorityFix}</span>
                    </div>
                </div>
            </div>

            <div className={`rounded-sm p-6 sm:p-8 border relative overflow-hidden flex flex-col justify-center min-h-[200px] ${
                improvements.length > 0 && improvements[0] !== "N/A"
                ? 'bg-[#1a0505] border-[#ff3333]/30 shadow-[0_0_30px_rgba(255,51,51,0.05)]' 
                : 'bg-[#051a0f] border-[#00ff66]/30'
            }`}>
                {improvements.length > 0 && improvements[0] !== "N/A" ? (
                    <>
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <ShieldAlert className="w-32 h-32 text-[#ff3333]" />
                        </div>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-2 bg-[#ff3333]/10 rounded-sm text-[#ff3333] border border-[#ff3333]/20">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h3 className="font-mono font-bold text-[#ff3333] text-sm tracking-[0.2em] uppercase">Critical_Action_Items</h3>
                        </div>
                        <div className="relative z-10 flex-1 space-y-3">
                            {improvements.slice(0, 3).map((imp, i) => (
                               <div key={i} className="flex items-start gap-3 w-full text-[13px] text-red-200/80 font-medium leading-relaxed">
                                  <span className="mt-2 w-1.5 h-1.5 bg-[#ff3333] shrink-0 shadow-[0_0_5px_#ff3333]"></span>
                                  <span>{imp}</span>
                               </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center relative z-10 py-4">
                        <CheckCircle2 className="w-10 h-10 text-[#00ff66] mx-auto mb-4 opacity-50" />
                        <h3 className="font-mono font-bold text-[#00ff66] text-sm tracking-[0.2em] uppercase mb-1">Status_Optimal</h3>
                        <p className="font-mono text-[#00ff66]/50 text-[10px] tracking-widest uppercase">No critical blockers flagged.</p>
                    </div>
                )}
            </div>
        </div>

        {/* DETAILED CATEGORY GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 items-start">
          <div className="space-y-6 sm:space-y-8">
            <CodeReview data={code_review} />
            <DesignReview data={design_review} />
          </div>
          <div className="space-y-6 sm:space-y-8">
            <SecurityReview data={security_review} />
            <ProductionLog data={production_review} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportPage;