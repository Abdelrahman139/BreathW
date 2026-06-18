import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Loader2, Save } from 'lucide-react';
import axiosInstance from '../../api/axios';
import { HeatmapViewer } from '../../components/HeatmapViewer';
import { ResultCard } from '../../components/ResultCard';
import type { Scan } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export const ScanResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [scan, setScan] = useState<Scan | null>(null);
  const [patientName, setPatientName] = useState<string>('Patient');
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScanData = async () => {
      try {
        const response = await axiosInstance.get(`/api/scans/${id}`);
        setScan(response.data.scan);
        setPatientName(response.data.patientName || 'Patient');
        setNotes(response.data.scan.notes || '');
      } catch (error) {
        console.error('Failed to fetch scan results', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchScanData();
  }, [id]);

  const handleSaveNotes = async () => {
    if (!id) return;
    setIsSavingNotes(true);
    try {
      await axiosInstance.patch(`/api/scans/${id}/notes`, { notes });
    } catch (error) {
      console.error('Failed to save notes', error);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!id) return;
    setIsDownloading(true);
    try {
      const response = await axiosInstance.get(`/api/scans/${id}/report`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Failed to download report', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!scan || !scan.result) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Scan results not found.</p>
        <Link to="/patients" className="text-blue-400 hover:underline mt-4 inline-block">Return to Patients</Link>
      </div>
    );
  }

  // Find top condition for HeatmapViewer
  const diseases = ['pneumonia', 'effusion', 'atelectasis', 'cardiomegaly', 'pneumothorax'];
  let topCondition = 'No Finding';
  let topScore = scan.result.noFinding;

  diseases.forEach(d => {
    const score = (scan.result as any)[d];
    if (score > topScore) {
      topScore = score;
      topCondition = d;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        {user?.role !== 'Patient' && (
          <Link to={`/patients/${scan.patientId}`} className="text-sm text-slate-400 hover:text-white flex items-center mb-4 transition-colors w-max">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Patient Profile
          </Link>
        )}
        {user?.role === 'Patient' && (
          <Link to="/" className="text-sm text-slate-400 hover:text-white flex items-center mb-4 transition-colors w-max">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Analysis Results</h1>
            <p className="text-slate-400 mt-1">
              <span className="font-medium text-slate-300">{patientName}</span> • Scan taken on {new Date(scan.uploadedAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="flex items-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium rounded-lg transition-colors shadow-lg"
          >
            {isDownloading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
            Download PDF Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HeatmapViewer 
            originalUrl={scan.imageUrl} 
            heatmapBase64={scan.result.heatmapUrl} // Backend returns base64 in heatmapUrl or we adapt
            topCondition={topCondition} 
          />
        </div>
        
        <div className="space-y-6">
          <ResultCard result={scan.result} />
          
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Doctor's Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={user?.role === 'Patient'}
              rows={5}
              placeholder={user?.role === 'Patient' ? "No clinical notes provided yet." : "Add your clinical observations here..."}
              className={`w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${user?.role === 'Patient' ? 'opacity-70 cursor-not-allowed' : ''}`}
            />
            {user?.role !== 'Patient' && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes || notes === scan.notes}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
                >
                  {isSavingNotes ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {notes === scan.notes ? 'Saved' : 'Save Notes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
