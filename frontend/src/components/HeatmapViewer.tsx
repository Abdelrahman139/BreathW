import React, { useState } from 'react';
import { Layers, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../api/axios';

interface HeatmapViewerProps {
  originalUrl: string;
  heatmapBase64: string;
  topCondition: string;
}

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ originalUrl, heatmapBase64, topCondition }) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'original'>('side-by-side');

  const fullOriginalUrl = originalUrl.startsWith('http') ? originalUrl : `${API_BASE_URL}${originalUrl}`;
  const heatmapSrc = heatmapBase64.startsWith('http') ? heatmapBase64 : `${API_BASE_URL}${heatmapBase64}`;

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col w-full h-full">
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-900/80">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-blue-400" />
            Grad-CAM Analysis
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Highlighting regions indicative of: <span className="text-amber-400 font-medium capitalize">{topCondition.replace('_', ' ')}</span>
          </p>
        </div>
        
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'original' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'overlay' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overlay
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors hidden sm:block ${
              viewMode === 'side-by-side' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      <div className="flex-1 bg-black p-4 flex items-center justify-center min-h-[400px]">
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full">
            <div className="relative rounded-lg overflow-hidden border border-slate-800 h-full flex flex-col">
              <span className="absolute top-2 left-2 bg-black/60 text-xs px-2 py-1 rounded text-white z-10">Original</span>
              <img src={fullOriginalUrl} alt="Original X-Ray" className="w-full h-full object-contain" />
            </div>
            <div className="relative rounded-lg overflow-hidden border border-slate-800 h-full flex flex-col">
              <span className="absolute top-2 left-2 bg-blue-500/80 text-xs px-2 py-1 rounded text-white z-10">Heatmap</span>
              <img src={heatmapSrc} alt="Heatmap Overlay" className="w-full h-full object-contain" />
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
            <img 
              src={viewMode === 'original' ? fullOriginalUrl : heatmapSrc} 
              alt="Scan Viewer" 
              className="max-w-full max-h-[600px] object-contain transition-opacity duration-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};
