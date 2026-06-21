import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, User, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios';
import { UploadZone } from '../../components/UploadZone';
import { PatientForm } from '../../components/PatientForm';
import type { PatientFormData } from '../../components/PatientForm';
import type { Patient } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export const DoctorUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Doctors only page
    if (user && user.role === 'Patient') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const fetchPatients = async (searchQuery: string = '') => {
    try {
      const response = await axiosInstance.get(`/api/patients?search=${searchQuery}&page=1`);
      setPatients(response.data.patients || response.data || []);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    }
  };

  useEffect(() => {
    // Fetch patients when search changes
    const timeoutId = setTimeout(() => fetchPatients(search), 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleCreatePatient = async (data: PatientFormData) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/api/patients', data);
      setIsModalOpen(false);
      // Auto-select the newly created patient
      if (response.data && response.data.id) {
        setSelectedPatient(response.data);
      } else {
        fetchPatients(search); // Refresh list just in case
      }
      toast.success('Patient created and selected!');
    } catch (error) {
      console.error('Failed to create patient', error);
      toast.error('Failed to create patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnalyze = async (file: File) => {
    if (!selectedPatient) {
      toast.error('Please select a patient first');
      return;
    }
    const formData = new FormData();
    formData.append('patientId', selectedPatient.id);
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/api/scans', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Scan uploaded successfully!');
      // Redirect to the newly created scan result page
      navigate(`/scans/${response.data.scanId}`);
    } catch (error) {
      toast.error('Failed to analyze scan');
      console.error('Failed to upload scan', error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white flex items-center mb-4 transition-colors w-max">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-100">Upload New X-Ray Scan</h1>
        <p className="text-slate-400 mt-1">Select a patient or create a new one to begin the AI analysis.</p>
      </div>

      {!selectedPatient ? (
        <div className="glass-panel p-6 rounded-2xl flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-100">Step 1: Select Patient</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Patient
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search existing patients by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-blue-500 sm:text-sm transition-colors"
            />
          </div>

          <div className="border border-slate-800 rounded-xl max-h-64 overflow-y-auto bg-slate-900/30">
            {patients.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-sm">
                No patients found. Click "New Patient" to create one.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {patients.map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className="w-full text-left p-4 hover:bg-slate-800/40 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <User className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{patient.fullName}</p>
                        <p className="text-xs text-slate-500">DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-sm text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Select &rarr;</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-panel p-4 border border-blue-500/30 bg-blue-500/5 rounded-xl flex items-center justify-between shadow-lg shadow-blue-500/5">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-0.5">Selected Patient</p>
                <p className="text-sm font-semibold text-slate-200">{selectedPatient.fullName}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedPatient(null)}
              className="text-sm text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-800 transition-all"
            >
              Change
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Step 2: Upload X-Ray</h2>
            <UploadZone onAnalyze={handleAnalyze} />
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg relative z-10 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Add New Patient</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <PatientForm onSubmit={handleCreatePatient} isLoading={isSubmitting} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
