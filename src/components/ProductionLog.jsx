import React from 'react';
import { Rocket, XCircle, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import ReviewCard from './ReviewCard';

const ProductionLog = ({ data }) => {
  if (!data) return null;

  const isReady = data.is_production_ready;

  return (
    <ReviewCard title="Production Readiness" icon={Rocket}>
      
      {/* Status Banner */}
      <div className={`relative overflow-hidden flex items-center gap-4 p-5 rounded-xl mb-8 border transition-all ${
        isReady 
          ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
          : 'bg-rose-50 border-rose-100 text-rose-900'
      }`}>
        <div className={`p-3 rounded-full ${isReady ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {isReady ? <ShieldCheck className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
        </div>
        <div>
          <h4 className="font-bold text-lg tracking-tight">
            {isReady ? 'Production Ready' : 'Not Production Ready'}
          </h4>
          <p className={`text-sm font-medium mt-0.5 ${isReady ? 'text-emerald-700/80' : 'text-rose-700/80'}`}>
            {isReady 
                ? 'Code meets core stability standards.' 
                : 'Critical requirements are missing.'}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {data.missing_requirements && data.missing_requirements.length > 0 && (
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Missing Requirements</h4>
                <div className="space-y-2">
                    {data.missing_requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-rose-200 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 group-hover:scale-125 transition-transform"></div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-rose-700 transition-colors">{req}</span>
                    </div>
                    ))}
                </div>
            </div>
        )}

        {data.deployment_risks && data.deployment_risks.length > 0 && (
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Deployment Risks</h4>
                <div className="space-y-2">
                    {data.deployment_risks.map((risk, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-lg bg-orange-50/50 border border-orange-100">
                        <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-orange-900 font-medium leading-relaxed">{risk}</span>
                    </div>
                    ))}
                </div>
            </div>
        )}

        {(!data.missing_requirements?.length && !data.deployment_risks?.length) && (
             <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                 <CheckCircle2 className="w-8 h-8 text-slate-300 mb-2" />
                 <p className="text-sm font-medium text-slate-500">No critical risks identified.</p>
             </div>
        )}
      </div>
    </ReviewCard>
  );
};

export default ProductionLog;