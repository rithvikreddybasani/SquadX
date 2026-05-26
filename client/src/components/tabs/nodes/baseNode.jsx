import { Handle } from "reactflow"
import { X } from "lucide-react"

export const BaseNode = ({
  label,
  icon: Icon,
  handles,
  onDelete,
  children,
}) => {
  return (
    <div className="min-w-[240px] rounded-lg border border-[#818cf8] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#818cf8]/20 bg-[#818cf8]/5 px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-medium text-[#4F46E5]">
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onDelete} className="rounded p-1 hover:bg-gray-100">
            <X className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">{children}</div>

      {/* Handles */}
      {handles?.map((handle) => (
        <Handle
          {...handle}
          key={handle.id}
          id={handle.id}
          type={handle.type}
          position={handle.position}
          className={`!h-4 !w-4 !rounded-full !border-2 !bg-white !border-[#818cf8] ${
            handle.position === "left"
              ? "!-translate-x-1/4"
              : "!translate-x-1/4"
          }`}
        >
          <div className="relative">
            {handle.label && (
              <span
                className={`absolute text-base text-[#818cf8] bottom-4 whitespace-nowrap ${
                  handle.position === "right"
                    ? "left-5"
                    : "right-[calc(100%+16px)]"
                }`}
              >
                {handle.label}
              </span>
            )}
          </div>
        </Handle>
      ))}
    </div>
  )
}