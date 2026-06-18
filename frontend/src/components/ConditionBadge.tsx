import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ConditionBadgeProps {
  score: number;
  className?: string;
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({ score, className = '' }) => {
  let colorClass = '';
  let Icon = CheckCircle2;
  let label = 'Normal';

  if (score >= 0.7) {
    colorClass = 'bg-red-500/10 text-red-500 border-red-500/20';
    Icon = AlertTriangle;
    label = 'High Risk';
  } else if (score >= 0.4) {
    colorClass = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    Icon = AlertCircle;
    label = 'Caution';
  } else {
    colorClass = 'bg-green-500/10 text-green-500 border-green-500/20';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass} ${className}`}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {label}
    </span>
  );
};
