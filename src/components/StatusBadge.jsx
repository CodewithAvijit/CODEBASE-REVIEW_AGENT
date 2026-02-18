import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, MinusCircle, ShieldAlert } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (rawStatus) => {
    if (!rawStatus) return 'UNKNOWN';
    
    const s = String(rawStatus).toUpperCase();

    // Mapping for various LLM outputs to specific visual states
    if (s.includes('REJECT') || s.includes('BLOCKER') || s.includes('NO') || s.includes('CRITICAL')) return 'REJECT';
    if (s.includes('CONDITION') || s.includes('COMMENT') || s.includes('NOTE') || s.includes('WITH_COMMENTS')) return 'WITH_COMMENTS';
    if (s.includes('APPROVE') || s.includes('YES') || s.includes('TRUE')) return 'APPROVE';
    if (s.includes('READY') || s.includes('PRODUCTION')) return 'READY';
    if (s.includes('FIX') || s.includes('ISSUE')) return 'NEEDS_FIXES';

    return 'UNKNOWN';
  };

  const configKey = getStatusConfig(status);

  const styles = {
    APPROVE: {
      container: 'bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40 shadow-[0_0_10px_rgba(0,255,102,0.1)]',
      icon: CheckCircle2,
      label: 'APPROVED',
      glow: 'bg-[#00ff66]'
    },
    READY: {
      container: 'bg-[#0099ff]/10 text-[#0099ff] border-[#0099ff]/40 shadow-[0_0_10px_rgba(0,153,255,0.1)]',
      icon: CheckCircle2,
      label: 'PROD_READY',
      glow: 'bg-[#0099ff]'
    },
    WITH_COMMENTS: {
      container: 'bg-[#ffcc00]/10 text-[#ffcc00] border-[#ffcc00]/40 shadow-[0_0_10px_rgba(255,204,0,0.1)]',
      icon: AlertTriangle,
      label: 'CONDITIONAL_OK',
      glow: 'bg-[#ffcc00]'
    },
    NEEDS_FIXES: {
      container: 'bg-[#ff9900]/10 text-[#ff9900] border-[#ff9900]/40 shadow-[0_0_10px_rgba(255,153,0,0.1)]',
      icon: AlertTriangle,
      label: 'CHANGES_REQ',
      glow: 'bg-[#ff9900]'
    },
    REJECT: {
      container: 'bg-[#ff3333]/10 text-[#ff3333] border-[#ff3333]/40 shadow-[0_0_10px_rgba(255,51,51,0.1)]',
      icon: ShieldAlert,
      label: 'REJECTED',
      glow: 'bg-[#ff3333]'
    },
    UNKNOWN: {
      container: 'bg-[#111] text-[#666] border-[#222]',
      icon: MinusCircle,
      label: 'STATUS_PENDING',
      glow: 'bg-[#333]'
    }
  };

  const current = styles[configKey] || styles.UNKNOWN;
  const Icon = current.icon;

  return (
    <div className={`
      relative inline-flex items-center gap-2.5 px-3 py-1.5 rounded-sm 
      border transition-all duration-500 font-mono
      ${current.container}
    `}>
      <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-sm ${current.glow} animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_5px_currentColor]`}></span>
      
      <Icon className="w-4 h-4 ml-3" strokeWidth={2.5} />
      
      <span className="text-[10px] font-black uppercase tracking-[0.2em] pr-1">
        {current.label}
      </span>
    </div>
  );
};

export default StatusBadge;