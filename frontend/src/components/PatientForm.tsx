import React, { useState } from 'react';
import { User as UserIcon, Calendar, Activity, FileText, Loader2 } from 'lucide-react';

export interface PatientFormData {
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  notes?: string;
}

interface PatientFormProps {
  initialData?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => Promise<void>;
  isLoading?: boolean;
}

export const PatientForm: React.FC<PatientFormProps> = ({ initialData, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<PatientFormData>({
    fullName: initialData?.fullName || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    gender: initialData?.gender || 'Male',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PatientFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name as keyof PatientFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Partial<Record<keyof PatientFormData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`block w-full pl-10 bg-slate-900/50 border ${errors.fullName ? 'border-red-500' : 'border-slate-700'} rounded-lg py-2.5 text-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors`}
            placeholder="John Doe"
          />
        </div>
        {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Date of Birth</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`block w-full pl-10 bg-slate-900/50 border ${errors.dateOfBirth ? 'border-red-500' : 'border-slate-700'} rounded-lg py-2.5 text-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors`}
            />
          </div>
          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Gender</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Activity className="h-5 w-5 text-slate-500" />
            </div>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="block w-full pl-10 bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 text-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors appearance-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Clinical Notes (Optional)</label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <FileText className="h-5 w-5 text-slate-500" />
          </div>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="block w-full pl-10 bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 text-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Add any relevant medical history or notes..."
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:bg-blue-600/50 transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Patient Record'
          )}
        </button>
      </div>
    </form>
  );
};
