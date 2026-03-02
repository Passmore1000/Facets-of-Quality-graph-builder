import { useEffect, useMemo, useRef, useState } from 'react'
import { arc } from 'd3-shape'
import { labelPosition, segmentAngles } from '../../utils/chartMath'
import { getTheme } from '../../utils/themes'
import type { Facet } from '../../types'

interface Props {
  facets: Facet[]
  maxScore: number
  themeId: string
  goalFacets?: Facet[]
  size?: number
  svgId?: string
  showLabels?: boolean
  animate?: boolean
  cornerRadius?: number
  segmentGapPx?: number
}

const INNER_RATIO = 0.22
const LABEL_GAP = 34
const SEGMENT_GAP_PX = 12
const CORNER_RADIUS = 5
const ANIMATION_DURATION_MS = 550

const toRadFromDeg = (deg: number) => (deg * Math.PI) / 180

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

const formatScore = (value: number): string => {
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(1).replace(/\.0$/, '')
}

const useAnimatedScores = (items: Facet[], durationMs: number): Record<string, number> => {
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(items.map((item) => [item.id, item.score])),
  )
  const scoresRef = useRef<Record<string, number>>(Object.fromEntries(items.map((item) => [item.id, item.score])))

  useEffect(() => {
    const targetScores = Object.fromEntries(items.map((item) => [item.id, item.score]))
    const startScores = Object.fromEntries(
      items.map((item) => [item.id, scoresRef.current[item.id] ?? targetScores[item.id]]),
    )

    let frameId = 0
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = easeOutCubic(progress)

      const nextScores: Record<string, number> = {}
      items.forEach((item) => {
        const from = startScores[item.id]
        const to = targetScores[item.id]
        nextScores[item.id] = from + (to - from) * eased
      })

      scoresRef.current = nextScores
      setAnimatedScores(nextScores)

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [items, durationMs])

  return animatedScores
}

const roundedSegmentPath = (
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number,
  cornerRadius: number,
  padAngle: number,
  padRadius: number,
): string => {
  const segment = arc()
    .innerRadius(innerR)
    .outerRadius(outerR)
    .startAngle(toRadFromDeg(startDeg))
    .endAngle(toRadFromDeg(endDeg))
    .cornerRadius(cornerRadius)
    .padAngle(padAngle)
    .padRadius(padRadius)

  return segment({} as never) ?? ''
}

export function FacetsChart({
  facets,
  maxScore,
  themeId,
  goalFacets,
  size = 380,
  svgId = 'facets-chart',
  showLabels = true,
  animate = true,
  cornerRadius = CORNER_RADIUS,
  segmentGapPx = SEGMENT_GAP_PX,
}: Props) {
  const theme = getTheme(themeId)
  const safeGoalFacets = useMemo(() => goalFacets ?? [], [goalFacets])
  const animatedFacetScores = useAnimatedScores(facets, animate ? ANIMATION_DURATION_MS : 0)
  const animatedGoalScores = useAnimatedScores(safeGoalFacets, animate ? ANIMATION_DURATION_MS : 0)
  const animatedFacets = useMemo(
    () => facets.map((facet) => ({ ...facet, score: animatedFacetScores[facet.id] ?? facet.score })),
    [facets, animatedFacetScores],
  )
  const animatedGoalFacets = useMemo(
    () => safeGoalFacets.map((goal) => ({ ...goal, score: animatedGoalScores[goal.id] ?? goal.score })),
    [safeGoalFacets, animatedGoalScores],
  )

  const cx = size / 2
  const cy = size / 2
  const outerPadding = showLabels ? LABEL_GAP + 40 : 8
  const outerR = Math.max(6, size / 2 - outerPadding)
  const innerR = outerR * INNER_RATIO
  const ringMidR = (innerR + outerR) / 2
  const effectiveGapPx = Math.min(segmentGapPx, Math.max(1.5, size * 0.03))
  const effectiveCornerRadius = Math.min(cornerRadius, Math.max(0.8, (outerR - innerR) * 0.18))
  const padAngle = effectiveGapPx / ringMidR

  const angles = segmentAngles(facets.length, 0)

  return (
    <svg
      id={svgId}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: showLabels ? 'visible' : 'hidden' }}
    >
      <g transform={`translate(${cx}, ${cy})`}>
        {/* Track: subtle rounded corners on all segment edges */}
        {facets.map((facet, i) => {
          const { start, end } = angles[i]
          const path = roundedSegmentPath(
            innerR,
            outerR,
            start,
            end,
            effectiveCornerRadius,
            padAngle,
            ringMidR,
          )
          if (!path) return null

          return <path key={`track-${facet.id}`} d={path} fill={theme.track} />
        })}

        {/* Fill: score-proportional segments with subtle rounded corners */}
        {animatedFacets.map((facet, i) => {
          const { start, end } = angles[i]
          const ratio = Math.min(Math.max(facet.score / maxScore, 0), 1)
          const filledR = innerR + ratio * (outerR - innerR)

          const isGoalFacet = goalFacets?.some((g) => g.id === facet.id)
          const fillColor = isGoalFacet ? theme.highlight : theme.fill
          const path = roundedSegmentPath(
            innerR,
            filledR,
            start,
            end,
            effectiveCornerRadius,
            padAngle,
            ringMidR,
          )
          if (!path) return null

          return <path key={`fill-${facet.id}`} d={path} fill={fillColor} />
        })}

        {/* Goal overlay segments */}
        {animatedGoalFacets.map((goal) => {
          const idx = animatedFacets.findIndex((f) => f.id === goal.id)
          if (idx === -1) return null
          const { start, end } = angles[idx]
          const ratio = Math.min(Math.max(goal.score / maxScore, 0), 1)
          const filledR = innerR + ratio * (outerR - innerR)
          const path = roundedSegmentPath(
            innerR,
            filledR,
            start,
            end,
            effectiveCornerRadius,
            padAngle,
            ringMidR,
          )
          if (!path) return null

          const POP = 10
          const midAngle = ((start + end) / 2 - 90) * (Math.PI / 180)
          const tx = Math.cos(midAngle) * POP
          const ty = Math.sin(midAngle) * POP

          return (
            <path
              key={`goal-${goal.id}`}
              d={path}
              fill={theme.highlight}
              transform={`translate(${tx}, ${ty})`}
              opacity={0.9}
            />
          )
        })}
      </g>

      {/* Labels */}
      {showLabels &&
        animatedFacets.map((facet, i) => {
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
              {formatScore(facet.score)}
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
