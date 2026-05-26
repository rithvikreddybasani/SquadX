import React, { useMemo } from "react"
import {
  FileInputIcon,
  FileOutputIcon,
  FileText,
  BrainCircuit,
  FileType,
  Save,
} from "lucide-react"
import { DraggableNode } from "./draggableNode.jsx"

export const PipelineToolbar = () => {
  const nodes = useMemo(
    () => [
      { id: "input", label: "Input", icon: FileInputIcon, type: "customInput" },
      {
        id: "output",
        label: "Output",
        icon: FileOutputIcon,
        type: "customOutput",
      },
      { id: "text", label: "Text", icon: FileText, type: "text" },
      { id: "llm", label: "LLM", icon: BrainCircuit, type: "llm" },
      {
        id: "textToFile",
        label: "Text to File",
        icon: FileType,
        type: "textToFile",
      },
      { id: "fileSave", label: "File Save", icon: Save, type: "fileSave" },
    ],
    []
  )

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-200">
      <div className="flex flex-wrap gap-4 sm:flex-nowrap">
        {nodes.map((tool) => (
          <DraggableNode key={tool.id} {...tool} />
        ))}
      </div>
    </div>
  )
}
