import { useMemo, useState } from "react"
import { Position } from "reactflow"
import { FileDown } from "lucide-react"
import { BaseNode } from "./baseNode"

export const TextToFileNode = ({ id, data }) => {
  const [fileType, setFileType] = useState(data?.fileType || "PDF")

  const handles = useMemo(
    () => [
      {
        id: `${id}-input`,
        type: "target",
        position: Position.Left,
        label: "Text",
      },
      {
        id: `${id}-output`,
        type: "source",
        position: Position.Right,
        label: "File",
      },
    ],
    [id]
  )

  return (
    <BaseNode
      label={data?.label || "Text To File"}
      icon={FileDown}
      handles={handles}
      onDelete={() => data?.onDelete(id)}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-gray-600">File Type</label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-[#818cf8] focus:outline-none"
          >
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="TXT">TXT</option>
          </select>
        </div>
      </div>
    </BaseNode>
  )
}