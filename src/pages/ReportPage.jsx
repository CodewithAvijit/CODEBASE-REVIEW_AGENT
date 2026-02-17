import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { ChevronLeft, LayoutDashboard, ShieldAlert, CheckCircle2 } from 'lucide-react';

import CodeReview from '../components/CodeReview';
import SecurityReview from '../components/SecurityReview';
import DesignReview from '../components/DesignReview';
import ProductionLog from '../components/ProductionLog';
import StatusBadge from '../components/StatusBadge';

const ReportPage = () => {
  const location = useLocation();
  const reportData = location.state?.reportData;

  if (!reportData) {
    return <Navigate to="/" replace />;
  }

  const { code_review, security_review, design_review, production_review, final_report } = reportData;
  const criticalIssues = final_report.critical_blockers || final_report.critical_risks || [];

  return (
    <div className="min-h-screen bg-slate-900 font-sans pb-20 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
            <Link 
                to="/" 
                className="group p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">Audit Report</h1>
                <p className="hidden sm:flex text-xs text-slate-400 font-medium mt-1.5 items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                   Analysis Complete
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-0.5">Overall Score</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  final_report.final_score >= 8 ? 'text-emerald-400' : 
                  final_report.final_score >= 5 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {final_report.final_score}
                </span>
                <span className="text-sm font-bold text-slate-600">/10</span>
              </div>
            </div>
            <div className="h-8 sm:h-10 w-px bg-slate-800 hidden md:block"></div>
            
            <StatusBadge status={final_report.merge_verdict} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="xl:col-span-2 bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden group flex flex-col h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 relative z-10 flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-indigo-500/50 rounded-full"></span>
                    Executive Summary
                </h3>
                <p className="text-slate-300 leading-relaxed text-base sm:text-lg font-medium relative z-10">
                    {final_report.executive_summary}
                </p>
            </div>

            <div className={`rounded-2xl p-6 sm:p-8 border relative overflow-hidden flex flex-col justify-center min-h-[200px] shadow-xl ${
                criticalIssues.length > 0 
                ? 'bg-rose-900/10 border-rose-500/30 ring-1 ring-rose-500/20' 
                : 'bg-emerald-900/10 border-emerald-500/30 ring-1 ring-emerald-500/20'
            }`}>
                {criticalIssues.length > 0 ? (
                    <>
                        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                            <ShieldAlert className="w-24 h-24 text-rose-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/20">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-rose-100 text-lg">Critical Blockers</h3>
                        </div>
                        <div className="relative z-10 flex-1">
                             <ul className="space-y-3">
                                {criticalIssues.slice(0, 3).map((risk, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-rose-200/90 font-medium">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 ring-4 ring-rose-500/20 shadow-[0_0_8px_rgba(251,113,133,0.5)]"></span>
                                        <span className="leading-snug">{risk}</span>
                                    </li>
                                ))}
                            </ul>
                            {criticalIssues.length > 3 && (
                                <div className="mt-4 text-xs font-bold text-rose-400 uppercase tracking-wide pl-4 flex items-center gap-2">
                                    <span className="w-4 h-px bg-rose-500/50"></span>
                                    + {criticalIssues.length - 3} more issues detected
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center relative z-10 py-4">
                        <div className="inline-flex p-4 bg-emerald-500/10 rounded-full text-emerald-400 mb-4 ring-1 ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-emerald-100 text-lg mb-1">System Healthy</h3>
                        <p className="text-emerald-200/60 text-sm">No critical blockers found.</p>
                    </div>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 items-start">
          <div className="space-y-6 sm:space-y-8 w-full">
            <CodeReview data={code_review} />
            <DesignReview data={design_review} />
          </div>
          <div className="space-y-6 sm:space-y-8 w-full">
            <SecurityReview data={security_review} />
            <ProductionLog data={production_review} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportPage;