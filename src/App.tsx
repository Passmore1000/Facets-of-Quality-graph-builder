import { useEffect, useRef, useState } from 'react'
import { useProject } from './hooks/useProject'
import { FacetsChart } from './components/Chart/FacetsChart'
import { EditorSidebar } from './components/Editor/EditorSidebar'
import { SnapshotsPanel } from './components/History/SnapshotsPanel'
import { exportPNG, exportSVG } from './utils/export'
import { getTheme } from './utils/themes'

const CHART_SVG_ID = 'facets-chart-main'
const INTERFACE_CRAFT_URL = 'https://www.interfacecraft.com/'
const INSPIRATION_CARD_ID = 'inspiration-card-panel'

function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '')
  const isShortHex = normalized.length === 3
  const isLongHex = normalized.length === 6

  if (!isShortHex && !isLongHex) return null

  const value = isShortHex
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized

  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)

  return { r, g, b }
}

function getCardTextColor(hex: string): string {
  const rgb = parseHexColor(hex)
  if (!rgb) return '#f8f7f4'

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.68 ? '#1a1917' : '#f8f7f4'
}

function toRgba(hex: string, alpha: number): string {
  const rgb = parseHexColor(hex)
  if (!rgb) return `rgba(255, 255, 255, ${alpha})`

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

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
  const [isInspirationCardOpen, setIsInspirationCardOpen] = useState(false)
  const inspirationTriggerRef = useRef<HTMLButtonElement | null>(null)
  const inspirationCloseRef = useRef<HTMLButtonElement | null>(null)
  const previousCardOpenRef = useRef(false)

  const theme = getTheme(project.themeId)
  const inspirationCardTextColor = getCardTextColor(theme.fill)
  const inspirationCardPatternColor = toRgba(inspirationCardTextColor, 0.36)
  const cardTransitionDuration = isInspirationCardOpen ? '450ms' : '820ms'
  const cardTransitionEasing = isInspirationCardOpen
    ? 'cubic-bezier(0.22, 1, 0.36, 1)'
    : 'cubic-bezier(0.18, 0.8, 0.2, 1)'
  const revealTransitionDuration = isInspirationCardOpen ? '950ms' : '720ms'
  const revealTransitionEasing = isInspirationCardOpen
    ? 'cubic-bezier(0.19, 1, 0.22, 1)'
    : 'cubic-bezier(0.2, 0.75, 0.25, 1)'
  const safeFilename = project.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'facets'

  function handleSaveSnapshot() {
    const label = snapshotLabel.trim() || `Snapshot ${new Date().toLocaleDateString()}`
    saveSnapshot(label)
    setSnapshotLabel('')
    setSaveModalOpen(false)
  }

  function handleOpenInspirationCard() {
    setIsInspirationCardOpen(true)
  }

  function handleCloseInspirationCard() {
    setIsInspirationCardOpen(false)
  }

  useEffect(() => {
    if (!isInspirationCardOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsInspirationCardOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isInspirationCardOpen])

  useEffect(() => {
    if (isInspirationCardOpen && !previousCardOpenRef.current) {
      inspirationCloseRef.current?.focus()
    }

    if (!isInspirationCardOpen && previousCardOpenRef.current) {
      inspirationTriggerRef.current?.focus()
    }

    previousCardOpenRef.current = isInspirationCardOpen
  }, [isInspirationCardOpen])

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
            size={530}
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
                className="text-sm font-semibold text-white px-5 py-2 rounded-xl transition-all hover:brightness-95 active:brightness-90"
                style={{ background: theme.fill }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interface Craft inspiration easter egg */}
      {isInspirationCardOpen && (
        <button
          type="button"
          onClick={handleCloseInspirationCard}
          aria-label="Close inspiration card"
          className="fixed inset-0 z-30"
        />
      )}

      <div
        id={INSPIRATION_CARD_ID}
        aria-label="Inspiration card for this project"
        className={`fixed z-40 overflow-hidden border border-black/10 text-left transition-all duration-450 ease-out ${
          isInspirationCardOpen
            ? 'right-1/2 bottom-1/2 w-[min(88vw,380px)] translate-x-1/2 translate-y-1/2 rotate-0 rounded-[30px] p-5 shadow-[0_22px_48px_rgba(0,0,0,0.22)]'
            : 'right-9 bottom-7 h-64 w-48 -rotate-6 rounded-[24px] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:-translate-y-1 hover:-rotate-3 hover:shadow-[0_16px_32px_rgba(0,0,0,0.2)]'
        }`}
        style={{
          background: theme.fill,
          color: inspirationCardTextColor,
          transitionDuration: cardTransitionDuration,
          transitionTimingFunction: cardTransitionEasing,
        }}
      >
        {!isInspirationCardOpen && (
          <button
            ref={inspirationTriggerRef}
            type="button"
            onClick={handleOpenInspirationCard}
            aria-expanded={isInspirationCardOpen}
            aria-controls={INSPIRATION_CARD_ID}
            aria-haspopup="dialog"
            aria-label="Open inspiration card about Josh Puckett and Interface Craft"
            className="absolute inset-0 z-20 h-full w-full rounded-[24px]"
          >
            <span className="sr-only">Open inspiration card</span>
          </button>
        )}

        <div className={`relative flex flex-col ${isInspirationCardOpen ? 'pb-1' : 'h-full'}`}>
          <div
            aria-hidden="true"
            className="h-24 w-full rounded-xl"
            style={{
              backgroundImage: `repeating-linear-gradient(93deg, ${inspirationCardPatternColor} 0px, ${inspirationCardPatternColor} 1px, transparent 1px, transparent 6px)`,
            }}
          />

          <div className={`space-y-2 ${isInspirationCardOpen ? 'mt-4' : 'mt-3'}`}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-85">Inspired by</p>
            <p className="text-[32px] font-serif leading-[0.95]">
              Josh
              <br />
              Puckett
            </p>
            <p className="text-[15px] font-serif leading-tight opacity-90">
              Interface Craft
            </p>
          </div>

          <div
            className={`origin-top overflow-hidden transition-[max-height,margin] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
              isInspirationCardOpen
                ? 'mt-4 max-h-64 delay-500'
                : 'max-h-0 delay-0'
            }`}
            style={{
              transitionDuration: isInspirationCardOpen ? '700ms' : '620ms',
              transitionTimingFunction: isInspirationCardOpen
                ? 'cubic-bezier(0.19, 1, 0.22, 1)'
                : 'cubic-bezier(0.2, 0.75, 0.25, 1)',
            }}
          >
            <div
              className={`transition-[opacity,filter,transform] duration-950 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                isInspirationCardOpen
                  ? 'translate-y-0 opacity-100 blur-0 delay-700'
                  : '-translate-y-0.5 opacity-0 blur-[6px] delay-0'
              }`}
              style={{
                transitionDuration: revealTransitionDuration,
                transitionTimingFunction: revealTransitionEasing,
              }}
            >
              <p className="text-sm leading-relaxed opacity-92">
                I built this as a practical way to apply the Facets of Quality idea: turning qualitative design
                intent into a shared, evolving snapshot the team can critique and improve over time.
              </p>
              <p className="mt-3 text-sm leading-relaxed opacity-92">
                This project is a respectful nod to Interface Craft, and the thoughtful framework behind it.
              </p>

              <div
                className={`mt-5 flex items-center justify-between gap-3 border-t border-black/10 pt-3 transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  isInspirationCardOpen ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                }`}
                style={{ transitionDelay: isInspirationCardOpen ? '1260ms' : '0ms' }}
              >
                <button
                  ref={inspirationCloseRef}
                  type="button"
                  onClick={handleCloseInspirationCard}
                  className="inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-[11px] font-medium opacity-75 transition-opacity hover:opacity-100"
                  aria-label="Close inspiration card"
                >
                  Back
                </button>
                <a
                  href={INTERFACE_CRAFT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-black/5 px-3 py-1.5 text-[11px] font-medium opacity-80 transition-[opacity,background-color,border-color] hover:border-black/15 hover:bg-black/7 hover:opacity-100"
                >
                  Visit Interface Craft
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
