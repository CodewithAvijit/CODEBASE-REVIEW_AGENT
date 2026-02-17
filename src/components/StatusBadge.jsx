import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, MinusCircle, Info, ShieldAlert } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (rawStatus) => {
    if (!rawStatus) return 'UNKNOWN';
    
    const s = rawStatus.toUpperCase();

    if (s.includes('REJECT') || s.includes('BLOCKER') || s.includes('CRITICAL')) return 'REJECT';
    if (s.includes('APPROVE') && (s.includes('CONDITION') || s.includes('COMMENT') || s.includes('NOTE'))) return 'WITH_COMMENTS';
    if (s.includes('APPROVE')) return 'APPROVE';
    if (s.includes('READY') || s.includes('PRODUCTION')) return 'READY';
    if (s.includes('FIX') || s.includes('issue')) return 'NEEDS_FIXES';

    return 'UNKNOWN';
  };

  const configKey = getStatusConfig(status);

  const styles = {
    APPROVE: {
      container: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
      icon: CheckCircle2,
      label: 'Approved',
      glow: 'bg-emerald-400'
    },
    READY: {
      container: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100',
      icon: CheckCircle2,
      label: 'Production Ready',
      glow: 'bg-blue-400'
    },
    WITH_COMMENTS: {
      container: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100',
      icon: AlertTriangle,
      label: 'Conditional Approval',
      glow: 'bg-amber-400'
    },
    NEEDS_FIXES: {
      container: 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-100',
      icon: AlertTriangle,
      label: 'Changes Requested',
      glow: 'bg-orange-400'
    },
    REJECT: {
      container: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-100',
      icon: ShieldAlert,
      label: 'Rejected',
      glow: 'bg-rose-500'
    },
    UNKNOWN: {
      container: 'bg-slate-50 text-slate-600 border-slate-200 ring-slate-100',
      icon: MinusCircle,
      label: 'Status Unknown',
      glow: 'bg-slate-400'
    }
  };

  const current = styles[configKey];
  const Icon = current.icon;

  return (
    <div className={`
      relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full 
      border ring-1 ring-inset transition-all duration-300
      ${current.container}
    `}>
      <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${current.glow} animate-pulse`}></span>
      
      <Icon className="w-4 h-4 ml-2" strokeWidth={2.5} />
      
      <span className="text-xs font-bold uppercase tracking-wider pr-1">
        {current.label}
      </span>
    </div>
  );
};

export default StatusBadge;