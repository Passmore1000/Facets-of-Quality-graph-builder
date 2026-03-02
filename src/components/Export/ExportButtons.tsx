import { exportPNG, exportSVG } from '../../utils/export'

interface Props {
  svgId: string
  filename: string
}

export function ExportButtons({ svgId, filename }: Props) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportSVG(svgId, filename)}
        className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 rounded-lg px-3 py-1.5 transition-colors"
      >
        Export SVG
      </button>
      <button
        onClick={() => exportPNG(svgId, filename)}
        className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 rounded-lg px-3 py-1.5 transition-colors"
      >
        Export PNG
      </button>
    </div>
  )
}
