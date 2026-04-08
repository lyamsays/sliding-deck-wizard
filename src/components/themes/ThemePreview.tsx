import React from 'react';
import { themes } from './theme-data';

interface ThemePreviewProps {
  themeId: string;
}

// Real educator content per theme — shows what an actual slide looks like
const PREVIEWS: Record<string, { title: string; eyebrow?: string; bullets: string[] }> = {
  'nova':             { eyebrow: 'PSYC 101 · WEEK 7', title: 'The Forgetting Curve', bullets: ['50% forgotten within 1 hour of learning', '70% gone after 24 hours without review', 'Spaced repetition flattens this by 80%'] },
  'ivory-clean':      { eyebrow: 'LECTURE NOTES', title: 'Memory Consolidation', bullets: ['Hippocampus transfers short-term → long-term', 'Sleep deprivation cuts consolidation by 40%', 'REM sleep replays and strengthens memory traces'] },
  'obsidian-editorial': { eyebrow: 'RESEARCH FINDINGS', title: 'Testing Effect', bullets: ['Retrieval practice beats re-reading by 50%', 'Elaborative interrogation: ask why and how', 'Highlighting creates illusion of knowing'] },
  'aurora-edu':       { eyebrow: 'COGNITIVE SCIENCE', title: 'Why We Forget', bullets: ['Interference: new memories disrupt old ones', 'Motivated forgetting suppresses painful memories', 'Decay: traces fade without rehearsal'] },
  'sage-deep':        { eyebrow: 'STUDY STRATEGIES', title: 'Spaced Repetition', bullets: ['Review at 1 day, 3 days, 1 week, 1 month', 'Each retrieval strengthens the memory trace', 'Anki and Quizlet automate the schedule'] },
  'slate':            { eyebrow: 'EVIDENCE-BASED', title: 'Active Recall Works', bullets: ['Close notes → try to recall key concepts', 'Testing yourself beats passive re-reading', '50% better retention after just one week'] },
  'crimson-band':     { eyebrow: 'PRACTICAL APPLICATION', title: 'Your Study System', bullets: ['Practice retrieval daily, not just before exams', 'Teach concepts to others for 90% better recall', 'Sleep 7-9 hours — consolidation happens then'] },
  'pebble':           { eyebrow: 'OPENING THOUGHT', title: '"The mind is not a vessel to be filled..."', bullets: ['Learning is active construction, not passive receipt', 'Deep processing creates durable memories', 'Ask meaning, not just facts'] },
  // Fallbacks for original themes
  'aurora':           { eyebrow: 'LECTURE · WEEK 3', title: 'Neural Plasticity', bullets: ['Synaptic connections strengthen with use', 'Neurogenesis continues in adult hippocampus', 'Stress hormones impair memory formation'] },
  'pristine':         { eyebrow: 'RESEARCH OVERVIEW', title: 'Cognitive Load Theory', bullets: ['Working memory holds 7 ± 2 items at once', 'Intrinsic load from material complexity', 'Extraneous load from poor instructional design'] },
  'obsidian':         { eyebrow: 'ADVANCED TOPICS', title: 'Long-Term Potentiation', bullets: ['NMDA receptors gate synaptic strengthening', 'Calcium influx triggers structural changes', 'Protein synthesis required for lasting memory'] },
  'pearl':            { eyebrow: 'SEMINAR NOTES', title: 'Constructivist Learning', bullets: ['Prior knowledge shapes new understanding', 'Cognitive conflict drives conceptual change', 'Social interaction accelerates learning'] },
  'forest':           { eyebrow: 'ENVIRONMENTAL SCI', title: 'Carbon Sequestration', bullets: ['Forests absorb 2.6 Gt CO₂ per year globally', 'Ocean sequestration: 30% of emissions', 'Soil carbon underutilized as a solution'] },
  'crimson':          { eyebrow: 'Q3 REVIEW', title: 'Student Performance', bullets: ['Test scores improved 23% with active recall', 'Attendance correlates with grade at r = 0.71', 'Office hours usage up 40% this semester'] },
  'sage':             { eyebrow: 'BIOLOGY · WEEK 5', title: 'Cell Membrane Transport', bullets: ['Passive diffusion follows concentration gradient', 'Active transport requires ATP energy input', 'Osmosis: water moves to higher solute concentration'] },
  'midnight':         { eyebrow: 'PHILOSOPHY 201', title: 'The Hard Problem of Consciousness', bullets: ['Qualia: subjective experience has no physical correlate', 'Chalmers: explanatory gap between brain and mind', 'Functionalism cannot account for "what it is like"'] },
  'platinum':         { eyebrow: 'ECONOMICS 301', title: 'Market Failure Types', bullets: ['Externalities: costs not captured in price', 'Public goods: non-rival and non-excludable', 'Information asymmetry distorts market signals'] },
  'ivory':            { eyebrow: 'HISTORY 202', title: 'Industrial Revolution Causes', bullets: ['Agricultural surplus freed labor for factories', 'Coal and steam enabled scale production', 'Colonial trade provided raw material flows'] },
  'arctic':           { eyebrow: 'CLIMATE SCIENCE', title: 'Arctic Amplification', bullets: ['Warming 4x faster than global average', 'Ice-albedo feedback loop accelerates melt', 'Permafrost thaw releases stored methane'] },
  'cosmos':           { eyebrow: 'ASTROPHYSICS 401', title: 'Dark Matter Evidence', bullets: ['Galaxy rotation curves don\'t match visible mass', 'Gravitational lensing reveals invisible mass', 'Comprises ~27% of universe energy density'] },
  'lavender':         { eyebrow: 'PSYCHOLOGY 201', title: 'Attachment Theory', bullets: ['Bowlby: secure base enables exploration', 'Ainsworth\'s Strange Situation reveals styles', 'Early attachment predicts adult relationships'] },
  'copper':           { eyebrow: 'MATERIALS SCIENCE', title: 'Metal Alloy Properties', bullets: ['Brass: copper + zinc, corrosion resistant', 'Bronze: copper + tin, harder than pure copper', 'Alloying changes crystalline microstructure'] },
  'carbon':           { eyebrow: 'COMPUTER SCIENCE', title: 'Algorithm Complexity', bullets: ['O(n log n) is optimal for comparison sorts', 'Space-time tradeoff: cache vs recompute', 'Amortized analysis averages over sequences'] },
};

const ThemePreview = ({ themeId }: ThemePreviewProps) => {
  const theme = themes.find(t => t.id === themeId) || themes[0];
  const preview = PREVIEWS[themeId] || PREVIEWS['pristine'] || {
    title: theme.name,
    bullets: ['Evidence-based slide content', 'Clear structure for your audience', 'Professional academic design'],
  };

  const bg = theme.background;
  const textColor = theme.textColor;
  const accentColor = theme.accentColor;
  const backgroundStyle = bg.includes('gradient') || bg.includes('linear') || bg.includes('radial')
    ? { background: bg }
    : { backgroundColor: bg };

  return (
    <div className="overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02]" style={{ aspectRatio: '16/9', position: 'relative', ...backgroundStyle }}>
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accentColor }} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: '10% 8% 8% 6%' }}>
        {/* Eyebrow */}
        {preview.eyebrow && (
          <div style={{
            color: accentColor,
            fontSize: '5px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '5px',
            opacity: 0.85,
          }}>
            {preview.eyebrow}
          </div>
        )}

        {/* Title */}
        <div style={{
          color: textColor,
          fontSize: '9px',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: '6px',
          fontFamily: theme.titleFont,
        }}>
          {preview.title}
        </div>

        {/* Thin separator */}
        <div style={{ width: '28px', height: '1px', backgroundColor: accentColor, marginBottom: '6px', opacity: 0.6 }} />

        {/* Bullets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {preview.bullets.map((b, i) => {
            const colonIdx = b.indexOf(':');
            const hasColon = colonIdx > 0 && colonIdx < 30;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '3px' }}>
                <span style={{ color: accentColor, fontSize: '5px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>▸</span>
                <span style={{ color: textColor, fontSize: '5.5px', lineHeight: 1.4, opacity: 0.9 }}>
                  {hasColon ? (
                    <>
                      <strong style={{ color: accentColor }}>{b.substring(0, colonIdx)}</strong>
                      {b.substring(colonIdx)}
                    </>
                  ) : b}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme name label at bottom */}
      <div className="absolute bottom-0 left-0 right-0 text-center py-1" style={{
        backgroundColor: 'rgba(0,0,0,0.35)',
        color: '#ffffff',
        fontSize: '5.5px',
        fontWeight: 600,
        letterSpacing: '0.05em',
      }}>
        {theme.name.toUpperCase()}
      </div>
    </div>
  );
};

export default ThemePreview;
