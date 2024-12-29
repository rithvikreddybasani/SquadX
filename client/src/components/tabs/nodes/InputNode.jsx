import { useMemo, useState } from "react"
import { Position } from "reactflow"
import { FileInput } from "lucide-react"
import { BaseNode } from "./baseNode"

export const InputNode = ({ id, data }) => {
  const [fieldName, setFieldName] = useState(data?.fieldName || `input_${id}`)
  const [type, setType] = useState(data?.type || "Text")

  const handles = useMemo(
    () => [
      {
        id: `${id}-output`,
        type: "source",
        position: Position.Right,
        label: fieldName,
      },
    ],
    [id, fieldName]
  )

  return (
    <BaseNode
      label={data?.label || "Input"}
      icon={FileInput}
      handles={handles}
      onDelete={() => data?.onDelete(id)}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-gray-600">Field Name</label>
          <input
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-[#818cf8] focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-gray-600">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-[#818cf8] focus:outline-none"
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
            <option value="Audio">Audio</option>
          </select>
        </div>
      </div>
    </BaseNode>
  )
}