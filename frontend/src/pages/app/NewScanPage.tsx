import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import axiosInstance from '../../api/axios';
import { UploadZone } from '../../components/UploadZone';
import type { Patient } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export const NewScanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axiosInstance.get(`/api/patients/${id}`);
        setPatient(response.data);
      } catch (error) {
        console.error('Failed to fetch patient for new scan', error);
      }
    };
    if (id) fetchPatient();
  }, [id]);

  const handleAnalyze = async (file: File) => {
    const formData = new FormData();
    formData.append('patientId', id!);
    formData.append('file', file);

    const response = await axiosInstance.post('/api/scans', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    // Redirect to the newly created scan result page
    navigate(`/scans/${response.data.scanId}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        {user?.role !== 'Patient' && (
          <Link to={`/patients/${id}`} className="text-sm text-slate-400 hover:text-white flex items-center mb-4 transition-colors w-max">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Patient
          </Link>
        )}
        {user?.role === 'Patient' && (
          <Link to="/" className="text-sm text-slate-400 hover:text-white flex items-center mb-4 transition-colors w-max">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
        )}
        <h1 className="text-2xl font-bold text-slate-100">Upload New X-Ray</h1>
        <p className="text-slate-400 mt-1">Upload a chest X-Ray image for AI analysis.</p>
      </div>

      {patient && (
        <div className="glass-panel p-4 border border-slate-800 rounded-xl flex items-center space-x-3 mb-8">
          <div className="bg-slate-800 p-2 rounded-lg">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Patient</p>
            <p className="font-medium text-slate-200">{patient.fullName}</p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <UploadZone onAnalyze={handleAnalyze} />
      </div>
    </div>
  );
};
