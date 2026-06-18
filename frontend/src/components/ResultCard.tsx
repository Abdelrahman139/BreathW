import React from 'react';
import type { ScanResult } from '../types';
import { ConditionBadge } from './ConditionBadge';

interface ResultCardProps {
  result: ScanResult;
}

const CONDITIONS = [
  { key: 'pneumonia', label: 'Pneumonia' },
  { key: 'effusion', label: 'Pleural Effusion' },
  { key: 'atelectasis', label: 'Atelectasis' },
  { key: 'cardiomegaly', label: 'Cardiomegaly' },
  { key: 'pneumothorax', label: 'Pneumothorax' }
];

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  
  const getBarColor = (score: number) => {
    if (score >= 0.7) return 'bg-red-500';
    if (score >= 0.4) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className="glass-panel rounded-xl p-6 w-full max-w-lg">
      <h3 className="text-xl font-semibold mb-6 text-slate-100 flex items-center justify-between">
        AI Diagnosis Results
      </h3>
      
      <div className="space-y-6">
        {CONDITIONS.map((cond) => {
          // @ts-ignore - dynamic key access
          const score = result[cond.key] as number;
          const percentage = Math.round(score * 100);
          
          return (
            <div key={cond.key} className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-slate-200">{cond.label}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-slate-300">{percentage}%</span>
                  <ConditionBadge score={score} />
                </div>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(score)}`} 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800">
        <div className="flex justify-between items-center bg-slate-800/50 rounded-lg p-4">
          <span className="text-slate-300 font-medium">No Finding (Baseline)</span>
          <span className="text-lg font-semibold text-slate-200">
            {Math.round(result.noFinding * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
