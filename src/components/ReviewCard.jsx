import React, { useState } from 'react';

const ReviewCard = ({ title, score, icon: Icon, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Improved score coloring logic
  const getScoreStyles = (s) => {
    const val = parseFloat(s);
    if (isNaN(val)) return 'text-[#888] bg-[#222]/10 border-[#333]';
    if (val >= 8) return 'text-[#00ff66] bg-[#00ff66]/10 border-[#00ff66]/30 shadow-[0_0_10px_rgba(0,255,102,0.15)]';
    if (val >= 5) return 'text-[#ffcc00] bg-[#ffcc00]/10 border-[#ffcc00]/30';
    return 'text-[#ff3333] bg-[#ff3333]/10 border-[#ff3333]/30';
  };

  // Helper to determine if score should be displayed
  const isValidScore = score !== undefined && score !== null && score !== '?' && score !== '';

  return (
    <div className="border border-[#222] rounded-sm bg-[#0a0a0a] overflow-hidden transition-all duration-300 hover:border-[#333] mb-4 relative group">
      {/* Top Gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#222] group-hover:via-[#00ff66]/30 to-transparent transition-colors"></div>
      
      <div 
        className="flex items-center justify-between p-4 cursor-pointer bg-[#0a0a0a] hover:bg-[#0c0c0c] transition-colors relative"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Selection highlight bar */}
        <div className={`absolute left-0 top-0 h-full w-1 transition-all ${isExpanded ? 'bg-[#00ff66]' : 'bg-transparent group-hover:bg-[#00ff66]/30'}`}></div>
        
        <div className="flex items-center gap-4 pl-2 font-mono">
          <div className={`p-2 bg-[#1a1a1a] rounded-sm border border-[#333] transition-all ${isExpanded ? 'text-[#00ff66] border-[#00ff66]/30' : 'text-gray-500 group-hover:text-[#00ff66]'}`}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          <h3 className="font-bold text-[#eee] text-xs sm:text-sm tracking-[0.2em] uppercase">{title}</h3>
        </div>
        
        <div className="flex items-center gap-4 font-mono">
          {isValidScore && (
            <div className={`px-2.5 py-0.5 rounded-sm text-[10px] font-black border tracking-wider transition-all ${getScoreStyles(score)}`}>
              LVL:{score}
            </div>
          )}
          <div className={`p-1 rounded-sm transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#00ff66]' : 'text-[#444] group-hover:text-[#00ff66]'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
            <div className="p-5 border-t border-[#222] bg-[#050505] relative">
              {/* Vertical timeline/connector line */}
              <div className="absolute top-0 left-10 w-px h-full bg-[#111] -z-10"></div>
              <div className="relative z-10">
                {children}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;