import type { CSSProperties } from 'react'
import type { Facet } from '../../types'

interface Props {
  facet: Facet
  maxScore: number
  onUpdate: (changes: Partial<Facet>) => void
  onRemove: () => void
}

export function FacetRow({ facet, maxScore, onUpdate, onRemove }: Props) {
  const minScore = 0.5
  const scorePercent = ((facet.score - minScore) / (maxScore - minScore)) * 100
  const scoreLabel = Number.isInteger(facet.score) ? String(facet.score) : facet.score.toFixed(1)

  return (
    <div className="py-4 border-b border-[#f0ede8] last:border-0">
      <div className="w-full flex items-center gap-2 mb-3">
        <input
          type="text"
          value={facet.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          aria-label="Facet name"
          className="min-w-0 flex-1 text-[13px] font-semibold text-[#1a1917] bg-transparent border-none outline-none focus:bg-[#faf9f7] rounded-lg px-1.5 -mx-1.5 py-0.5 transition-colors placeholder:text-[#c8c5bf]"
          placeholder="Facet name"
        />
        <div className="w-[84px] shrink-0 flex items-center justify-end gap-1.5">
          <span className="h-8 min-w-9 inline-flex items-center justify-center px-1 text-center text-[11px] font-bold tabular-nums text-[#1a1917] bg-[#f4f4f4] border border-[#ececec] rounded-md">
            {scoreLabel}
          </span>
          <button
            onClick={onRemove}
            aria-label={`Remove ${facet.name || 'facet'}`}
            className="h-8 w-8 rounded-md inline-flex items-center justify-center text-[#d56a45] bg-[#fff5f1] border border-[#f6d5c9] hover:bg-[#fee9e1] hover:border-[#efb8a4] transition-colors shrink-0"
            title="Remove"
          >
            <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <input
        type="range"
        min={minScore}
        max={maxScore}
        step={0.5}
        value={facet.score}
        onChange={(e) => onUpdate({ score: parseFloat(e.target.value) })}
        aria-label={`${facet.name || 'Facet'} score`}
        className="facet-slider w-full cursor-pointer"
        style={{ '--slider-percent': `${Math.min(Math.max(scorePercent, 0), 100)}%` } as CSSProperties}
      />
    </div>
  )
}
