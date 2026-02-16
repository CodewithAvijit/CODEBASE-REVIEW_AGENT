import React from 'react';

const StatusBadge = ({ status }) => {
  const label = status ? status.toUpperCase() : 'UNKNOWN';
  
  const getStyles = (tag) => {
    switch (tag) {
      case 'HIGH':
      case 'CRITICAL':
      case 'NEEDS_FIXES':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'LOW':
      case 'GOOD':
      case 'YES':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStyles(label)} shadow-sm tracking-wide`}>
      {label}
    </span>
  );
};

export default StatusBadge;