import { createContext, useEffect, useState } from "react"
import PropTypes from "prop-types"
import useFileSystem from "@/hooks/useFileSystem"
import axios from "axios"
import toast from "react-hot-toast"

const RunCodeContext = createContext()

const JUDGE0_URL = "http://localhost:2358"

const extensionMap = {
    asm: 45,
    sh: 46,
    bash: 46,
    bas: 47,
    c: 50,
    cpp: 54,
    cc: 54,
    cxx: 54,
    cs: 51,
    cob: 77,
    lisp: 55,
    clj: 86,
    d: 56,
    ex: 57,
    erl: 58,
    fs: 87,
    f90: 59,
    go: 60,
    groovy: 88,
    hs: 61,
    java: 62,
    js: 63,
    kt: 78,
    lua: 64,
    m: 79,
    ml: 65,
    mli: 65,
    octave: 66,
    pas: 67,
    pl: 85,
    php: 68,
    txt: 43,
    prolog: 69,
    py: 71,
    r: 80,
    rb: 72,
    rs: 73,
    scala: 81,
    sql: 82,
    swift: 83,
    ts: 74,
    vb: 84,
}

const encodeBase64 = (str) => {
    return btoa(unescape(encodeURIComponent(str)))
}

const decodeBase64 = (str) => {
    return decodeURIComponent(escape(atob(str)))
}

const RunCodeContextProvider = ({ children }) => {
    const { currentFile } = useFileSystem()

    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [isRunning, setIsRunning] = useState(false)
    const [supportedLanguages, setSupportedLanguages] = useState([])
    const [selectedLanguage, setSelectedLanguage] = useState(null)

    // ✅ Fetch languages
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const res = await axios.get(`${JUDGE0_URL}/languages`)
                setSupportedLanguages(res.data)
            } catch (err) {
                console.error(err)
                toast.error("Failed to fetch languages")
            }
        }
        fetchLanguages()
    }, [])

    // ✅ Auto detect language
    useEffect(() => {
        if (!currentFile?.name || supportedLanguages.length === 0) return

        const ext = currentFile.name.split(".").pop().toLowerCase()
        const langId = extensionMap[ext]

        const lang = supportedLanguages.find(l => l.id === langId)
        setSelectedLanguage(lang || null)

    }, [currentFile?.name, supportedLanguages])

    // ✅ Run code (BASE64 MODE)
    const runCode = async () => {
        try {
            if (!selectedLanguage) {
                return toast.error("Unsupported file type")
            }

            if (!currentFile) {
                return toast.error("No file open")
            }

            toast.loading("Running code...")
            setIsRunning(true)

            const encodedCode = encodeBase64(currentFile.content)
            const encodedInput = encodeBase64(input)

            const res = await axios.post(
                `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
                {
                    source_code: encodedCode,
                    language_id: selectedLanguage.id,
                    stdin: encodedInput,
                }
            )

            const result = res.data

            let finalOutput = ""

            if (result.stderr) {
                finalOutput = decodeBase64(result.stderr)
            } else if (result.compile_output) {
                finalOutput = decodeBase64(result.compile_output)
            } else if (result.stdout) {
                finalOutput = decodeBase64(result.stdout)
            }

            setOutput(finalOutput)

            toast.dismiss()
            setIsRunning(false)

        } catch (error) {
            console.error(error)
            toast.dismiss()
            setIsRunning(false)
            toast.error("Execution failed")
        }
    }

    return (
        <RunCodeContext.Provider
            value={{
                setInput,
                output,
                isRunning,
                supportedLanguages,
                selectedLanguage,
                setSelectedLanguage,
                runCode,
            }}
        >
            {children}
        </RunCodeContext.Provider>
    )
}

RunCodeContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { RunCodeContextProvider }
export default RunCodeContext