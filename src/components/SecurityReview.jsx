import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Hammer, ShieldCheck } from 'lucide-react';
import ReviewCard from './ReviewCard';

const SecurityReview = ({ data }) => {
  if (!data) return null;

  if (data.error) {
    return (
      <ReviewCard title="Security Audit" icon={ShieldAlert} defaultExpanded={false}>
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 italic">
          <AlertTriangle className="w-5 h-5 text-slate-400" />
          <span>{data.error}</span>
        </div>
      </ReviewCard>
    );
  }

  const isRiskHigh = ['CRITICAL', 'HIGH'].includes(data.risk_level?.toUpperCase());

  return (
    <ReviewCard title="Security Audit" score={data.security_score} icon={ShieldAlert}>
      <div className="space-y-8">
        
        <div className={`flex items-center justify-between p-5 rounded-xl border shadow-sm ${
          isRiskHigh 
            ? 'bg-gradient-to-r from-rose-50 to-white border-rose-100' 
            : 'bg-gradient-to-r from-emerald-50 to-white border-emerald-100'
        }`}>
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${isRiskHigh ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {isRiskHigh ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
             </div>
             <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Threat Level</span>
                <span className={`text-lg font-black tracking-tight ${isRiskHigh ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {data.risk_level || 'UNKNOWN'}
                </span>
             </div>
          </div>
        </div>

        <div>
            <div className="flex items-center gap-2 mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vulnerabilities Detected</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    !data.vulnerabilities?.length 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                    {data.vulnerabilities?.length || 0}
                </span>
            </div>

            {!data.vulnerabilities || data.vulnerabilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-300 mb-3" />
                <p className="text-slate-600 font-medium">No known vulnerabilities found.</p>
                <p className="text-slate-400 text-sm mt-1">Code passed standard security heuristics.</p>
            </div>
            ) : (
            <div className="space-y-3">
                {data.vulnerabilities.map((vuln, idx) => (
                <div key={idx} className="group p-4 bg-white border border-rose-100 rounded-xl shadow-sm hover:shadow-md hover:border-rose-200 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-600 border border-rose-100">
                            <AlertTriangle className="w-3 h-3" />
                            {vuln.type}
                        </span>
                        {vuln.location && (
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                {vuln.location}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {vuln.description}
                    </p>
                </div>
                ))}
            </div>
            )}
        </div>

        {data.remediation_steps && data.remediation_steps.length > 0 && (
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recommended Fixes</h4>
                <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-100">
                    {data.remediation_steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4 p-4 hover:bg-white transition-colors first:rounded-t-xl last:rounded-b-xl">
                            <div className="mt-0.5 p-1.5 bg-blue-100 text-blue-600 rounded-md shrink-0 h-fit">
                                <Hammer className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm text-slate-600 font-medium leading-relaxed">
                                {step}
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

export default SecurityReview;