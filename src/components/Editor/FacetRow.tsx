import type { Facet } from '../../types'

interface Props {
  facet: Facet
  maxScore: number
  onUpdate: (changes: Partial<Facet>) => void
  onRemove: () => void
}

export function FacetRow({ facet, maxScore, onUpdate, onRemove }: Props) {
  return (
    <div className="group flex flex-col gap-1.5 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={facet.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="flex-1 text-sm font-medium bg-transparent border-none outline-none focus:bg-gray-50 rounded px-1 -mx-1 py-0.5"
          placeholder="Facet name"
        />
        <span className="text-xs font-semibold text-gray-500 w-6 text-right">
          {facet.score}
        </span>
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-sm leading-none"
          title="Remove facet"
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
        className="w-full accent-current"
        style={{ accentColor: 'var(--theme-fill, #3bb5f0)' }}
      />
    </div>
  )
}
