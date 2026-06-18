import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  Shield,
  Users,
  Upload,
  Cpu,
  FileCheck,
  Activity,
  Zap,
  Lock,
  BarChart3,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/* ── Animated Counter Hook ── */
function useCounter(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return { count, ref };
}

/* ── Feature Card ── */
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}> = ({ icon, title, description, gradient }) => (
  <div className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${gradient} transition-transform duration-300 group-hover:scale-110`}
    >
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
  </div>
);

/* ── Step Card ── */
const StepCard: React.FC<{
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ step, icon, title, description }) => (
  <div className="relative flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 relative">
      {icon}
      <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
        {step}
      </span>
    </div>
    <h3 className="text-base font-semibold text-slate-100 mb-1">{title}</h3>
    <p className="text-sm text-slate-400 max-w-xs">{description}</p>
  </div>
);

/* ── Main Page ── */
export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const stat1 = useCounter(6, 1500);
  const stat2 = useCounter(99, 2000);
  const stat3 = useCounter(500, 2500);

  return (
    <div className="overflow-hidden">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 px-4">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5" />
            <span>AI-Powered Medical Imaging</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
            <span className="text-slate-100">Chest X-Ray Analysis</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 animate-fade-in-up-delay">
            Detect pneumonia, effusion, and other pulmonary conditions in seconds.
            Advanced deep learning with Grad-CAM visual explanations for clinical confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-2">
            <Link
              to={isAuthenticated ? '/app' : '/register'}
              className="group flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              <span>{isAuthenticated ? 'Upload New Scan' : 'Get Started Free'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center space-x-2 px-8 py-4 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-2xl transition-all duration-200 hover:bg-slate-900/50"
            >
              <span>Learn More</span>
            </a>
          </div>

          {/* Hero Visual — Floating Cards */}
          <div className="mt-16 lg:mt-24 relative max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 backdrop-blur-md p-8 shadow-2xl">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-left">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center mb-2">
                    <Activity className="w-4 h-4 text-red-400" />
                  </div>
                  <p className="text-xs text-slate-500 mb-1">Pneumonia</p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[72%] bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                  </div>
                  <p className="text-right text-xs text-slate-400 mt-1">72%</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-left">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mb-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-xs text-slate-500 mb-1">Effusion</p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[34%] bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" />
                  </div>
                  <p className="text-right text-xs text-slate-400 mt-1">34%</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-left">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-500 mb-1">No Finding</p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[18%] bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" />
                  </div>
                  <p className="text-right text-xs text-slate-400 mt-1">18%</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">Sample AI Analysis Preview</p>
              </div>
            </div>

            {/* Decorative floating elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-2xl border border-blue-500/10 rotate-12 blur-sm" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-purple-500/10 rounded-2xl border border-purple-500/10 -rotate-12 blur-sm" />
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES SECTION ═══════════════ */}
      <section id="features" className="py-20 lg:py-28 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-100 mb-4">
              Why Choose <span className="text-blue-400">PulmoAI</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with clinical expertise to deliver fast,
              accurate chest X-ray analysis.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Brain className="w-6 h-6 text-blue-400" />}
              title="AI Detection"
              description="DenseNet121 deep learning model trained on thousands of chest X-rays for accurate multi-label classification."
              gradient="bg-blue-500/10 border border-blue-500/20"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-purple-400" />}
              title="Grad-CAM Heatmaps"
              description="Visual explanations highlighting exactly where the AI found abnormalities in the X-ray image."
              gradient="bg-purple-500/10 border border-purple-500/20"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-emerald-400" />}
              title="Patient Portal"
              description="Patients can upload scans, view results, and track their history — all without needing a doctor present."
              gradient="bg-emerald-500/10 border border-emerald-500/20"
            />
            <FeatureCard
              icon={<Stethoscope className="w-6 h-6 text-amber-400" />}
              title="Doctor Dashboard"
              description="Full clinical management: patient records, scan history, clinical notes, and AI-assisted diagnostics."
              gradient="bg-amber-500/10 border border-amber-500/20"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-20 lg:py-28 px-4 relative bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-100 mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Get your chest X-ray analyzed in three simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-blue-500/30 via-blue-500/50 to-blue-500/30" />

            <StepCard
              step={1}
              icon={<Upload className="w-7 h-7 text-blue-400" />}
              title="Upload X-Ray"
              description="Upload a chest X-ray image through our secure portal — drag and drop or browse your files."
            />
            <StepCard
              step={2}
              icon={<Cpu className="w-7 h-7 text-blue-400" />}
              title="AI Analyzes"
              description="Our DenseNet121 model processes the image and generates confidence scores for 6 conditions."
            />
            <StepCard
              step={3}
              icon={<FileCheck className="w-7 h-7 text-blue-400" />}
              title="Get Results"
              description="View detailed results with probability scores, Grad-CAM heatmaps, and doctor-ready reports."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS SECTION ═══════════════ */}
      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8">
            <div ref={stat1.ref} className="text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-4xl lg:text-5xl font-extrabold text-blue-400 mb-2">
                {stat1.count}+
              </p>
              <p className="text-sm text-slate-400 font-medium">Conditions Detected</p>
            </div>
            <div ref={stat2.ref} className="text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-4xl lg:text-5xl font-extrabold text-emerald-400 mb-2">
                {stat2.count}%
              </p>
              <p className="text-sm text-slate-400 font-medium">Uptime Reliability</p>
            </div>
            <div ref={stat3.ref} className="text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-4xl lg:text-5xl font-extrabold text-purple-400 mb-2">
                {stat3.count}ms
              </p>
              <p className="text-sm text-slate-400 font-medium">Average Analysis Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECURITY SECTION ═══════════════ */}
      <section className="py-20 lg:py-28 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-100 mb-6">
                Your Data is{' '}
                <span className="text-blue-400">Secure</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                We take patient data privacy seriously. All medical images and reports are
                encrypted, and access is controlled through role-based authentication.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Lock, text: 'JWT-based authentication with encrypted tokens' },
                  { icon: Shield, text: 'Role-based access control for Doctors & Patients' },
                  { icon: Zap, text: 'Real-time secure processing with no data retention on AI servers' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm text-slate-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 backdrop-blur-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <p className="text-slate-500">// Authentication Flow</p>
                  <p><span className="text-purple-400">POST</span> <span className="text-blue-400">/api/auth/login</span></p>
                  <p className="text-slate-500">{'{'}</p>
                  <p className="text-slate-400 pl-4">"email": <span className="text-emerald-400">"doctor@hospital.com"</span></p>
                  <p className="text-slate-400 pl-4">"password": <span className="text-emerald-400">"••••••••"</span></p>
                  <p className="text-slate-500">{'}'}</p>
                  <p className="text-slate-500 mt-3">// Response: 200 OK</p>
                  <p className="text-slate-500">{'{'}</p>
                  <p className="text-slate-400 pl-4">"token": <span className="text-amber-400">"eyJhbGciOi..."</span></p>
                  <p className="text-slate-400 pl-4">"role": <span className="text-emerald-400">"Doctor"</span></p>
                  <p className="text-slate-500">{'}'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="py-20 lg:py-28 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-100 mb-6">
            Ready to Transform Your Diagnostics?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Join PulmoAI today and experience the future of AI-assisted chest X-ray analysis.
            Free for individual practitioners.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/app' : '/register'}
              className="group flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30"
            >
              <span>{isAuthenticated ? 'Upload New Scan' : 'Create Free Account'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-2xl transition-all duration-200"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
