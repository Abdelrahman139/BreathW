import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Heart,
  Wind,
  Droplets,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface DiseaseInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  bgColor: string;
  severity: 'High' | 'Medium' | 'Low' | 'Normal';
  severityColor: string;
  shortDesc: string;
  description: string;
  symptoms: string[];
  causes: string[];
  whenToSeeDoctor: string;
}

const diseases: DiseaseInfo[] = [
  {
    id: 'pneumonia',
    name: 'Pneumonia',
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'text-red-400',
    borderColor: 'border-red-500/20',
    bgColor: 'bg-red-500/10',
    severity: 'High',
    severityColor: 'bg-red-500/20 text-red-400',
    shortDesc: 'Infection that inflames air sacs in one or both lungs.',
    description:
      'Pneumonia is an infection that inflames the air sacs (alveoli) in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm, fever, chills, and difficulty breathing. It can range from mild to life-threatening and is most serious for infants, young children, older adults, and people with weakened immune systems.',
    symptoms: [
      'Chest pain when breathing or coughing',
      'Persistent cough with phlegm or pus',
      'Fever, sweating, and shaking chills',
      'Shortness of breath during normal activities',
      'Fatigue, nausea, vomiting, or diarrhea',
    ],
    causes: [
      'Bacteria (most common: Streptococcus pneumoniae)',
      'Viruses including influenza and COVID-19',
      'Fungi, especially in immunocompromised patients',
      'Aspiration of food, drink, or saliva into lungs',
    ],
    whenToSeeDoctor:
      'Seek immediate medical attention if you have difficulty breathing, chest pain, persistent high fever (102°F / 39°C or higher), or a persistent cough, especially if you are coughing up pus.',
  },
  {
    id: 'effusion',
    name: 'Pleural Effusion',
    icon: <Droplets className="w-6 h-6" />,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/10',
    severity: 'Medium',
    severityColor: 'bg-amber-500/20 text-amber-400',
    shortDesc: 'Abnormal accumulation of fluid between the layers lining the lungs.',
    description:
      'Pleural effusion is a buildup of excess fluid between the layers of the pleura outside the lungs. The pleura are thin membranes that line the lungs and the inside of the chest cavity. A small amount of pleural fluid is normal, but when too much accumulates, it can compress the lung and cause breathing difficulty.',
    symptoms: [
      'Shortness of breath, especially when lying down',
      'Sharp chest pain that worsens with deep breaths',
      'Dry, non-productive cough',
      'Difficulty taking deep breaths',
      'Reduced breath sounds on affected side',
    ],
    causes: [
      'Congestive heart failure (most common cause)',
      'Pneumonia or other lung infections',
      'Liver or kidney disease',
      'Pulmonary embolism (blood clot in the lung)',
      'Cancer (lung, breast, or lymphoma)',
    ],
    whenToSeeDoctor:
      'See a doctor if you experience unexplained shortness of breath or chest pain. Large effusions can be life-threatening and may require drainage.',
  },
  {
    id: 'atelectasis',
    name: 'Atelectasis',
    icon: <Wind className="w-6 h-6" />,
    color: 'text-orange-400',
    borderColor: 'border-orange-500/20',
    bgColor: 'bg-orange-500/10',
    severity: 'Medium',
    severityColor: 'bg-orange-500/20 text-orange-400',
    shortDesc: 'Complete or partial collapse of the entire lung or area of the lung.',
    description:
      'Atelectasis is a complete or partial collapse of the entire lung or an area (lobe) of the lung. It occurs when the tiny air sacs (alveoli) within the lung deflate or fill with alveolar fluid. Atelectasis is one of the most common breathing complications after surgery and can also be a complication of other respiratory problems.',
    symptoms: [
      'Difficulty breathing (dyspnea)',
      'Rapid, shallow breathing',
      'Wheezing',
      'Cough (usually without significant sputum)',
      'Low-grade fever in some cases',
    ],
    causes: [
      'Blockage of airways (mucus plug, foreign body, tumor)',
      'Post-surgical complication (especially chest/abdominal)',
      'Prolonged bed rest with shallow breathing',
      'Pleural effusion or pneumothorax',
      'Chest injuries or trauma',
    ],
    whenToSeeDoctor:
      'Always consult a doctor if you notice increasing difficulty breathing. Atelectasis after surgery typically requires chest physiotherapy and deep breathing exercises.',
  },
  {
    id: 'cardiomegaly',
    name: 'Cardiomegaly',
    icon: <Heart className="w-6 h-6" />,
    color: 'text-pink-400',
    borderColor: 'border-pink-500/20',
    bgColor: 'bg-pink-500/10',
    severity: 'High',
    severityColor: 'bg-red-500/20 text-red-400',
    shortDesc: 'Enlarged heart visible on chest X-ray, indicating underlying heart conditions.',
    description:
      'Cardiomegaly refers to an enlarged heart as seen on imaging tests like a chest X-ray. An enlarged heart isn\'t a disease itself, but a sign of another condition. It can be caused by conditions that make the heart pump harder or that damage the heart muscle. A mildly enlarged heart can still pump blood normally, but a severely enlarged heart may not pump efficiently.',
    symptoms: [
      'Shortness of breath, especially during activity or lying flat',
      'Swelling (edema) in legs and ankles',
      'Irregular heartbeat (arrhythmia)',
      'Dizziness and fatigue',
      'Chest discomfort or palpitations',
    ],
    causes: [
      'High blood pressure (hypertension)',
      'Coronary artery disease',
      'Heart valve disease',
      'Cardiomyopathy (disease of the heart muscle)',
      'Congenital heart defects',
    ],
    whenToSeeDoctor:
      'Seek emergency medical care if you experience chest pain, severe shortness of breath, or fainting. Early detection and treatment of the underlying cause is crucial.',
  },
  {
    id: 'pneumothorax',
    name: 'Pneumothorax',
    icon: <ShieldAlert className="w-6 h-6" />,
    color: 'text-violet-400',
    borderColor: 'border-violet-500/20',
    bgColor: 'bg-violet-500/10',
    severity: 'High',
    severityColor: 'bg-red-500/20 text-red-400',
    shortDesc: 'Collapsed lung caused by air leaking into the space between lung and chest wall.',
    description:
      'A pneumothorax (collapsed lung) occurs when air leaks into the space between your lung and the chest wall. This air pushes on the outside of your lung and makes it collapse. It can be a complete or partial collapse. A small pneumothorax may resolve on its own, but a large one can be life-threatening and requires immediate treatment.',
    symptoms: [
      'Sudden, sharp chest pain on one side',
      'Shortness of breath that may be severe',
      'Rapid heart rate',
      'Rapid breathing',
      'Cyanosis (bluish skin) in severe cases',
    ],
    causes: [
      'Chest injury or trauma (rib fracture, stab wound)',
      'Lung diseases like COPD, cystic fibrosis, or asthma',
      'Ruptured air blisters (blebs) — often in tall, thin males',
      'Mechanical ventilation',
      'Spontaneous — can occur without any apparent cause',
    ],
    whenToSeeDoctor:
      'A pneumothorax can be life-threatening. Seek emergency medical care immediately if you experience sudden, sharp chest pain with shortness of breath.',
  },
  {
    id: 'no-finding',
    name: 'No Finding (Normal)',
    icon: <CheckCircle2 className="w-6 h-6" />,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    bgColor: 'bg-emerald-500/10',
    severity: 'Normal',
    severityColor: 'bg-emerald-500/20 text-emerald-400',
    shortDesc: 'No abnormalities detected — the chest X-ray appears normal.',
    description:
      'A "No Finding" result means the AI model did not detect any significant abnormalities in the chest X-ray. The lung fields appear clear, the heart size is within normal limits, and no pleural effusion or pneumothorax is observed. However, this is an AI-assisted screening tool and should not replace a radiologist\'s interpretation.',
    symptoms: [],
    causes: [],
    whenToSeeDoctor:
      'Even with a normal result, continue regular health checkups. If you have persistent symptoms like chronic cough, shortness of breath, or chest pain, consult your doctor regardless of the X-ray findings.',
  },
];

/* ── Expandable Disease Card ── */
const DiseaseCard: React.FC<{ disease: DiseaseInfo }> = ({ disease }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      id={`disease-${disease.id}`}
      className={`rounded-2xl border ${disease.borderColor} bg-slate-900/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/10`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl ${disease.bgColor} flex items-center justify-center ${disease.color}`}>
            {disease.icon}
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-lg font-semibold text-slate-100">{disease.name}</h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${disease.severityColor}`}>
                {disease.severity}
              </span>
            </div>
            <p className="text-sm text-slate-400">{disease.shortDesc}</p>
          </div>
        </div>
        <div className="ml-4 text-slate-500 shrink-0">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expandable Content */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          expanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 space-y-5 border-t border-slate-800/50 pt-5">
          <div>
            <p className="text-sm text-slate-300 leading-relaxed">{disease.description}</p>
          </div>

          {disease.symptoms.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-2">Common Symptoms</h4>
              <ul className="space-y-1.5">
                {disease.symptoms.map((s, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm text-slate-400">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${disease.bgColor} shrink-0`} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {disease.causes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-2">Common Causes</h4>
              <ul className="space-y-1.5">
                {disease.causes.map((c, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm text-slate-400">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${disease.bgColor} shrink-0`} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <h4 className="text-sm font-semibold text-blue-400 mb-1">When to See a Doctor</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{disease.whenToSeeDoctor}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
export const DiseasesPage: React.FC = () => {
  return (
    <div className="pt-24 lg:pt-32 pb-20">
      {/* Hero */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Medical Education</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
            Detectable{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Lung Conditions
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            PulmoAI can detect 5 pulmonary and cardiac conditions from chest X-rays.
            Learn about each condition, its symptoms, and when to seek medical attention.
          </p>
        </div>
      </section>

      {/* Disease Cards */}
      <section className="px-4 max-w-4xl mx-auto space-y-4">
        {diseases.map((disease) => (
          <DiseaseCard key={disease.id} disease={disease} />
        ))}
      </section>

      {/* Disclaimer */}
      <section className="px-4 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/15">
            <h3 className="text-sm font-semibold text-amber-400 mb-2">⚠️ Important Disclaimer</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              The information provided on this page is for educational purposes only and should not be used as a
              substitute for professional medical advice, diagnosis, or treatment. PulmoAI is an AI-assisted
              screening tool and its results should always be reviewed by a qualified healthcare professional.
              Always seek the advice of your physician with any questions you may have regarding a medical condition.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Want to Screen Your Chest X-Ray?
          </h2>
          <p className="text-slate-400 mb-8">
            Upload your X-ray and get AI-powered analysis in seconds.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/20"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
