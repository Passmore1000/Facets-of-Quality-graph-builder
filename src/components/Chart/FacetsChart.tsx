import { arcPath, labelPosition, segmentAngles } from '../../utils/chartMath'
import { getTheme } from '../../utils/themes'
import type { Facet } from '../../types'

interface Props {
  facets: Facet[]
  maxScore: number
  themeId: string
  /** If provided, renders a comparison overlay (goal state) */
  goalFacets?: Facet[]
  size?: number
  /** Element id used for export */
  svgId?: string
}

const GAP_DEG = 3
const INNER_RATIO = 0.22   // hole as fraction of outer radius
const LABEL_GAP = 28       // px gap between outer edge and label

export function FacetsChart({
  facets,
  maxScore,
  themeId,
  goalFacets,
  size = 380,
  svgId = 'facets-chart',
}: Props) {
  const theme = getTheme(themeId)
  const cx = size / 2
  const cy = size / 2
  const outerR = size / 2 - LABEL_GAP - 40  // leave room for labels
  const innerR = outerR * INNER_RATIO

  const angles = segmentAngles(facets.length, GAP_DEG)

  return (
    <svg
      id={svgId}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background: light segments at max score */}
      {facets.map((facet, i) => {
        const { start, end } = angles[i]
        return (
          <path
            key={`track-${facet.id}`}
            d={arcPath(cx, cy, innerR, outerR, start, end)}
            fill={theme.track}
          />
        )
      })}

      {/* Filled segments based on score */}
      {facets.map((facet, i) => {
        const { start, end } = angles[i]
        const ratio = Math.min(Math.max(facet.score / maxScore, 0), 1)
        const filledR = innerR + ratio * (outerR - innerR)

        // If goal provided, use highlight for this facet if it has a goal
        const isGoalFacet = goalFacets?.some((g) => g.id === facet.id)
        const fillColor = isGoalFacet ? theme.highlight : theme.fill

        return (
          <path
            key={`fill-${facet.id}`}
            d={arcPath(cx, cy, innerR, filledR, start, end)}
            fill={fillColor}
          />
        )
      })}

      {/* Goal overlay segments (popped out, if provided) */}
      {goalFacets?.map((goal) => {
        const idx = facets.findIndex((f) => f.id === goal.id)
        if (idx === -1) return null
        const { start, end } = angles[idx]
        const ratio = Math.min(Math.max(goal.score / maxScore, 0), 1)
        const filledR = innerR + ratio * (outerR - innerR)
        const POP = 10  // offset outward

        // Translate segment outward along its midpoint angle
        const midAngle = ((start + end) / 2 - 90) * (Math.PI / 180)
        const tx = Math.cos(midAngle) * POP
        const ty = Math.sin(midAngle) * POP

        return (
          <path
            key={`goal-${goal.id}`}
            d={arcPath(cx, cy, innerR, filledR, start, end)}
            fill={theme.highlight}
            transform={`translate(${tx}, ${ty})`}
            opacity={0.9}
          />
        )
      })}

      {/* Labels */}
      {facets.map((facet, i) => {
        const { start, end } = angles[i]
        const labelR = outerR + LABEL_GAP
        const pos = labelPosition(cx, cy, start, end, labelR)

        const textAnchor =
          pos.angle > 345 || pos.angle < 15
            ? 'middle'
            : pos.angle < 180
            ? 'start'
            : pos.angle > 180 && pos.angle < 195
            ? 'middle'
            : 'end'

        return (
          <g key={`label-${facet.id}`}>
            <text
              x={pos.x}
              y={pos.y - 8}
              textAnchor={textAnchor}
              dominantBaseline="auto"
              fontSize={15}
              fontWeight={700}
              fill={theme.text}
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            >
              {facet.score}
            </text>
            <text
              x={pos.x}
              y={pos.y + 10}
              textAnchor={textAnchor}
              dominantBaseline="auto"
              fontSize={12}
              fontWeight={400}
              fill={theme.text}
              opacity={0.7}
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            >
              {facet.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
