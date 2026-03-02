import type { ColorTheme } from '../types'

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'ocean',
    label: 'Ocean',
    fill: '#3bb5f0',
    track: '#c8e9fa',
    highlight: '#0ea5e9',
    text: '#374151',
  },
  {
    id: 'forest',
    label: 'Forest',
    fill: '#34d399',
    track: '#bbf7d0',
    highlight: '#059669',
    text: '#374151',
  },
  {
    id: 'sunset',
    label: 'Sunset',
    fill: '#fb923c',
    track: '#fed7aa',
    highlight: '#ea580c',
    text: '#374151',
  },
  {
    id: 'violet',
    label: 'Violet',
    fill: '#a78bfa',
    track: '#ede9fe',
    highlight: '#7c3aed',
    text: '#374151',
  },
  {
    id: 'rose',
    label: 'Rose',
    fill: '#fb7185',
    track: '#fecdd3',
    highlight: '#e11d48',
    text: '#374151',
  },
  {
    id: 'mono',
    label: 'Mono',
    fill: '#6b7280',
    track: '#e5e7eb',
    highlight: '#111827',
    text: '#374151',
  },
]

export function getTheme(id: string): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0]
}
