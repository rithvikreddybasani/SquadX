import React, { useState, useRef } from "react"

export function EditableDiv({
  value,
  onChange,
  onVariablesChange,
  maxHeight = 200,
}) {
  const [isFocused, setIsFocused] = useState(false)
  const divRef = useRef(null)

  const handleInput = (e) => {
    const newValue = e.currentTarget.innerText
    onChange(newValue)

    const variables = [
      ...newValue.matchAll(/{{(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*)}}/g),
    ].map((match) => match[1].trim())
    onVariablesChange(variables)
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }

  return (
    <div
      ref={divRef}
      contentEditable
      onInput={handleInput}
      onPaste={handlePaste}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`
        w-full
        transition-all
        outline-none
        border
        border-[#d9d8dd]
        nodrag 
        font-sans
        text-base
        cursor-text
        rounded-md
        p-2
        overflow-x-hidden
        overflow-y-auto
        focus:bg-white
        focus:border-[#4F46E5]
        hover:bg-[#fafaff]
        hover:border-[#f1f1fe]
        text-[#313745]
        ${isFocused ? "shadow-sm" : ""}
      `}
      style={{
        maxHeight: `${maxHeight}px`,
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
      }}
    />
  )
}