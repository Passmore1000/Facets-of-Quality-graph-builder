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
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function SnapshotsPanel({
  snapshots,
  onLoad,
  onDelete,
}: Props) {
  if (snapshots.length === 0) {
    return (
      <div className="px-5 py-8 text-center">
        <p className="text-sm text-gray-400">No snapshots yet.</p>
        <p className="text-xs text-gray-300 mt-1">Save your current state to track progress over time.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {snapshots.map((snapshot) => (
        <div key={snapshot.id} className="group px-4 py-3 hover:bg-gray-50 transition-colors">
          <div className="flex items-start gap-3">
            {/* Mini chart */}
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
              <FacetsChart
                facets={snapshot.facets}
                maxScore={snapshot.maxScore}
                themeId={snapshot.themeId}
                size={64}
                svgId={`snap-${snapshot.id}`}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{snapshot.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(snapshot.createdAt)}</p>
              <div className="flex flex-wrap gap-x-2 mt-1">
                {snapshot.facets.map((f) => (
                  <span key={f.id} className="text-xs text-gray-500">
                    {f.name}: <strong>{f.score}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onLoad(snapshot)}
                className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                title="Restore this snapshot"
              >
                Restore
              </button>
              <button
                onClick={() => onDelete(snapshot.id)}
                className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
                title="Delete snapshot"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
