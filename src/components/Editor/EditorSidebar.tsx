import { COLOR_THEMES } from '../../utils/themes'
import { FacetRow } from './FacetRow'
import type { Facet } from '../../types'

interface Props {
  projectName: string
  facets: Facet[]
  themeId: string
  maxScore: number
  onNameChange: (name: string) => void
  onThemeChange: (id: string) => void
  onMaxScoreChange: (max: number) => void
  onAddFacet: () => void
  onRemoveFacet: (id: string) => void
  onUpdateFacet: (id: string, changes: Partial<Facet>) => void
  onSaveSnapshot: () => void
}

export function EditorSidebar({
  projectName,
  facets,
  themeId,
  maxScore,
  onNameChange,
  onThemeChange,
  onMaxScoreChange,
  onAddFacet,
  onRemoveFacet,
  onUpdateFacet,
  onSaveSnapshot,
}: Props) {
  return (
    <aside className="fixed top-5 left-5 bottom-5 z-20 w-64 flex flex-col bg-white rounded-2xl border border-[#e8e6e1] shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">

      {/* Project name */}
      <div className="px-5 pt-6 pb-5">
        <p className="text-[10px] font-semibold text-[#b0aea8] uppercase tracking-widest mb-2">
          Project
        </p>
        <input
          type="text"
          value={projectName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full text-base font-bold text-[#1a1917] bg-transparent border-none outline-none placeholder:text-[#d0cdc7] leading-snug"
          placeholder="Untitled project"
        />
      </div>

      <div className="mx-5 h-px bg-[#f0ede8]" />

      {/* Colour + scale */}
      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Colour swatches */}
        <div>
          <p className="text-[10px] font-semibold text-[#b0aea8] uppercase tracking-widest mb-3">
            Colour
          </p>
          <div className="flex gap-2.5">
            {COLOR_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                title={t.label}
                className="relative w-5 h-5 rounded-full transition-transform hover:scale-110 focus:outline-none flex-shrink-0"
                style={{ background: t.fill }}
              >
                {themeId === t.id && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: `0 0 0 2px white, 0 0 0 3.5px ${t.fill}` }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scale — segmented control */}
        <div>
          <p className="text-[10px] font-semibold text-[#b0aea8] uppercase tracking-widest mb-3">
            Scale
          </p>
          <div className="flex rounded-xl overflow-hidden border border-[#e8e6e1] bg-[#faf9f7] p-1 gap-1">
            {[5, 10].map((v) => (
              <button
                key={v}
                onClick={() => onMaxScoreChange(v)}
                className={`flex-1 text-[11px] py-1.5 rounded-lg font-semibold transition-colors ${
                  maxScore === v
                    ? 'bg-white text-[#1a1917] ring-1 ring-[#e0ddd8]'
                    : 'text-[#b0aea8] hover:text-[#555350]'
                }`}
              >
                1–{v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-[#f0ede8]" />

      {/* Facets */}
      <div className="flex-1 overflow-y-auto px-5">
        <div className="flex items-center justify-between pt-5 pb-2">
          <p className="text-[10px] font-semibold text-[#b0aea8] uppercase tracking-widest">
            Facets
          </p>
          <button
            onClick={onAddFacet}
            className="text-[11px] font-semibold transition-colors hover:opacity-70"
            style={{ color: 'var(--theme-fill)' }}
          >
            + Add
          </button>
        </div>

        {facets.length === 0 && (
          <p className="text-xs text-[#c8c5bf] py-5 text-center">
            No facets yet.
          </p>
        )}

        {facets.map((facet) => (
          <FacetRow
            key={facet.id}
            facet={facet}
            maxScore={maxScore}
            onUpdate={(changes) => onUpdateFacet(facet.id, changes)}
            onRemove={() => onRemoveFacet(facet.id)}
          />
        ))}
      </div>

      {/* Save */}
      <div className="px-5 py-5 border-t border-[#f0ede8]">
        <button
          onClick={onSaveSnapshot}
          className="w-full text-white text-xs font-bold rounded-xl py-3 tracking-wide transition-all hover:brightness-90 active:brightness-75"
          style={{ background: 'var(--theme-fill)' }}
        >
          Save snapshot
        </button>
      </div>
    </aside>
  )
}
