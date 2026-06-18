import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Ban,
  Droplets,
  Dumbbell,
  HeartPulse,
  Leaf,
  Shield,
  Syringe,
  TreePine,
  Wind,
  AlertTriangle,
  Clock,
  Thermometer,
  Stethoscope,
} from 'lucide-react';

/* ── Tip Card ── */
const TipCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}> = ({ icon, title, description, color, bgColor }) => (
  <div className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
    <div
      className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-4 ${color} transition-transform duration-300 group-hover:scale-110`}
    >
      {icon}
    </div>
    <h3 className="text-base font-semibold text-slate-100 mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
  </div>
);

/* ── Warning Sign ── */
const WarningSign: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start space-x-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
    <p className="text-sm text-slate-300">{text}</p>
  </div>
);

/* ── Breathing Exercise Step ── */
const BreathingStep: React.FC<{
  step: number;
  title: string;
  duration: string;
  instruction: string;
}> = ({ step, title, duration, instruction }) => (
  <div className="flex items-start space-x-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-cyan-400">{step}</span>
    </div>
    <div>
      <div className="flex items-center space-x-2 mb-1">
        <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">
          {duration}
        </span>
      </div>
      <p className="text-sm text-slate-400">{instruction}</p>
    </div>
  </div>
);

/* ── Tips Data ── */
const tips = [
  {
    icon: <Ban className="w-6 h-6" />,
    title: 'Quit Smoking',
    description:
      'Smoking damages lung tissue and increases risk of lung cancer, COPD, and emphysema. Quitting at any age significantly improves lung function and life expectancy.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: <Dumbbell className="w-6 h-6" />,
    title: 'Exercise Regularly',
    description:
      'Regular aerobic exercise strengthens breathing muscles, improves oxygen efficiency, and increases lung capacity. Aim for 30 minutes, 5 days a week.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: <TreePine className="w-6 h-6" />,
    title: 'Improve Air Quality',
    description:
      'Avoid exposure to pollutants, dust, and chemical fumes. Use air purifiers indoors and check local air quality indexes before outdoor activities.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: <Wind className="w-6 h-6" />,
    title: 'Practice Deep Breathing',
    description:
      'Deep breathing exercises like diaphragmatic breathing help expand lung capacity and improve oxygen exchange. Practice daily for best results.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: 'Avoid Pollutants',
    description:
      'Limit exposure to second-hand smoke, industrial chemicals, radon gas, and asbestos. Wear protective masks in high-pollution environments.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: <Stethoscope className="w-6 h-6" />,
    title: 'Regular Health Checkups',
    description:
      'Annual checkups and chest X-rays help detect problems early. Early detection of lung conditions significantly improves treatment outcomes.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: <Syringe className="w-6 h-6" />,
    title: 'Stay Vaccinated',
    description:
      'Get your annual flu shot and pneumonia vaccines. Vaccinations prevent respiratory infections that can cause serious lung damage.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: <Droplets className="w-6 h-6" />,
    title: 'Stay Hydrated',
    description:
      'Drinking enough water keeps the mucosal lining in your lungs thin, helping them function better. Aim for 8 glasses (2 liters) daily.',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
  },
];

/* ── Main Page ── */
export const HealthTipsPage: React.FC = () => {
  return (
    <div className="pt-24 lg:pt-32 pb-20">
      {/* Hero */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Wellness Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
            Keep Your Lungs{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Healthy
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Your lungs work tirelessly every day. Here are evidence-based tips to protect them,
            improve breathing, and reduce your risk of pulmonary diseases.
          </p>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="px-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, i) => (
              <TipCard key={i} {...tip} />
            ))}
          </div>
        </div>
      </section>

      {/* Warning Signs */}
      <section className="px-4 mb-20 bg-slate-900/30 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-100 mb-4">
              <span className="text-red-400">Warning Signs</span> — When to Seek Help
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Don't ignore these symptoms. If you experience any of the following, consult a healthcare
              professional immediately.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <WarningSign text="Persistent cough lasting more than 3 weeks, especially with blood" />
            <WarningSign text="Sudden shortness of breath or difficulty breathing at rest" />
            <WarningSign text="Chest pain that worsens with breathing, coughing, or laughing" />
            <WarningSign text="Wheezing or stridor (high-pitched breathing sounds)" />
            <WarningSign text="Unexplained weight loss combined with persistent fatigue" />
            <WarningSign text="Cyanosis — bluish discoloration of lips or fingertips" />
          </div>
        </div>
      </section>

      {/* Breathing Exercises */}
      <section className="px-4 mb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-100 mb-4">
              Simple{' '}
              <span className="text-cyan-400">Breathing Exercises</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Practice these exercises daily to strengthen your lungs and improve oxygen capacity.
            </p>
          </div>

          {/* Diaphragmatic Breathing */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-slate-100 mb-1">Diaphragmatic Breathing</h3>
            <p className="text-sm text-slate-400 mb-4">
              Also called "belly breathing," this technique engages your diaphragm for deeper, more efficient breaths.
            </p>
            <div className="space-y-3">
              <BreathingStep
                step={1}
                title="Get Comfortable"
                duration="Setup"
                instruction="Sit comfortably or lie on your back. Place one hand on your chest and the other on your belly."
              />
              <BreathingStep
                step={2}
                title="Breathe In"
                duration="4 sec"
                instruction="Inhale slowly through your nose for 4 seconds. Feel your belly rise under your hand while your chest stays relatively still."
              />
              <BreathingStep
                step={3}
                title="Breathe Out"
                duration="6 sec"
                instruction="Exhale slowly through pursed lips for 6 seconds. Feel your belly fall. The exhale should be longer than the inhale."
              />
              <BreathingStep
                step={4}
                title="Repeat"
                duration="5-10 min"
                instruction="Repeat for 5–10 minutes. Practice 3–4 times per day. Over time, this will become natural."
              />
            </div>
          </div>

          {/* 4-7-8 Technique */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-1">4-7-8 Relaxation Technique</h3>
            <p className="text-sm text-slate-400 mb-4">
              Developed by Dr. Andrew Weil, this technique reduces anxiety and promotes lung relaxation.
            </p>
            <div className="space-y-3">
              <BreathingStep
                step={1}
                title="Exhale Completely"
                duration="Prep"
                instruction="Empty your lungs completely through your mouth, making a whooshing sound."
              />
              <BreathingStep
                step={2}
                title="Inhale Quietly"
                duration="4 sec"
                instruction="Close your mouth and inhale quietly through your nose for a count of 4."
              />
              <BreathingStep
                step={3}
                title="Hold Breath"
                duration="7 sec"
                instruction="Hold your breath for a count of 7. This allows oxygen to fill your lungs thoroughly."
              />
              <BreathingStep
                step={4}
                title="Exhale Fully"
                duration="8 sec"
                instruction="Exhale completely through your mouth with a whooshing sound for a count of 8. Repeat 4 cycles."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="px-4 mb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-slate-100 mb-1">20,000</p>
              <p className="text-sm text-slate-400">Breaths per day on average</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <Thermometer className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-slate-100 mb-1">6 Liters</p>
              <p className="text-sm text-slate-400">Total lung capacity in adults</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-slate-100 mb-1">300M</p>
              <p className="text-sm text-slate-400">Alveoli in each healthy lung</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Concerned About Your Lung Health?
          </h2>
          <p className="text-slate-400 mb-8">
            Get an AI-powered analysis of your chest X-ray in seconds. Early detection saves lives.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/20"
          >
            <span>Get Your Free Analysis</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
