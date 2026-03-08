import { AlertCircle, ChevronRight, Lightbulb, Loader2, Lock } from 'lucide-react';
import { useState } from 'react';
import { getHint, type HintResult, type HintTier } from '../../services/aiService';
import './HintPanel.scss';

interface HintPanelProps {
  problemTitle: string;
  problemDescription: string;
  constraints: string[];
  userCode: string;
}

const TIERS: Array<{ tier: HintTier; label: string; description: string }> = [
  { tier: 1, label: 'Nudge', description: 'A gentle push in the right direction' },
  { tier: 2, label: 'Concept', description: 'The key technique or pattern' },
  { tier: 3, label: 'Pseudocode', description: 'Step-by-step approach' },
  { tier: 4, label: 'Solution', description: 'Full working solution' },
];

export default function HintPanel({
  problemTitle,
  problemDescription,
  constraints,
  userCode,
}: HintPanelProps) {
  const [hints, setHints] = useState<Map<HintTier, HintResult>>(new Map());
  const [loading, setLoading] = useState<HintTier | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedTier, setExpandedTier] = useState<HintTier | null>(null);

  // Highest tier unlocked so far
  const maxUnlocked = Math.max(0, ...Array.from(hints.keys())) as HintTier | 0;

  const requestHint = async (tier: HintTier) => {
    // Already have it — just toggle expand
    if (hints.has(tier)) {
      setExpandedTier(expandedTier === tier ? null : tier);
      return;
    }

    setLoading(tier);
    setError(null);

    try {
      const result = await getHint(
        problemTitle,
        problemDescription,
        constraints,
        userCode,
        tier,
      );
      setHints((prev) => new Map(prev).set(tier, result));
      setExpandedTier(tier);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get hint');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="hint-panel">
      <div className="hint-panel__header">
        <Lightbulb size={14} />
        <span>I'm Stuck — Get a Hint</span>
      </div>

      <div className="hint-panel__tiers">
        {TIERS.map(({ tier, label, description }) => {
          const isUnlocked = tier === 1 || tier <= maxUnlocked + 1;
          const hasHint = hints.has(tier);
          const isExpanded = expandedTier === tier;
          const isLoading = loading === tier;
          // T4 (solution) unlocks only after T1, T2, and T3 are all revealed
          const isSolutionLocked = tier === 4 && !(hints.has(1) && hints.has(2) && hints.has(3));

          return (
            <div
              key={tier}
              className={[
                'hint-panel__tier',
                hasHint ? 'hint-panel__tier--has-hint' : '',
                isExpanded ? 'hint-panel__tier--expanded' : '',
              ].filter(Boolean).join(' ')}
            >
              <button
                className="hint-panel__tier-btn"
                onClick={() => void requestHint(tier)}
                disabled={!isUnlocked || isLoading || isSolutionLocked}
                title={
                  isSolutionLocked
                    ? 'Reveal all previous tiers to unlock the solution'
                    : !isUnlocked
                      ? `Unlock Tier ${tier - 1} first`
                      : description
                }
              >
                <div className="hint-panel__tier-left">
                  <span className="hint-panel__tier-num">T{tier}</span>
                  <span className="hint-panel__tier-label">{label}</span>
                </div>

                <div className="hint-panel__tier-right">
                  {isLoading ? (
                    <Loader2 size={13} className="hint-panel__spin" />
                  ) : isSolutionLocked ? (
                    <Lock size={12} />
                  ) : !isUnlocked ? (
                    <Lock size={12} />
                  ) : hasHint ? (
                    <ChevronRight
                      size={13}
                      className={`hint-panel__chevron ${isExpanded ? 'hint-panel__chevron--open' : ''}`}
                    />
                  ) : (
                    <span className="hint-panel__tier-action">Reveal</span>
                  )}
                </div>
              </button>

              {hasHint && isExpanded && (
                <div className="hint-panel__tier-content">
                  {hints.get(tier)!.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="hint-panel__error">
          <AlertCircle size={13} />
          {error}
        </div>
      )}
    </div>
  );
}
