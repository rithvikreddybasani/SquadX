// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from "react"
import ReactFlow, { Controls, Background, MiniMap } from "reactflow"
import { useStore } from "./store.js"
import { shallow } from "zustand/shallow"

import {
  InputNode,
  OutputNode,
  TextNode,
  LLMNode,
  TextToFileNode,
  FileSaveNode,
} from "./nodes"
import { CustomEdge } from "./edges/customEdge.jsx"
import "reactflow/dist/style.css"

const gridSize = 25
const proOptions = { hideAttribution: true }
const nodeTypes = {
  customInput: InputNode,
  customOutput: OutputNode,
  text: TextNode,
  llm: LLMNode,
  textToFile: TextToFileNode,
  fileSave: FileSaveNode,
}

const edgeTypes = {
  custom: CustomEdge,
}

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  removeNode: state.removeNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    removeNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow)

  const getInitNodeData = useCallback(
    (nodeID, type, label) => {
      let nodeData = {
        id: nodeID,
        label: label,
        nodeType: `${type}`,
        onDelete: removeNode,
      }
      return nodeData
    },
    [removeNode]
  )

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        )
        const type = appData?.nodeType
        const label = appData?.label

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        const nodeID = getNodeID(type)
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type, label),
        }

        addNode(newNode)
      }
    },
    [addNode, getNodeID, reactFlowInstance, getInitNodeData]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  return (
    <div className="flex flex-1 p-4 bg-[#fafafa]">
      <div
        ref={reactFlowWrapper}
        className=" flex flex-1 rounded-xl shadow-sm bg-white overflow-hidden"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
        >
          <Background color="#e5e5e5" gap={gridSize} size={3} variant="dots" />

          <Controls className="!bg-white !border !border-gray-200 !shadow-sm !rounded-lg" />
          <MiniMap className="!bg-white !border !border-gray-200 !shadow-sm !rounded-lg" />
        </ReactFlow>
      </div>
    </div>
  )
}