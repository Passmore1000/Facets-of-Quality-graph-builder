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
    <div className="p-3 space-y-3">
      {snapshots.map((snapshot) => (
        <div
          key={snapshot.id}
          className="group rounded-xl border border-[#ece9e4] bg-[#fcfbf9] px-3.5 py-3.5 transition-colors hover:bg-[#faf9f7] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-start gap-2.5">
            {/* Mini chart */}
            <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-[#eeece8]">
              <FacetsChart
                facets={snapshot.facets}
                maxScore={snapshot.maxScore}
                themeId={snapshot.themeId}
                size={44}
                svgId={`snap-${snapshot.id}`}
                showLabels={false}
                animate={false}
                cornerRadius={1.5}
                segmentGapPx={4}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-[13px] font-bold text-[#1a1917] truncate leading-tight">
                {snapshot.label}
              </p>
              <p className="text-[9px] font-semibold text-[#b0aea8] tracking-[0.12em] mt-1 uppercase">
                {formatDate(snapshot.createdAt)}
              </p>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
                {snapshot.facets.map((f) => (
                  <span key={f.id} className="text-[10px] text-[#888580]">
                    {f.name} <span className="font-bold text-[#555350]">{f.score}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-2.5">
            <button
              onClick={() => onLoad(snapshot)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors hover:opacity-80"
              style={{ color: 'var(--theme-fill)' }}
            >
              Restore
            </button>
            <button
              onClick={() => onDelete(snapshot.id)}
              className="text-[11px] font-semibold text-[#b0aea8] hover:text-[#555350] px-2.5 py-1 rounded-md hover:bg-[#f0ede8] transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
