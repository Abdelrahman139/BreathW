import React, { useEffect, useState } from 'react';
import { Users, FileImage, AlertTriangle, Calendar, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie, Legend, LabelList } from 'recharts';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { ConditionBadge } from '../../components/ConditionBadge';
import { useAuth } from '../../hooks/useAuth';

interface DashboardStats {
  totalPatients: number;
  totalScans: number;
  highRisk: number;
  scansThisWeek: number;
  conditionCounts: { name: string; count: number }[];
  scansTimeline: { name: string; count: number }[];
  patientStatus: { name: string; value: number }[];
}

interface RecentScan {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  topCondition: string;
  topScore: number;
}

import { Skeleton } from '../../components/ui/Skeleton';

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
      <div className="space-y-8 animate-fade-in">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <Skeleton className="h-64 w-full rounded-2xl" />

        {user?.role !== 'Patient' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        <div className={`grid grid-cols-1 gap-8 ${user?.role !== 'Patient' ? 'lg:grid-cols-3' : ''}`}>
          {user?.role !== 'Patient' && (
            <Skeleton className="lg:col-span-2 h-[400px] rounded-2xl" />
          )}
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
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
      { name: 'Cardiomegaly', count: 0 },
      { name: 'Pneumothorax', count: 0 },
    ],
    scansTimeline: [],
    patientStatus: []
  };

  const statCards = [
    { title: 'Total Patients', value: safeStats.totalPatients, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Total Scans', value: safeStats.totalScans, icon: FileImage, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'High Risk Cases', value: safeStats.highRisk, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { title: 'Scans This Week', value: safeStats.scansThisWeek, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Welcome back, {user?.fullName || 'User'}</h1>
        <p className="text-slate-400 mt-1">Manage your X-Ray scans and view clinical AI analysis results.</p>
      </div>

      {/* Primary Action - Upload */}
      <div className="glass-panel p-8 rounded-2xl text-center border border-slate-700 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <FileImage className="w-16 h-16 text-blue-400 mx-auto mb-4 drop-shadow-md" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Upload a New Scan</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Get instant AI analysis for your chest X-Ray. Simply upload your image and our system will generate a detailed diagnostic report.
          </p>
          <Link
            to={user?.role === 'Doctor' ? '/doctor/upload' : `/patients/${user?.id || 'new'}/new-scan`}
            className="inline-flex items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            Start New Scan Analysis
          </Link>
        </div>
      </div>

      {/* Statistics Row (Doctors Only) */}
      {user?.role !== 'Patient' && (
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
      )}

      {/* Charts & Recent Scans */}
      <div className={`grid grid-cols-1 gap-8 ${user?.role !== 'Patient' ? 'lg:grid-cols-3' : ''}`}>
        {/* Doctor Charts Section */}
        {user?.role !== 'Patient' && (
          <div className="lg:col-span-2 space-y-8">
            
            {/* Top row of charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Detection Distribution */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <h2 className="text-lg font-semibold text-slate-100 mb-6">Detection Distribution</h2>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={safeStats.conditionCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#1e293b' }} 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} 
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                        {safeStats.conditionCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                        ))}
                        <LabelList dataKey="count" position="top" fill="#94a3b8" fontSize={14} fontWeight="bold" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Patient Status (Pie Chart) */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <h2 className="text-lg font-semibold text-slate-100 mb-6">Healthy vs At Risk</h2>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={safeStats.patientStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {safeStats.patientStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Scans Timeline */}
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-lg font-semibold text-slate-100 mb-6">Scans Over Time (Last 7 Days)</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={safeStats.scansTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
        
        {/* Recent Scans */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <h2 className="text-lg font-semibold text-slate-100 mb-6 flex justify-between items-center">
            Recent Scans
            <Link to={user?.role === 'Patient' ? `/patients/${user?.id}` : "/patients"} className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
              View All
            </Link>
          </h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentScans.length === 0 ? (
              <div className="text-center text-slate-500 py-10">No recent scans found.</div>
            ) : (
              recentScans.map(scan => (
                <div key={scan.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/scans/${scan.id}`} className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors truncate pr-2">
                      {scan.patientName}
                    </Link>
                    <span className="text-xs text-slate-500 flex-shrink-0">{new Date(scan.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-slate-400 capitalize truncate pr-2">{scan.topCondition.replace('_', ' ')}</span>
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
