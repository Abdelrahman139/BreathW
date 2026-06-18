import React, { useEffect, useState } from 'react';
import { Users, FileImage, AlertTriangle, Calendar, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { ConditionBadge } from '../components/ConditionBadge';
import { useAuth } from '../hooks/useAuth';

interface DashboardStats {
  totalPatients: number;
  totalScans: number;
  highRisk: number;
  scansThisWeek: number;
  conditionCounts: { name: string; count: number }[];
}

interface RecentScan {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  topCondition: string;
  topScore: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, scansRes] = await Promise.all([
          axiosInstance.get('/api/dashboard/stats'),
          axiosInstance.get('/api/dashboard/recent-scans')
        ]);
        setStats(statsRes.data);
        setRecentScans(scansRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Fallback mock data if API fails or returns null
  const safeStats = stats || {
    totalPatients: 0,
    totalScans: 0,
    highRisk: 0,
    scansThisWeek: 0,
    conditionCounts: [
      { name: 'Pneumonia', count: 0 },
      { name: 'Effusion', count: 0 },
      { name: 'Atelectasis', count: 0 },
      { name: 'Cardiomegaly', count: 0 },
      { name: 'Pneumothorax', count: 0 },
    ]
  };

  const statCards = [
    { title: 'Total Patients', value: safeStats.totalPatients, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Total Scans', value: safeStats.totalScans, icon: FileImage, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'High Risk Cases', value: safeStats.highRisk, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { title: 'Scans This Week', value: safeStats.scansThisWeek, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  if (user?.role === 'Patient') {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome, {user.fullName}</h1>
          <p className="text-slate-400 mt-1">Manage your X-Ray scans and view AI analysis results.</p>
        </div>
        
        <div className="glass-panel p-8 rounded-2xl text-center border border-slate-700 max-w-2xl mx-auto mt-12 shadow-2xl">
          <FileImage className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Upload a New Scan</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Get instant AI analysis for your chest X-Ray. Simply upload your image and our system will generate a detailed diagnostic report.
          </p>
          <Link
            to={`/app/patients/${user.id}/new-scan`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            Start New Scan Analysis
          </Link>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl max-w-4xl mx-auto mt-8">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 border-b border-slate-800 pb-2">Your Recent Scans</h3>
          <p className="text-slate-500 text-center py-8">No recent scans found in your history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of clinical activity and AI detections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-400">{card.title}</p>
              <p className="text-3xl font-bold text-slate-100 mt-2">{card.value}</p>
            </div>
            <div className={`p-4 rounded-xl ${card.bg}`}>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Detection Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safeStats.conditionCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }} 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} 
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {safeStats.conditionCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <h2 className="text-lg font-semibold text-slate-100 mb-6 flex justify-between items-center">
            Recent Scans
            <Link to="/patients" className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All</Link>
          </h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentScans.length === 0 ? (
              <div className="text-center text-slate-500 py-10">No recent scans found.</div>
            ) : (
              recentScans.map(scan => (
                <div key={scan.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/patients/${scan.patientId}`} className="font-medium text-slate-200 hover:text-blue-400 transition-colors">
                      {scan.patientName}
                    </Link>
                    <span className="text-xs text-slate-500">{new Date(scan.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-slate-400 capitalize">{scan.topCondition.replace('_', ' ')}</span>
                    <ConditionBadge score={scan.topScore} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
