import { useEffect, useRef, useState } from "react"
import { FaPoll } from "react-icons/fa"
import { db } from "./firebase"
import { collection, addDoc, onSnapshot, doc, updateDoc } from "firebase/firestore"
import useChatRoom from "@/hooks/useChatRoom"
import useAppContext from "@/hooks/useAppContext"
import { Modal } from "@mui/material"

function ChatList() {
    const {
        messages,
        isNewMessage,
        setIsNewMessage,
        lastScrollHeight,
        setLastScrollHeight,
    } = useChatRoom()
    const { currentUser } = useAppContext()
    const messagesContainerRef = useRef(null)

    const [showPoll, setShowPoll] = useState(false)
    const [questions, setQuestions] = useState([])
    const [newQuestion, setNewQuestion] = useState("")
    const [newOptions, setNewOptions] = useState("")

    useEffect(() => {
        messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight
    }, [messages])

    useEffect(() => {
        if (isNewMessage) {
            setIsNewMessage(false)
        }
        messagesContainerRef.current.scrollTop = lastScrollHeight
    }, [isNewMessage, setIsNewMessage, lastScrollHeight])

    useEffect(() => {
        const questionsRef = collection(db, "questions")
        const unsubscribe = onSnapshot(questionsRef, (snapshot) => {
            const questionsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setQuestions(questionsData)
        })
        return () => unsubscribe()
    }, [])

    const handleAddQuestion = async () => {
        if (newQuestion.trim() === "" || newOptions.trim() === "") return

        const optionsArray = newOptions
            .split(",")
            .map((option) => option.trim())
            .filter((option) => option !== "")

        if (optionsArray.length === 0) return

        const optionsWithVotes = optionsArray.reduce((acc, option) => {
            acc[option] = 0
            return acc
        }, {})

        await addDoc(collection(db, "questions"), {
            text: newQuestion,
            options: optionsWithVotes,
            createdAt: new Date(),
        })

        setNewQuestion("")
        setNewOptions("")
    }

    const handleVote = async (questionId, option) => {
        const questionRef = doc(db, "questions", questionId)
        const question = questions.find((q) => q.id === questionId)

        await updateDoc(questionRef, {
            [`options.${option}`]: question.options[option] + 1,
        })
    }

    return (
        <div className="flex flex-col flex-grow overflow-auto rounded-md bg-darkHover p-2 relative">
            {/* Icon Button to Open Poll Modal */}
            <button
                className="absolute top-2 right-2 text-white bg-gray-700 p-2 rounded-full hover:bg-gray-500 transition"
                onClick={() => setShowPoll(true)}
            >
                <FaPoll size={20} />
            </button>

            {/* Chat Messages */}
            <div
                className="flex-grow overflow-auto"
                ref={messagesContainerRef}
                onScroll={(e) => setLastScrollHeight(e.target.scrollTop)}
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={
                            "mb-2 w-[80%] self-end break-words rounded-md bg-dark px-3 py-2" +
                            (message.username === currentUser.username ? " ml-auto " : "")
                        }
                    >
                        <div className="flex justify-between">
                            <span className="text-xs text-red-600">{message.username}</span>
                            <span className="text-xs text-white">{message.timestamp}</span>
                        </div>
                        <p className="py-1">{message.message}</p>
                    </div>
                ))}
            </div>

            {/* Poll Modal */}
            <Modal
                open={showPoll}
                onClose={() => {}}
                aria-labelledby="poll-modal"
                className="flex items-center justify-center"
            >
                <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-auto">
                    <h3 className="text-white text-lg mb-2">Create a Poll</h3>
                    <input
                        type="text"
                        placeholder="Enter a question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Enter options (comma-separated)"
                        value={newOptions}
                        onChange={(e) => setNewOptions(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                    />
                    <button
                        onClick={handleAddQuestion}
                        className="w-full p-2 rounded bg-blue-500 text-white hover:bg-blue-700"
                    >
                        Add Poll
                    </button>

                    <h3 className="text-white text-lg mt-4">Active Polls</h3>
                    <div className="max-h-60 overflow-y-auto">
                        {questions.length === 0 ? (
                            <p className="text-gray-300">No polls available</p>
                        ) : (
                            questions.map((question) => (
                                <div key={question.id} className="p-3 bg-gray-800 rounded-md mt-2">
                                    <p className="text-white">{question.text}</p>
                                    {Object.entries(question.options || {}).map(([option, votes]) => (
                                        <button
                                            key={option}
                                            onClick={() => handleVote(question.id, option)}
                                            className="w-full mt-1 p-2 rounded bg-green-600 text-white hover:bg-green-700"
                                        >
                                            {option} ({votes} votes)
                                        </button>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setShowPoll(false)}
                        className="w-full mt-4 p-2 rounded bg-red-500 text-white hover:bg-red-700"
                    >
                        Close Poll
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default ChatList
