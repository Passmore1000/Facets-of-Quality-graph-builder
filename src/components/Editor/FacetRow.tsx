import type { Facet } from '../../types'

interface Props {
  facet: Facet
  maxScore: number
  onUpdate: (changes: Partial<Facet>) => void
  onRemove: () => void
}

export function FacetRow({ facet, maxScore, onUpdate, onRemove }: Props) {
  return (
    <div className="group py-3.5 border-b border-[#f0ede8] last:border-0">
      <div className="flex items-center gap-2 mb-2.5">
        <input
          type="text"
          value={facet.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="flex-1 text-[13px] font-semibold text-[#1a1917] bg-transparent border-none outline-none focus:bg-[#faf9f7] rounded-lg px-1.5 -mx-1.5 py-0.5 transition-colors placeholder:text-[#c8c5bf]"
          placeholder="Facet name"
        />
        <span
          className="text-[11px] font-bold tabular-nums flex-shrink-0"
          style={{ color: 'var(--theme-fill, #3bb5f0)' }}
        >
          {facet.score}
        </span>
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center text-[#c8c5bf] hover:text-[#e8460a] transition-all text-sm leading-none flex-shrink-0"
          title="Remove"
        >
          ×
        </button>
      </div>
      <input
        type="range"
        min={0.5}
        max={maxScore}
        step={0.5}
        value={facet.score}
        onChange={(e) => onUpdate({ score: parseFloat(e.target.value) })}
        className="w-full cursor-pointer"
      />
    </div>
  )
}
