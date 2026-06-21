import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User as UserIcon, Calendar, Activity, FileImage, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import axiosInstance, { API_BASE_URL } from '../../api/axios';
import type { Patient, Scan } from '../../types';
import { ConditionBadge } from '../../components/ConditionBadge';
import { useAuth } from '../../hooks/useAuth';
import { Skeleton } from '../../components/ui/Skeleton';

interface PatientDetailData extends Patient {
  scans: Scan[];
}

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [patientData, setPatientData] = useState<PatientDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axiosInstance.get(`/api/patients/${id}`);
        setPatientData(response.data);
      } catch (error) {
        console.error('Failed to fetch patient details', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPatientData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Skeleton className="w-16 h-16 rounded-full shrink-0" />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>

        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Patient not found or failed to load.</p>
        <Link to="/patients" className="text-blue-400 hover:underline mt-4 inline-block">Return to Patients</Link>
      </div>
    );
  }

  const age = new Date().getFullYear() - new Date(patientData.dateOfBirth).getFullYear();

  return (
    <div className="space-y-6">
      <div>
        {user?.role !== 'Patient' && (
          <Link to="/patients" className="text-sm text-slate-400 hover:text-white flex items-center mb-4 transition-colors w-max">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Patients
          </Link>
        )}
        {user?.role === 'Patient' && (
          <Link to="/" className="text-sm text-slate-400 hover:text-white flex items-center mb-4 transition-colors w-max">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-100">
            {user?.role === 'Patient' ? 'My Profile' : 'Patient Overview'}
          </h1>
          <Link
            to={`/patients/${id}/new-scan`}
            className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            New X-Ray Scan
          </Link>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
          <UserIcon className="w-8 h-8 text-slate-400" />
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Full Name</p>
            <p className="text-lg font-semibold text-slate-100">{patientData.fullName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Date of Birth</p>
            <div className="flex items-center text-slate-200">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" />
              {new Date(patientData.dateOfBirth).toLocaleDateString()} <span className="text-slate-500 ml-2">({age} yrs)</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Gender</p>
            <div className="flex items-center text-slate-200">
              <Activity className="w-4 h-4 mr-2 text-slate-400" />
              {patientData.gender}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
          <FileImage className="w-5 h-5 mr-2 text-blue-400" />
          Scan History
        </h2>

        <div className="space-y-4">
          {(!patientData.scans || patientData.scans.length === 0) ? (
            <div className="glass-panel p-8 text-center rounded-xl">
              <FileImage className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No scans recorded for this patient yet.</p>
              <Link to={`/patients/${id}/new-scan`} className="text-blue-400 hover:text-blue-300 font-medium mt-2 inline-block">
                Upload their first X-Ray
              </Link>
            </div>
          ) : (
            patientData.scans.map(scan => {
              // Extract top condition for display
              // Assuming scan.result object is mapped correctly, we exclude non-disease keys
              const diseases = ['pneumonia', 'effusion', 'cardiomegaly', 'pneumothorax'];
              let topCondition = 'No Finding';
              let topScore = scan.result?.noFinding || 0;

              if (scan.result) {
                diseases.forEach(d => {
                  const score = (scan.result as any)[d];
                  if (score > topScore) {
                    topScore = score;
                    topCondition = d;
                  }
                });
              }

              return (
                <div key={scan.id} className="glass-panel p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                      {/* Assuming scan has an imageUrl or thumbnail */}
                      {scan.imageUrl ? (
                        <img src={scan.imageUrl.startsWith('http') ? scan.imageUrl : `${API_BASE_URL}${scan.imageUrl}`} alt="Scan thumb" className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <FileImage className="w-6 h-6 m-3 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-slate-200 font-medium">{new Date(scan.uploadedAt).toLocaleString()}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-slate-400 capitalize mr-3">Top finding: {topCondition.replace('_', ' ')}</span>
                        <ConditionBadge score={topScore} />
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/scans/${scan.id}`}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700 w-full sm:w-auto text-center"
                  >
                    View Results
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
