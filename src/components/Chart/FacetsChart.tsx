import { outerRoundedArcPath, labelPosition, segmentAngles } from '../../utils/chartMath'
import { getTheme } from '../../utils/themes'
import type { Facet } from '../../types'

interface Props {
  facets: Facet[]
  maxScore: number
  themeId: string
  goalFacets?: Facet[]
  size?: number
  svgId?: string
}

const GAP_DEG = 3
const INNER_RATIO = 0.22
const LABEL_GAP = 34
const CORNER_RADIUS = 8

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
  const outerR = size / 2 - LABEL_GAP - 40
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
      {/* Track: full-width rounded segments */}
      {facets.map((facet, i) => {
        const { start, end } = angles[i]
        return (
          <path
            key={`track-${facet.id}`}
            d={outerRoundedArcPath(cx, cy, innerR, outerR, start, end, CORNER_RADIUS)}
            fill={theme.track}
          />
        )
      })}

      {/* Fill: score-proportional rounded segments */}
      {facets.map((facet, i) => {
        const { start, end } = angles[i]
        const ratio = Math.min(Math.max(facet.score / maxScore, 0), 1)
        const filledR = innerR + ratio * (outerR - innerR)
        const isGoalFacet = goalFacets?.some((g) => g.id === facet.id)
        const fillColor = isGoalFacet ? theme.highlight : theme.fill

        return (
          <path
            key={`fill-${facet.id}`}
            d={outerRoundedArcPath(cx, cy, innerR, filledR, start, end, CORNER_RADIUS)}
            fill={fillColor}
          />
        )
      })}

      {/* Goal overlay segments */}
      {goalFacets?.map((goal) => {
        const idx = facets.findIndex((f) => f.id === goal.id)
        if (idx === -1) return null
        const { start, end } = angles[idx]
        const ratio = Math.min(Math.max(goal.score / maxScore, 0), 1)
        const filledR = innerR + ratio * (outerR - innerR)
        const POP = 10
        const midAngle = ((start + end) / 2 - 90) * (Math.PI / 180)
        const tx = Math.cos(midAngle) * POP
        const ty = Math.sin(midAngle) * POP

        return (
          <path
            key={`goal-${goal.id}`}
            d={outerRoundedArcPath(cx, cy, innerR, filledR, start, end, CORNER_RADIUS)}
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
              y={pos.y - 6}
              textAnchor={textAnchor}
              dominantBaseline="auto"
              fontSize={19}
              fontWeight={800}
              fill={theme.text}
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            >
              {facet.score}
            </text>
            <text
              x={pos.x}
              y={pos.y + 14}
              textAnchor={textAnchor}
              dominantBaseline="auto"
              fontSize={13}
              fontWeight={400}
              fill={theme.text}
              opacity={0.65}
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
