import React, { useState, useMemo } from "react"
import { Position, useUpdateNodeInternals } from "reactflow"
import { FileText, RefreshCw } from "lucide-react"
import { BaseNode } from "./baseNode"
import { EditableDiv } from "../components/EditableDiv.jsx"

export function TextNode({ id, data }) {
  const [text, setText] = useState(data?.text || "")
  const [variables, setVariables] = useState([])
  const updateNodeInternals = useUpdateNodeInternals()

  const handles = useMemo(() => {
    const inputHandles = variables.map((variable, index) => ({
      id: `${id}-${variable}`,
      type: "target",
      position: Position.Left,
      label: variable,
      style: { top: `${30 + index * 24}%` },
    }))

    return [
      ...inputHandles,
      {
        id: `${id}-output`,
        type: "source",
        position: Position.Right,
        label: "output",
        style: { top: "50%" },
      },
    ]
  }, [id, variables])

  const handleVariablesChange = (newVariables) => {
    setVariables(newVariables)
    updateNodeInternals(id)
  }

  return (
    <BaseNode
      label={data?.label || "Text"}
      icon={FileText}
      handles={handles}
      onDelete={() => data?.onDelete(id)}
      headerExtra={
        <button className="rounded p-1 hover:bg-gray-100" onClick={() => {}}>
          <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
        </button>
      }
    >
      <div className="space-y-1.5">
        <label className="text-sm text-gray-600">Text</label>
        <EditableDiv
          value={text}
          onChange={setText}
          onVariablesChange={handleVariablesChange}
          maxHeight={200}
        />
      </div>
    </BaseNode>
  )
}