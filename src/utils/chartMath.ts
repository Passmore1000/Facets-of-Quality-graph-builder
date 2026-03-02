/**
 * Generates SVG arc path data for a donut segment.
 *
 * @param cx         Centre x
 * @param cy         Centre y
 * @param innerR     Inner radius (hole)
 * @param outerR     Outer radius
 * @param startAngle Segment start in degrees (0 = top)
 * @param endAngle   Segment end in degrees
 */
export function arcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180

  const s = toRad(startAngle)
  const e = toRad(endAngle)

  const x1 = cx + outerR * Math.cos(s)
  const y1 = cy + outerR * Math.sin(s)
  const x2 = cx + outerR * Math.cos(e)
  const y2 = cy + outerR * Math.sin(e)

  const x3 = cx + innerR * Math.cos(e)
  const y3 = cy + innerR * Math.sin(e)
  const x4 = cx + innerR * Math.cos(s)
  const y4 = cy + innerR * Math.sin(s)

  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${x1} ${y1}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ')
}

/**
 * Returns the midpoint angle (degrees) of a segment, and the
 * x/y coordinates for placing a label outside the chart.
 */
export function labelPosition(
  cx: number,
  cy: number,
  startAngle: number,
  endAngle: number,
  radius: number,
): { x: number; y: number; angle: number } {
  const mid = (startAngle + endAngle) / 2
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180
  const r = toRad(mid)
  return {
    x: cx + radius * Math.cos(r),
    y: cy + radius * Math.sin(r),
    angle: mid,
  }
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
