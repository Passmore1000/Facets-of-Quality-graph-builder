import { FacetsChart } from '../Chart/FacetsChart'
import type { Snapshot } from '../../types'

interface Props {
  snapshots: Snapshot[]
  currentFacets: Snapshot['facets']
  currentThemeId: string
  currentMaxScore: number
  onLoad: (snapshot: Snapshot) => void
  onDelete: (id: string) => void
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
}

export function SnapshotsPanel({ snapshots, onLoad, onDelete }: Props) {
  if (snapshots.length === 0) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="text-xs font-semibold text-[#c8c5bf] uppercase tracking-widest">No snapshots yet</p>
        <p className="text-xs text-[#c8c5bf] mt-2 leading-relaxed">
          Save your current state to track progress over time.
        </p>
      </div>
    )
  }

  return (
    <div>
      {snapshots.map((snapshot) => (
        <div
          key={snapshot.id}
          className="group px-5 py-4 hover:bg-[#faf9f7] transition-colors border-b border-[#f0ede8] last:border-0"
        >
          <div className="flex items-start gap-3">
            {/* Mini chart */}
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
              <FacetsChart
                facets={snapshot.facets}
                maxScore={snapshot.maxScore}
                themeId={snapshot.themeId}
                size={56}
                svgId={`snap-${snapshot.id}`}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-[13px] font-bold text-[#1a1917] truncate leading-tight">
                {snapshot.label}
              </p>
              <p className="text-[10px] font-semibold text-[#b0aea8] tracking-widest mt-1">
                {formatDate(snapshot.createdAt)}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
                {snapshot.facets.map((f) => (
                  <span key={f.id} className="text-[11px] text-[#888580]">
                    {f.name} <span className="font-bold text-[#555350]">{f.score}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions — appear on hover */}
          <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onLoad(snapshot)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'var(--theme-fill)' }}
            >
              Restore
            </button>
            <button
              onClick={() => onDelete(snapshot.id)}
              className="text-[11px] font-semibold text-[#b0aea8] hover:text-[#555350] px-3 py-1.5 rounded-lg hover:bg-[#f0ede8] transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
