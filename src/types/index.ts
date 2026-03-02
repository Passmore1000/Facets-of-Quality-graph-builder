export interface Facet {
  id: string
  name: string
  score: number
}

export interface Snapshot {
  id: string
  label: string
  createdAt: string
  facets: Facet[]
  themeId: string
  maxScore: number
}

export interface Project {
  id: string
  name: string
  facets: Facet[]
  themeId: string
  maxScore: number
  snapshots: Snapshot[]
}

export interface ColorTheme {
  id: string
  label: string
  fill: string        // filled segment color
  track: string       // unfilled (background) segment color
  highlight: string   // popped/goal segment color
  text: string        // label color
}
