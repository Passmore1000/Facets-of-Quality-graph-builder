import { useState } from 'react'
import { useProject } from './hooks/useProject'
import { FacetsChart } from './components/Chart/FacetsChart'
import { EditorSidebar } from './components/Editor/EditorSidebar'
import { SnapshotsPanel } from './components/History/SnapshotsPanel'
import { ExportButtons } from './components/Export/ExportButtons'
import { getTheme } from './utils/themes'

const CHART_SVG_ID = 'facets-chart-main'

export default function App() {
  const {
    project,
    setName,
    setTheme,
    setMaxScore,
    addFacet,
    removeFacet,
    updateFacet,
    saveSnapshot,
    deleteSnapshot,
    loadSnapshot,
  } = useProject()

  const [historyOpen, setHistoryOpen] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [snapshotLabel, setSnapshotLabel] = useState('')

  const theme = getTheme(project.themeId)

  function handleSaveSnapshot() {
    const label = snapshotLabel.trim() || `Snapshot ${new Date().toLocaleDateString()}`
    saveSnapshot(label)
    setSnapshotLabel('')
    setSaveModalOpen(false)
  }

  const safeFilename = project.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'facets'

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ '--theme-fill': theme.fill } as React.CSSProperties}
    >
      {/* Left: Editor */}
      <EditorSidebar
        projectName={project.name}
        facets={project.facets}
        themeId={project.themeId}
        maxScore={project.maxScore}
        onNameChange={setName}
        onThemeChange={setTheme}
        onMaxScoreChange={setMaxScore}
        onAddFacet={addFacet}
        onRemoveFacet={removeFacet}
        onUpdateFacet={updateFacet}
        onSaveSnapshot={() => setSaveModalOpen(true)}
      />

      {/* Centre: Chart canvas */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f0f2f5]">
        {/* Toolbar */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100">
          <h1 className="text-sm font-semibold text-gray-700">{project.name}</h1>
          <div className="flex items-center gap-3">
            <ExportButtons svgId={CHART_SVG_ID} filename={safeFilename} />
            <button
              onClick={() => setHistoryOpen((o) => !o)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                historyOpen
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              History {project.snapshots.length > 0 && `(${project.snapshots.length})`}
            </button>
          </div>
        </header>

        {/* Chart */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          {project.facets.length === 0 ? (
            <div className="text-center text-gray-400">
              <p className="text-lg font-medium">No facets yet</p>
              <p className="text-sm mt-1">Add facets in the sidebar to get started.</p>
            </div>
          ) : (
            <FacetsChart
              svgId={CHART_SVG_ID}
              facets={project.facets}
              maxScore={project.maxScore}
              themeId={project.themeId}
              size={420}
            />
          )}
        </div>
      </main>

      {/* Right: History panel */}
      {historyOpen && (
        <aside className="w-80 bg-white border-l border-gray-100 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Snapshots</h2>
            <button
              onClick={() => setHistoryOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SnapshotsPanel
              snapshots={project.snapshots}
              currentFacets={project.facets}
              currentThemeId={project.themeId}
              currentMaxScore={project.maxScore}
              onLoad={(snap) => {
                loadSnapshot(snap)
                setHistoryOpen(false)
              }}
              onDelete={deleteSnapshot}
            />
          </div>
        </aside>
      )}

      {/* Save snapshot modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Save snapshot</h2>
            <p className="text-sm text-gray-500 mb-4">
              Give this snapshot a name so you can find it later.
            </p>
            <input
              type="text"
              autoFocus
              value={snapshotLabel}
              onChange={(e) => setSnapshotLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveSnapshot()}
              placeholder={`e.g. v1 Launch · ${new Date().toLocaleDateString()}`}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSnapshot}
                className="text-sm font-medium bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
