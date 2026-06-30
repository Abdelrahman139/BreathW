import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Brain, Activity, Target, Zap, ShieldCheck } from 'lucide-react';

/* ── Data ── */
const trainingData = [
  { epoch: 1, trainLoss: 0.4268, valLoss: 0.3677 },
  { epoch: 2, trainLoss: 0.3590, valLoss: 0.3412 },
  { epoch: 3, trainLoss: 0.3174, valLoss: 0.3223 },
  { epoch: 4, trainLoss: 0.2746, valLoss: 0.2848 },
  { epoch: 5, trainLoss: 0.2361, valLoss: 0.2668 },
];

const classMetrics = [
  { condition: 'Pneumonia', accuracy: 85, precision: 82, recall: 79 },
  { condition: 'Pleural Effusion', accuracy: 87, precision: 84, recall: 81 },
  { condition: 'Cardiomegaly', accuracy: 89, precision: 88, recall: 83 },
  { condition: 'Pneumothorax', accuracy: 86, precision: 83, recall: 78 },
  { condition: 'No Finding', accuracy: 88, precision: 86, recall: 84 },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({
  title,
  value,
  icon,
  color,
}) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center space-x-4 hover:border-slate-700 transition-colors">
    <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
    </div>
  </div>
);

export const ModelPerformancePage: React.FC = () => {
  return (
    <div className="pt-24 lg:pt-32 pb-20">
      {/* Hero Section */}
      <section className="px-4 mb-16">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Activity className="w-4 h-4" />
            <span>AI Model Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight mb-6">
            Training Results &{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Statistics
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Detailed performance metrics of our core DenseNet-121 model. We trained the network on
            thousands of chest X-rays to achieve high accuracy and reliable screening results.
          </p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="px-4 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Best Validation Loss"
              value="0.2668"
              icon={<Target className="w-6 h-6 text-emerald-400" />}
              color="bg-emerald-500/10 border border-emerald-500/20"
            />
            <StatCard
              title="Overall Accuracy"
              value="89.67%"
              icon={<ShieldCheck className="w-6 h-6 text-blue-400" />}
              color="bg-blue-500/10 border border-blue-500/20"
            />
            <StatCard
              title="Training Epochs"
              value="5"
              icon={<Brain className="w-6 h-6 text-purple-400" />}
              color="bg-purple-500/10 border border-purple-500/20"
            />
            <StatCard
              title="Inference Time (TTA)"
              value="~2s"
              icon={<Zap className="w-6 h-6 text-amber-400" />}
              color="bg-amber-500/10 border border-amber-500/20"
            />
          </div>
        </div>
      </section>

      {/* Training Progression Charts */}
      <section className="px-4 mb-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Training Progression</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Loss Chart */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-6">Training & Validation Loss</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trainingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="epoch" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="trainLoss"
                      name="Training Loss"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="valLoss"
                      name="Validation Loss"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Loss Reduction Chart */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-6">Loss Reduction Over Epochs</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trainingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="epoch" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 0.5]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend />
                    <Bar dataKey="trainLoss" name="Train Loss" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="valLoss" name="Val Loss" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Class-wise Metrics */}
      <section className="px-4 mb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Class-Wise Metrics</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 overflow-hidden">
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="condition" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                  />
                  <Legend />
                  <Bar dataKey="accuracy" name="Accuracy (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="precision" name="Precision (%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recall" name="Recall (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
