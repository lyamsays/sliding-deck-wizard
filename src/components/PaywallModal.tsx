import React from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, Check } from 'lucide-react';

interface PaywallModalProps {
  reason: 'deck_limit' | 'doc_upload' | 'slide_limit';
  onClose: () => void;
}

const MESSAGES = {
  deck_limit: {
    title: "You've reached the free limit",
    desc: "Free accounts can create 3 presentations per month. Upgrade to Educator Pro for unlimited.",
    highlight: "Unlimited presentations",
  },
  doc_upload: {
    title: "Document upload is a Pro feature",
    desc: "Upload PDFs and Word docs up to 20MB on Educator Pro. Free accounts can paste text directly.",
    highlight: "Upload PDF, Word, 20MB",
  },
  slide_limit: {
    title: "More slides on Educator Pro",
    desc: "Free accounts are limited to 8 slides. Upgrade to create decks up to 15 slides.",
    highlight: "Up to 15 slides per deck",
  },
};

const PRO_FEATURES = [
  'Unlimited presentations per month',
  'Up to 15 slides per deck',
  'Document upload (PDF, Word — 20MB)',
  'PowerPoint export with speaker notes',
  'Shareable deck links',
];

const PaywallModal: React.FC<PaywallModalProps> = ({ reason, onClose }) => {
  const msg = MESSAGES[reason];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-purple-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">{msg.title}</h2>
          <p className="text-purple-200 text-sm mt-1">{msg.desc}</p>
        </div>

        {/* Features */}
        <div className="p-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Educator Pro — $15/month
          </div>
          <ul className="space-y-2.5 mb-6">
            {PRO_FEATURES.map(f => (
              <li key={f} className={`flex items-center gap-2.5 text-sm ${f.includes(msg.highlight.split(' ')[0]) ? 'font-semibold text-purple-700' : 'text-gray-600'}`}>
                <Check className={`h-4 w-4 flex-shrink-0 ${f.includes(msg.highlight.split(' ')[0]) ? 'text-purple-600' : 'text-gray-400'}`} />
                {f}
              </li>
            ))}
          </ul>

          <Link
            to="/pricing"
            className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            onClick={onClose}
          >
            Upgrade to Educator Pro →
          </Link>

          <button onClick={onClose} className="block w-full text-center text-gray-400 text-xs mt-3 hover:text-gray-600">
            Continue with free plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
