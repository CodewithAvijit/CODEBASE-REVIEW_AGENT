import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import CodeReview from '../components/CodeReview';
import SecurityReview from '../components/SecurityReview';
import DesignReview from '../components/DesignReview';
import ProductionLog from '../components/ProductionLog';
import StatusBadge from '../components/StatusBadge';

const ReportPage = () => {
  const location = useLocation();
  // Retrieve the data passed from the Upload Page
  const reportData = location.state?.reportData;

  // If user tries to access /report directly without uploading, send them back
  if (!reportData) {
    return <Navigate to="/" replace />;
  }

  const { code_review, security_review, design_review, production_review, final_report } = reportData;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-12">
      
      {/* 1. Header with 'Back' button */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 ring-1 ring-black/5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Audit Dashboard</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">Analysis Complete</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Score</span>
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-slate-800">{final_report.overall_score}</span>
                <span className="text-sm font-medium text-slate-400 ml-0.5">/10</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <StatusBadge status={final_report.final_verdict} />
          </div>
        </div>
      </header>

      {/* 2. Main Content (Your Existing Dashboard Code) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {final_report.critical_risks.length > 0 && (
          <div className="group bg-white rounded-2xl shadow-sm border border-rose-100 p-1 flex items-start gap-0 overflow-hidden ring-1 ring-rose-500/10">
            <div className="w-1.5 self-stretch bg-rose-500 rounded-l-full mr-4"></div>
            <div className="flex-1 py-4 pr-6 flex flex-col md:flex-row md:items-center gap-4">
               <div className="bg-rose-50 p-2.5 rounded-full shrink-0 self-start md:self-center">
                 <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               </div>
               <div className="flex-1">
                 <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">Critical Attention Required</h3>
                 <p className="text-slate-500 text-sm mt-0.5">The analysis detected <span className="font-semibold text-slate-700">{final_report.critical_risks.length} critical issues</span>.</p>
               </div>
               <div className="flex flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                 {final_report.critical_risks.map((risk, i) => (
                   <div key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-sm font-medium border border-rose-100/50">
                     <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 shrink-0 animate-pulse"></span>{risk}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="space-y-6 lg:space-y-8 flex flex-col h-full">
            <div className="flex-1"><CodeReview data={code_review} /></div>
            <div className="flex-1"><DesignReview data={design_review} /></div>
          </div>
          <div className="space-y-6 lg:space-y-8 flex flex-col h-full">
            <div className="flex-1"><SecurityReview data={security_review} /></div>
            <div className="flex-1"><ProductionLog data={production_review} /></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportPage;