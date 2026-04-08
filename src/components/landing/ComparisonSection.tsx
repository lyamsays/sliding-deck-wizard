import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Minus, X } from 'lucide-react';

const rows = [
  { feature: 'Upload lecture notes / PDFs',      sliding: true,   gamma: false,  powerpoint: false },
  { feature: 'Educator-specific audiences',       sliding: true,   gamma: false,  powerpoint: false },
  { feature: 'Pedagogical speaker notes',         sliding: true,   gamma: false,  powerpoint: false },
  { feature: 'Live theme switching',              sliding: true,   gamma: true,   powerpoint: false },
  { feature: 'Drag to reorder slides',            sliding: true,   gamma: true,   powerpoint: true  },
  { feature: 'Fullscreen present mode',           sliding: true,   gamma: true,   powerpoint: true  },
  { feature: 'Export editable .pptx',             sliding: true,   gamma: 'paid', powerpoint: true  },
  { feature: 'Free to start',                     sliding: true,   gamma: true,   powerpoint: false },
  { feature: 'AI content generation',             sliding: true,   gamma: true,   powerpoint: false },
  { feature: 'Professor / educator focus',        sliding: true,   gamma: false,  powerpoint: false },
];

const Cell = ({ val }: { val: boolean | string }) => {
  if (val === true)    return <div className="flex justify-center"><Check className="h-4 w-4 text-purple-600" /></div>;
  if (val === false)   return <div className="flex justify-center"><X className="h-4 w-4 text-gray-300" /></div>;
  return <div className="flex justify-center"><span className="text-xs text-amber-600 font-medium">{val}</span></div>;
};

const ComparisonSection = () => (
  <section className="py-24 bg-gray-50">
    <div className="max-w-3xl mx-auto px-4">
      <div className="text-center mb-12">
        <div className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-3">Why Sliding.io</div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for professors, not everyone</h2>
        <p className="text-lg text-gray-500">Gamma is great. PowerPoint is powerful. Neither was built for how professors actually work.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-100">
          <div className="p-4 text-sm font-medium text-gray-500">Feature</div>
          <div className="p-4 text-center">
            <div className="text-sm font-bold text-purple-700 bg-purple-50 rounded-lg px-2 py-1">Sliding.io</div>
          </div>
          <div className="p-4 text-center"><div className="text-sm font-medium text-gray-500">Gamma</div></div>
          <div className="p-4 text-center"><div className="text-sm font-medium text-gray-500">PowerPoint</div></div>
        </div>
        {rows.map((row, i) => (
          <div key={row.feature} className={`grid grid-cols-4 border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
            <div className="p-3.5 text-sm text-gray-700">{row.feature}</div>
            <Cell val={row.sliding} />
            <Cell val={row.gamma} />
            <Cell val={row.powerpoint} />
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/create" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-purple-200">
          Start free — no credit card needed →
        </Link>
      </div>
    </div>
  </section>
);

export default ComparisonSection;
