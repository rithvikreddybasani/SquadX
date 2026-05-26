import FileSystem from "@/components/files/FileSystem"
import useFileSystem from "@/hooks/useFileSystem"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import langMap from "lang-map"
import { useEffect, useRef, useState } from "react"
import { BiArchiveIn } from "react-icons/bi"
import { LuDownload } from "react-icons/lu"
import { TbFileUpload } from "react-icons/tb"
import { v4 as uuidv4 } from "uuid"

function FilesTab() {
    const {
        currentFile,
        setCurrentFile,
        updateFile,
        setFiles,
        downloadCurrentFile,
        downloadAllFiles,
        files,
    } = useFileSystem()
    const fileInputRef = useRef(null)
    const { tabHeight } = useWindowDimensions()
    const [searchQuery, setSearchQuery] = useState("")
    const [fileMap, setFileMap] = useState({})

    // Update the file map whenever files change
    useEffect(() => {
        const newFileMap = files.reduce((acc, file) => {
            acc[file.name.toLowerCase()] = file
            return acc
        }, {})
        setFileMap(newFileMap)
    }, [files])

    const handleOpenFile = () => {
        fileInputRef.current.click()
    }

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target.result
            const file = {
                id: uuidv4(),
                name: selectedFile.name,
                content: text,
            }
            // Save current file before opening new file
            updateFile(currentFile.id, currentFile.content)

            setFiles((prev) => [...prev, file])
            setCurrentFile(file)
        }
        reader.readAsText(selectedFile)
    }

    const allowedFileExtensions = Object.keys(langMap().languages).join(",")
    
    // Filter files based on search query by using the fileMap
    const filteredFiles = Object.values(fileMap).filter((file) =>
        file.name.toLowerCase().includes((searchQuery || "").toLowerCase())
    )

    return (
        <div
            className="flex select-none flex-col gap-1 p-4"
            style={{ height: tabHeight }}
        >
            <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 w-full rounded-md border border-gray-300 p-2 transition-all focus:ring-2 focus:ring-blue-400"
                style={{
                    backgroundColor: "#f0f8ff", // Light blue background
                    color: "black",          // Dark gray text
                }}
            />

            {/* Display Filtered Files */}
            {searchQuery && (
                <div
                    className="flex flex-col gap-1 mb-4 transition-transform transform"
                    style={{
                        animation: "fadeIn 0.3s ease-in-out",
                    }}
                >
                    {filteredFiles.map((file) => (
                        <button
                            key={file.id}
                            className={`flex w-full justify-start rounded-md p-2 transition-all hover:bg-blue-100 ${
                                file.id === currentFile.id ? "bg-blue-200" : ""
                            }`}
                            onClick={() => setCurrentFile(file)}
                            style={{
                                animation: "slideIn 0.3s ease-in-out",
                            }}
                        >
                            {file.name}
                        </button>
                    ))}
                    {filteredFiles.length === 0 && (
                        <p
                            className="text-gray-500"
                            style={{ animation: "fadeIn 0.3s ease-in-out" }}
                        >
                            No files found
                        </p>
                    )}
                </div>
            )}

            <FileSystem />

            <button
                className="flex w-full justify-start rounded-md p-2 transition-all hover:bg-darkHover"
                onClick={handleOpenFile}
            >
                <TbFileUpload className="mr-2" size={24} />
                Open File
            </button>
            <button
                className="flex w-full justify-start rounded-md p-2 transition-all hover:bg-darkHover"
                onClick={downloadCurrentFile}
            >
                <LuDownload className="mr-2" size={22} /> Download File
            </button>
            <button
                className="flex w-full justify-start rounded-md p-2 transition-all hover:bg-darkHover"
                onClick={downloadAllFiles}
            >
                <BiArchiveIn className="mr-2" size={22} /> Download All Files
            </button>

            {/* Input to choose and open file */}
            <input
                type="file"
                hidden
                onChange={onFileChange}
                ref={fileInputRef}
                accept={allowedFileExtensions}
            />
        </div>
    )
}

export default FilesTab
    
