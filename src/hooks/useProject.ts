import { useState, useCallback } from 'react'
import type { Project, Facet, Snapshot } from '../types'

const STORAGE_KEY = 'facets-of-quality-project'

function defaultProject(): Project {
  return {
    id: crypto.randomUUID(),
    name: 'My Project',
    themeId: 'ocean',
    maxScore: 5,
    facets: [
      { id: crypto.randomUUID(), name: 'Crafted', score: 3 },
      { id: crypto.randomUUID(), name: 'Fidgetable', score: 3.5 },
      { id: crypto.randomUUID(), name: 'Authentic', score: 4.5 },
      { id: crypto.randomUUID(), name: 'Expansive', score: 1.5 },
      { id: crypto.randomUUID(), name: 'Inventive', score: 3.5 },
    ],
    snapshots: [],
  }
}

function load(): Project {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Project
  } catch {}
  return defaultProject()
}

function save(project: Project) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
}

export function useProject() {
  const [project, setProject] = useState<Project>(load)

  const update = useCallback((updater: (p: Project) => Project) => {
    setProject((prev) => {
      const next = updater(prev)
      save(next)
      return next
    })
  }, [])

  const setName = (name: string) => update((p) => ({ ...p, name }))
  const setTheme = (themeId: string) => update((p) => ({ ...p, themeId }))
  const setMaxScore = (maxScore: number) => update((p) => ({ ...p, maxScore }))

  const addFacet = () =>
    update((p) => ({
      ...p,
      facets: [
        ...p.facets,
        { id: crypto.randomUUID(), name: 'New Facet', score: Math.ceil(p.maxScore / 2) },
      ],
    }))

  const removeFacet = (id: string) =>
    update((p) => ({ ...p, facets: p.facets.filter((f) => f.id !== id) }))

  const updateFacet = (id: string, changes: Partial<Facet>) =>
    update((p) => ({
      ...p,
      facets: p.facets.map((f) => (f.id === id ? { ...f, ...changes } : f)),
    }))

  const reorderFacets = (facets: Facet[]) => update((p) => ({ ...p, facets }))

  const saveSnapshot = (label: string) =>
    update((p) => {
      const snapshot: Snapshot = {
        id: crypto.randomUUID(),
        label,
        createdAt: new Date().toISOString(),
        facets: p.facets.map((f) => ({ ...f })),
        themeId: p.themeId,
        maxScore: p.maxScore,
      }
      return { ...p, snapshots: [snapshot, ...p.snapshots] }
    })

  const deleteSnapshot = (id: string) =>
    update((p) => ({ ...p, snapshots: p.snapshots.filter((s) => s.id !== id) }))

  const loadSnapshot = (snapshot: Snapshot) =>
    update((p) => ({
      ...p,
      facets: snapshot.facets.map((f) => ({ ...f })),
      themeId: snapshot.themeId,
      maxScore: snapshot.maxScore,
    }))

  const reset = () => {
    const fresh = defaultProject()
    save(fresh)
    setProject(fresh)
  }

  return {
    project,
    setName,
    setTheme,
    setMaxScore,
    addFacet,
    removeFacet,
    updateFacet,
    reorderFacets,
    saveSnapshot,
    deleteSnapshot,
    loadSnapshot,
    reset,
  }
}
