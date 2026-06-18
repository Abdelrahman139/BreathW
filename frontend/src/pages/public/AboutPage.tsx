import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  ChevronDown,
  ChevronUp,
  Code2,
  Database,
  Globe,
  Layers,
  Microscope,
  Shield,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';

/* ── FAQ Item ── */
const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-900/30 transition-colors"
      >
        <h3 className="text-sm font-semibold text-slate-200 pr-4">{question}</h3>
        <div className="text-slate-500 shrink-0">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

/* ── Tech Stack Card ── */
const TechCard: React.FC<{
  icon: React.ReactNode;
  name: string;
  description: string;
  color: string;
}> = ({ icon, name, description, color }) => (
  <div className="flex items-start space-x-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-semibold text-slate-100 mb-1">{name}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

/* ── Main Page ── */
export const AboutPage: React.FC = () => {
  const faqs = [
    {
      question: 'How accurate is PulmoAI?',
      answer:
        'PulmoAI uses a DenseNet121 model trained on the NIH Chest X-ray dataset. While it achieves strong performance in research settings, it is designed as a screening aid, not a replacement for professional radiological interpretation. All results should be reviewed by a qualified healthcare provider.',
    },
    {
      question: 'Is my medical data safe?',
      answer:
        'Yes. All uploaded images are processed securely and stored with encryption. Access is controlled through JWT-based authentication with role-based permissions. We never share patient data with third parties.',
    },
    {
      question: 'Can patients use PulmoAI without a doctor?',
      answer:
        'Yes! Patients can register independently, upload their own chest X-rays, and view AI-generated analysis results. However, we strongly recommend sharing results with a healthcare provider for proper clinical interpretation.',
    },
    {
      question: 'What conditions can PulmoAI detect?',
      answer:
        'PulmoAI can screen for 5 conditions: Pneumonia, Pleural Effusion, Atelectasis, Cardiomegaly, and Pneumothorax. It also indicates "No Finding" when no abnormalities are detected.',
    },
    {
      question: 'What is Grad-CAM and how does it help?',
      answer:
        'Gradient-weighted Class Activation Mapping (Grad-CAM) is a visualization technique that highlights the areas of an X-ray image that were most influential in the AI\'s decision. This helps doctors understand why the AI flagged certain conditions and improves trust in the results.',
    },
    {
      question: 'Is PulmoAI free to use?',
      answer:
        'PulmoAI offers free registration for individual practitioners and patients. We believe in making AI-assisted diagnostics accessible to everyone.',
    },
    {
      question: 'What image formats are supported?',
      answer:
        'PulmoAI accepts standard medical image formats including PNG, JPEG, and DICOM. Images are automatically preprocessed to the required input size for the AI model.',
    },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      {/* Hero */}
      <section className="px-4 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight mb-6">
            Making AI Diagnostics{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Accessible
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            PulmoAI is built on the belief that advanced medical imaging analysis should be available
            to every healthcare provider and patient, not just large hospitals with specialized radiologists.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100 mb-6">Our Mission</h2>
              <div className="space-y-4">
                <p className="text-slate-400 leading-relaxed">
                  We aim to bridge the gap between cutting-edge AI research and everyday clinical practice.
                  Chest X-rays are the most commonly performed diagnostic imaging test worldwide, yet many
                  healthcare facilities lack the specialist radiologists needed for timely interpretation.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  PulmoAI provides an AI-powered second opinion that helps doctors triage patients faster,
                  empowers patients to be proactive about their health, and brings deep learning capabilities
                  to clinics of all sizes.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                  <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-200">Early Detection</p>
                  <p className="text-xs text-slate-500 mt-1">Catch conditions before they escalate</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                  <Globe className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-200">Global Access</p>
                  <p className="text-xs text-slate-500 mt-1">Available anywhere with internet</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                  <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-200">Instant Results</p>
                  <p className="text-xs text-slate-500 mt-1">Analysis in under a second</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                  <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-200">Trustworthy AI</p>
                  <p className="text-xs text-slate-500 mt-1">Explainable with Grad-CAM</p>
                </div>
              </div>
            </div>

            {/* Visual — Architecture diagram */}
            <div className="relative">
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md">
                <h3 className="text-sm font-semibold text-slate-300 mb-6 text-center">System Architecture</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-slate-300">React Frontend</span>
                    </div>
                    <span className="text-xs text-slate-500">Port 5173</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-px h-6 bg-slate-700" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm text-slate-300">ASP.NET Core API</span>
                    </div>
                    <span className="text-xs text-slate-500">Port 5000</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-px h-6 bg-slate-700" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-center">
                      <Brain className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <span className="text-xs text-slate-300">AI Service</span>
                      <p className="text-xs text-slate-500">DenseNet121</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
                      <Layers className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                      <span className="text-xs text-slate-300">SQL Server</span>
                      <p className="text-xs text-slate-500">EF Core</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="px-4 mb-20 bg-slate-900/30 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-100 mb-4">
              How Our <span className="text-blue-400">AI Works</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A simplified explanation of the technology behind PulmoAI's chest X-ray analysis.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <TechCard
              icon={<Brain className="w-5 h-5 text-purple-400" />}
              name="DenseNet121 Architecture"
              description="A 121-layer deep convolutional neural network with dense connections. Each layer receives inputs from all preceding layers, enabling efficient feature reuse."
              color="bg-purple-500/10 border border-purple-500/20"
            />
            <TechCard
              icon={<Microscope className="w-5 h-5 text-blue-400" />}
              name="Multi-Label Classification"
              description="The model simultaneously predicts probabilities for all 6 conditions, allowing detection of multiple co-occurring conditions in a single scan."
              color="bg-blue-500/10 border border-blue-500/20"
            />
            <TechCard
              icon={<Sparkles className="w-5 h-5 text-cyan-400" />}
              name="Grad-CAM Visualization"
              description="Gradient-weighted Class Activation Mapping generates heatmaps showing which regions of the X-ray influenced the model's predictions — providing explainability."
              color="bg-cyan-500/10 border border-cyan-500/20"
            />
            <TechCard
              icon={<Code2 className="w-5 h-5 text-emerald-400" />}
              name="FastAPI + PyTorch"
              description="The AI service runs on FastAPI for high-performance async API serving, with PyTorch providing the deep learning inference engine."
              color="bg-emerald-500/10 border border-emerald-500/20"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 mb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-100 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Join the Future of Medical Imaging
          </h2>
          <p className="text-slate-400 mb-8">
            Whether you're a doctor seeking an AI second opinion or a patient monitoring your health,
            PulmoAI is here for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/20"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/diseases"
              className="px-8 py-4 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-2xl transition-all duration-200"
            >
              Explore Conditions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
