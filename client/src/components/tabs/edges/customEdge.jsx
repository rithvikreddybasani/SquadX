import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "reactflow"
import { useStore } from "../store"
export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  style,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  const removeEdge = useStore((state) => state.removeEdge)

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: "#4F46E5", strokeWidth: 2, ...style }}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <button
            className="w-5 h-5 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            onClick={(event) => {
              event.stopPropagation()
              removeEdge(id)
            }}
          >
            <span className="text-gray-500 text-xs">×</span>
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default CustomEdge