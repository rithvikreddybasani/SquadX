import { useMemo, useState } from "react"
import { Position } from "reactflow"
import { BrainCircuit } from "lucide-react"
import { BaseNode } from "./baseNode"

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || "gpt-4-turbo-2024-04-09")
  const [usePersonalKey, setUsePersonalKey] = useState(
    data?.usePersonalKey || false
  )

  const handles = useMemo(
    () => [
      {
        id: `${id}-system`,
        type: "target",
        position: Position.Left,
        label: "system",
        style: { top: "30%" },
      },
      {
        id: `${id}-prompt`,
        type: "target",
        position: Position.Left,
        label: "prompt",
        style: { top: "70%" },
      },
      {
        id: `${id}-response`,
        type: "source",
        position: Position.Right,
        label: "response",
        style: { top: "50%" },
      },
    ],
    [id]
  )

  return (
    <BaseNode
      label={data?.label || "OpenAI LLM"}
      icon={BrainCircuit}
      handles={handles}
      onDelete={() => data?.onDelete(id)}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-gray-600">System</label>
          <textarea
            rows={4}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-[#818cf8] focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-gray-600">Prompt</label>
          <textarea
            rows={4}
            className="w-full max-h-12 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-[#818cf8] focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-gray-600">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-[#818cf8] focus:outline-none"
          >
            <option value="gpt-4-turbo-2024-04-09">
              gpt-4-turbo-2024-04-09
            </option>
            <option value="gpt-4">gpt-4</option>
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`personal-key-${id}`}
            checked={usePersonalKey}
            onChange={(e) => setUsePersonalKey(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#818cf8] focus:ring-[#818cf8]"
          />
          <label
            htmlFor={`personal-key-${id}`}
            className="text-sm text-gray-600"
          >
            Use Personal API Key
          </label>
        </div>
      </div>
    </BaseNode>
  )
}