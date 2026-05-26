import { useState } from "react"
import { useRunCode } from "@/hooks/useRunCode"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import toast from "react-hot-toast"
import { PiCaretDownBold } from "react-icons/pi"
import { LuCopy } from "react-icons/lu"

function RunTab() {
    const { tabHeight } = useWindowDimensions()

    const {
        setInput,
        output,
        isRunning,
        supportedLanguages,
        selectedLanguage,
        setSelectedLanguage,
        runCode,
    } = useRunCode()

    const [inputValue, setInputValue] = useState("")

    // ✅ FIXED: use name instead of language
    const handleLanguageChange = (e) => {
        const lang = supportedLanguages.find(
            (l) => l.name === e.target.value
        )
        if (lang) setSelectedLanguage(lang)
    }

    const copyOutput = async () => {
        try {
            await navigator.clipboard.writeText(output || "")
            toast.success("Output copied to clipboard")
        } catch {
            toast.error("Failed to copy output")
        }
    }

    const handleRun = async () => {
        try {
            await runCode()
        } catch (err) {
            console.error(err)
            toast.error("Execution failed")
        }
    }

    return (
        <div
            className="flex flex-col items-center gap-2 p-4"
            style={{ height: tabHeight }}
        >
            <h1 className="tab-title">Run Code</h1>

            <div className="flex h-[90%] w-full flex-col items-end gap-2 md:h-[92%]">

                {/* ✅ Language Selector (FIXED) */}
                <div className="relative w-full">
                    <select
                        className="w-full rounded-md border-none bg-darkHover px-4 py-2 text-white outline-none"
                        value={selectedLanguage?.name || ""}
                        onChange={handleLanguageChange}
                    >
                        {[...supportedLanguages]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((lang) => (
                                <option key={lang.id} value={lang.name}>
                                    {lang.name}
                                </option>
                            ))}
                    </select>

                    <PiCaretDownBold
                        size={16}
                        className="absolute bottom-3 right-4 z-10 text-white"
                    />
                </div>

                {/* Input */}
                <textarea
                    className="min-h-[120px] w-full resize-none rounded-md border-none bg-darkHover p-2 text-white outline-none"
                    placeholder="Write your input here..."
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                        setInput(e.target.value)
                    }}
                />

                {/* Run Button */}
                <button
                    className="flex w-full justify-center rounded-md bg-white p-2 font-bold text-black outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleRun}
                    disabled={isRunning}
                >
                    {isRunning ? "Running..." : "Run"}
                </button>

                {/* Output Header */}
                <label className="flex w-full justify-between">
                    Output :
                    <button onClick={copyOutput} title="Copy Output">
                        <LuCopy
                            size={18}
                            className="cursor-pointer text-white"
                        />
                    </button>
                </label>

                {/* Output Box */}
                <div className="w-full flex-grow overflow-y-auto rounded-md bg-darkHover p-2 text-white">
                    <code>
                        <pre className="whitespace-pre-wrap">
                            {output || "No output yet..."}
                        </pre>
                    </code>
                </div>
            </div>
        </div>
    )
}

export default RunTab