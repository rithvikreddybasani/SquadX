import { useState } from "react"
import { X } from "lucide-react"
import { useStore } from "./store"
import { isDAG } from "./utils/is-dag.js"

export const SubmitButton = () => {
  const { nodes, edges } = useStore()
  const [alert, setAlert] = useState(null)

  const handleSubmit = () => {
    try {
      const isDag = isDAG(nodes, edges)
      setAlert({
        type: "success",
        message: `Pipeline analyzed: ${nodes.length} nodes, ${
          edges.length
        } edges. ${isDag ? "Is" : "Is not"} a DAG.`,
      })
      setTimeout(() => setAlert(null), 5000)
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to analyze pipeline. Try again.",
      })
    }
  }

  return (
    <div className="relative">
      {/* Alert */}
      {alert && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center max-w-sm p-4 rounded-lg shadow-lg ${
            alert.type === "success"
              ? "bg-green-100 border border-green-500 text-green-700"
              : "bg-red-100 border border-red-500 text-red-700"
          }`}
        >
          <span className="flex-1 text-sm">{alert.message}</span>
          <button
            onClick={() => setAlert(null)}
            className="ml-2 rounded p-1 hover:bg-gray-200"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}

      {/* Submit Button */}
      <div className="fixed inset-x-0 bottom-4 flex justify-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg 
            shadow-lg hover:bg-blue-600 transition duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Submit
        </button>
      </div>
    </div>
  )
}