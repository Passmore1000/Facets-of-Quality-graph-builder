import { useState } from 'react'
import { useProject } from './hooks/useProject'
import { FacetsChart } from './components/Chart/FacetsChart'
import { EditorSidebar } from './components/Editor/EditorSidebar'
import { SnapshotsPanel } from './components/History/SnapshotsPanel'
import { exportPNG, exportSVG } from './utils/export'
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
  const safeFilename = project.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'facets'

  function handleSaveSnapshot() {
    const label = snapshotLabel.trim() || `Snapshot ${new Date().toLocaleDateString()}`
    saveSnapshot(label)
    setSnapshotLabel('')
    setSaveModalOpen(false)
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background: '#f3f1ec',
        '--theme-fill': theme.fill,
        '--theme-track': theme.track,
      } as React.CSSProperties}
    >
      {/* Full-viewport chart canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        {project.facets.length === 0 ? (
          <p className="text-sm text-[#aaa9a4]">Add facets in the panel to get started.</p>
        ) : (
          <FacetsChart
            svgId={CHART_SVG_ID}
            facets={project.facets}
            maxScore={project.maxScore}
            themeId={project.themeId}
            size={460}
          />
        )}
      </div>

      {/* Floating editor panel — left */}
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

      {/* Floating toolbar — top right */}
      <div className="fixed top-5 right-5 z-20 flex items-center gap-1 bg-white rounded-2xl border border-[#e8e6e1] shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-2 py-1.5">
        <span className="text-[11px] font-medium text-[#b0aea8] px-2 border-r border-[#e8e6e1] mr-1">
          {project.name}
        </span>
        <button
          onClick={() => exportSVG(CHART_SVG_ID, safeFilename)}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#888580] hover:text-[#1a1917] px-2.5 py-1.5 rounded-xl hover:bg-[#f3f1ec] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5.5 7.5L8 10.2L10.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          SVG
        </button>
        <button
          onClick={() => exportPNG(CHART_SVG_ID, safeFilename)}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#888580] hover:text-[#1a1917] px-2.5 py-1.5 rounded-xl hover:bg-[#f3f1ec] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5.5 7.5L8 10.2L10.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          PNG
        </button>
        <div className="w-px h-4 bg-[#e8e6e1] mx-1" />
        <button
          onClick={() => setHistoryOpen((o) => !o)}
          className={`text-[11px] font-medium px-2.5 py-1.5 rounded-xl transition-colors ${
            historyOpen
              ? 'bg-[#1a1917] text-white'
              : 'text-[#888580] hover:text-[#1a1917] hover:bg-[#f3f1ec]'
          }`}
        >
          History{project.snapshots.length > 0 ? ` · ${project.snapshots.length}` : ''}
        </button>
      </div>

      {/* Floating history panel — right */}
      {historyOpen && (
        <div
          className="fixed z-20 flex flex-col bg-white rounded-2xl border border-[#e8e6e1] shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden"
          style={{ top: '72px', right: '20px', bottom: '20px', width: '300px' }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0ede8]">
            <h2 className="text-xs font-semibold text-[#1a1917] uppercase tracking-widest">Snapshots</h2>
            <button
              onClick={() => setHistoryOpen(false)}
              className="w-6 h-6 flex items-center justify-center text-[#b0aea8] hover:text-[#1a1917] hover:bg-[#f3f1ec] rounded-lg transition-colors text-base leading-none"
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
              onLoad={(snap) => { loadSnapshot(snap); setHistoryOpen(false) }}
              onDelete={deleteSnapshot}
            />
          </div>
        </div>
      )}

      {/* Save snapshot modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl border border-[#e8e6e1] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-6 w-80">
            <h2 className="text-base font-bold text-[#1a1917] mb-1">Save snapshot</h2>
            <p className="text-xs text-[#888580] mb-5 leading-relaxed">
              Name this state so you can track your progress over time.
            </p>
            <input
              type="text"
              autoFocus
              value={snapshotLabel}
              onChange={(e) => setSnapshotLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveSnapshot()}
              placeholder="e.g. v1.0 launch"
              className="w-full border border-[#e8e6e1] rounded-xl px-3.5 py-2.5 text-sm text-[#1a1917] outline-none focus:border-[#b0aea8] mb-4 bg-[#faf9f7] placeholder:text-[#c8c5bf]"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="text-sm text-[#888580] hover:text-[#1a1917] px-4 py-2 rounded-xl hover:bg-[#f3f1ec] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSnapshot}
                className="text-sm font-semibold bg-[#e8460a] hover:bg-[#d03d08] text-white px-5 py-2 rounded-xl transition-colors"
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
