const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180
const toDeg = (rad: number) => (rad * 180) / Math.PI
const pt = (x: number, y: number) => `${x.toFixed(3)} ${y.toFixed(3)}`

/**
 * Generates SVG arc path data for a donut segment (sharp corners).
 */
export function arcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const s = toRad(startAngle)
  const e = toRad(endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${pt(cx + outerR * Math.cos(s), cy + outerR * Math.sin(s))}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${pt(cx + outerR * Math.cos(e), cy + outerR * Math.sin(e))}`,
    `L ${pt(cx + innerR * Math.cos(e), cy + innerR * Math.sin(e))}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${pt(cx + innerR * Math.cos(s), cy + innerR * Math.sin(s))}`,
    'Z',
  ].join(' ')
}

/**
 * Generates SVG arc path data for a donut segment with rounded corners.
 *
 * Each of the four corners (outer-start, outer-end, inner-end, inner-start)
 * is replaced with a small arc of radius `cr`. The corner arcs are tangent
 * to both adjacent edges using angular offsets derived from asin(cr/R).
 *
 * All four corner arcs use sweep=0 because the path direction (clockwise
 * outer arc, counterclockwise inner arc) means all corners are left-turns.
 */
export function roundedArcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
  cr: number,
): string {
  if (cr <= 0 || innerR >= outerR) {
    return arcPath(cx, cy, innerR, outerR, startAngle, endAngle)
  }

  const width = outerR - innerR
  const r = Math.min(cr, width / 2 - 0.5)

  // Angular offsets so corner arcs sit tangent to the circular arcs
  const dOuter = toDeg(Math.asin(r / outerR))
  const dInner = toDeg(Math.asin(r / innerR))

  // 8 key points around the path
  const sO = toRad(startAngle + dOuter)
  const eO = toRad(endAngle - dOuter)
  const sI = toRad(startAngle + dInner)
  const eI = toRad(endAngle - dInner)
  const sR = toRad(startAngle)
  const eR = toRad(endAngle)

  const oAS = pt(cx + outerR * Math.cos(sO), cy + outerR * Math.sin(sO))  // outer arc start
  const oAE = pt(cx + outerR * Math.cos(eO), cy + outerR * Math.sin(eO))  // outer arc end
  const eRO = pt(cx + (outerR - r) * Math.cos(eR), cy + (outerR - r) * Math.sin(eR))  // end radial, outer
  const eRI = pt(cx + (innerR + r) * Math.cos(eR), cy + (innerR + r) * Math.sin(eR))  // end radial, inner
  const iAE = pt(cx + innerR * Math.cos(eI), cy + innerR * Math.sin(eI))  // inner arc end
  const iAS = pt(cx + innerR * Math.cos(sI), cy + innerR * Math.sin(sI))  // inner arc start
  const sRI = pt(cx + (innerR + r) * Math.cos(sR), cy + (innerR + r) * Math.sin(sR))  // start radial, inner
  const sRO = pt(cx + (outerR - r) * Math.cos(sR), cy + (outerR - r) * Math.sin(sR))  // start radial, outer

  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${oAS}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${oAE}`,  // outer arc
    `A ${r} ${r} 0 0 0 ${eRO}`,                       // outer-end corner
    `L ${eRI}`,                                        // end radial line
    `A ${r} ${r} 0 0 0 ${iAE}`,                       // inner-end corner
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${iAS}`,   // inner arc
    `A ${r} ${r} 0 0 0 ${sRI}`,                       // inner-start corner
    `L ${sRO}`,                                        // start radial line
    `A ${r} ${r} 0 0 0 ${oAS}`,                       // outer-start corner
    'Z',
  ].join(' ')
}

/**
 * Generates SVG arc path data for a donut segment with only the outer corners
 * rounded. The inner edge stays sharp (clean circle), avoiding geometry
 * breakage when the fill segment is short.
 */
export function outerRoundedArcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
  cr: number,
): string {
  if (cr <= 0 || innerR >= outerR) {
    return arcPath(cx, cy, innerR, outerR, startAngle, endAngle)
  }

  const width = outerR - innerR
  const r = Math.min(cr, width / 2 - 0.5)

  // Angular offsets for outer corners only
  const dOuter = toDeg(Math.asin(r / outerR))

  const sO = toRad(startAngle + dOuter)
  const eO = toRad(endAngle - dOuter)
  const sR = toRad(startAngle)
  const eR = toRad(endAngle)

  const oAS = pt(cx + outerR * Math.cos(sO), cy + outerR * Math.sin(sO))         // outer arc start
  const oAE = pt(cx + outerR * Math.cos(eO), cy + outerR * Math.sin(eO))         // outer arc end
  const eRO = pt(cx + (outerR - r) * Math.cos(eR), cy + (outerR - r) * Math.sin(eR)) // end radial, outer
  const eRI = pt(cx + innerR * Math.cos(eR), cy + innerR * Math.sin(eR))         // end radial, inner (sharp)
  const sRI = pt(cx + innerR * Math.cos(sR), cy + innerR * Math.sin(sR))         // start radial, inner (sharp)
  const sRO = pt(cx + (outerR - r) * Math.cos(sR), cy + (outerR - r) * Math.sin(sR)) // start radial, outer

  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${oAS}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${oAE}`,  // outer arc
    `A ${r} ${r} 0 0 0 ${eRO}`,                       // outer-end corner
    `L ${eRI}`,                                        // end radial line (sharp inner)
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${sRI}`,   // inner arc (counterclockwise)
    `L ${sRO}`,                                        // start radial line
    `A ${r} ${r} 0 0 0 ${oAS}`,                       // outer-start corner
    'Z',
  ].join(' ')
}

/**
 * Returns the midpoint angle and x/y for placing a label outside the chart.
 */
export function labelPosition(
  cx: number,
  cy: number,
  startAngle: number,
  endAngle: number,
  radius: number,
): { x: number; y: number; angle: number } {
  const mid = (startAngle + endAngle) / 2
  const r = toRad(mid)
  return { x: cx + radius * Math.cos(r), y: cy + radius * Math.sin(r), angle: mid }
}

/**
 * Calculates segment angles for N facets with a small gap between them.
 */
export function segmentAngles(
  count: number,
  gapDeg = 3,
): Array<{ start: number; end: number }> {
  const slice = 360 / count
  return Array.from({ length: count }, (_, i) => ({
    start: i * slice + gapDeg / 2,
    end: (i + 1) * slice - gapDeg / 2,
  }))
}
