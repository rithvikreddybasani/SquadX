import { useMemo } from "react"
import { Position } from "reactflow"
import { Save } from "lucide-react"
import { BaseNode } from "./baseNode.jsx"

export const FileSaveNode = ({ id, data }) => {
  const handles = useMemo(
    () => [
      {
        id: `${id}-name`,
        type: "target",
        position: Position.Left,
        label: "name",
        style: { top: "30%" },
      },
      {
        id: `${id}-files`,
        type: "target",
        position: Position.Left,
        label: "files",
        style: { top: "70%" },
      },
    ],
    [id]
  )

  return (
    <BaseNode
      label={data?.label || "File Save"}
      icon={Save}
      handles={handles}
      onDelete={() => data?.onDelete(id)}
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Name the file outputs using &quot;name&quot;.
        </p>
        <p className="text-sm text-gray-500 ">
          Will use a default name if empty.
        </p>
        <p className="text-sm text-gray-600">
          Pass all files to download to &quot;files&quot;.
        </p>
      </div>
    </BaseNode>
  )
}