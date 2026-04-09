import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

const EarlyAccessBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem('ea_banner_dismissed') === '1'; } catch { return false; }
  });

  if (dismissed) return null;

  const dismiss = () => {
    try { localStorage.setItem('ea_banner_dismissed', '1'); } catch {}
    setDismissed(true);
  };

  return (
    <div className="w-full bg-violet-600 text-white text-sm py-2 px-4 flex items-center justify-center gap-3 relative">
      <Sparkles className="h-3.5 w-3.5 flex-shrink-0 opacity-80" />
      <span className="font-medium">
        Early Access —{' '}
        <a
          href="mailto:lyam@usesliding.com?subject=Sliding.io Feedback"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          share your feedback
        </a>
        {' '}and help shape the product.
      </span>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default EarlyAccessBanner;
