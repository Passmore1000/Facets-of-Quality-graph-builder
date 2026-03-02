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
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-full overflow-hidden">
      {/* Project name */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
          Project
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full text-base font-semibold bg-transparent border-none outline-none focus:bg-gray-50 rounded px-1 -mx-1 py-0.5"
          placeholder="Project name"
        />
      </div>

      {/* Settings */}
      <div className="px-5 py-4 border-b border-gray-100 flex gap-4">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
            Scale max
          </label>
          <select
            value={maxScore}
            onChange={(e) => onMaxScoreChange(Number(e.target.value))}
            className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white outline-none focus:border-gray-400"
          >
            {[5, 10].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
            Color
          </label>
          <select
            value={themeId}
            onChange={(e) => onThemeChange(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white outline-none focus:border-gray-400"
          >
            {COLOR_THEMES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Color swatches */}
      <div className="px-5 py-3 border-b border-gray-100 flex gap-2">
        {COLOR_THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => onThemeChange(t.id)}
            className={`w-6 h-6 rounded-full transition-transform ${
              themeId === t.id ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'
            }`}
            style={{ background: t.fill }}
            title={t.label}
          />
        ))}
      </div>

      {/* Facets list */}
      <div className="flex-1 overflow-y-auto px-5">
        <div className="flex items-center justify-between pt-4 pb-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Facets
          </label>
          <button
            onClick={onAddFacet}
            className="text-xs text-blue-500 hover:text-blue-700 font-medium"
          >
            + Add
          </button>
        </div>

        {facets.map((facet) => (
          <FacetRow
            key={facet.id}
            facet={facet}
            maxScore={maxScore}
            onUpdate={(changes) => onUpdateFacet(facet.id, changes)}
            onRemove={() => onRemoveFacet(facet.id)}
          />
        ))}

        {facets.length === 0 && (
          <p className="text-sm text-gray-400 py-4 text-center">
            No facets yet. Add one to get started.
          </p>
        )}
      </div>

      {/* Save snapshot */}
      <div className="px-5 py-4 border-t border-gray-100">
        <button
          onClick={onSaveSnapshot}
          className="w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          Save snapshot
        </button>
      </div>
    </aside>
  )
}
