import { useEffect, useRef, useState } from "react"
import { FaPoll } from "react-icons/fa"
import { db } from "./firebase"
import {
    collection,
    addDoc,
    onSnapshot,
    doc,
    updateDoc,
} from "firebase/firestore"
import useChatRoom from "@/hooks/useChatRoom"
import useAppContext from "@/hooks/useAppContext"
import { Modal } from "@mui/material"
import toast from "react-hot-toast"

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

    // ✅ Auto scroll
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        if (isNewMessage) {
            setIsNewMessage(false)
        }
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = lastScrollHeight
        }
    }, [isNewMessage, setIsNewMessage, lastScrollHeight])

    // ✅ Firestore real-time listener
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

    // ✅ Add Poll
    const handleAddQuestion = async () => {
        if (!newQuestion.trim() || !newOptions.trim()) return

        const optionsArray = newOptions
            .split(",")
            .map((o) => o.trim())
            .filter((o) => o !== "")

        if (optionsArray.length === 0) return

        const optionsWithVotes = {}

        optionsArray.forEach((option) => {
            optionsWithVotes[option] = {
                votes: 0,
                votedBy: [],
            }
        })

        await addDoc(collection(db, "questions"), {
            text: newQuestion,
            options: optionsWithVotes,
            createdAt: new Date(),
        })

        setNewQuestion("")
        setNewOptions("")
    }

    // ✅ Vote handler
    const handleVote = async (questionId, option) => {
        const question = questions.find((q) => q.id === questionId)
        if (!question) return

        const user = currentUser?.username
        if (!user) return

        const optionData = question.options?.[option]

        // 🚫 prevent multiple votes
        if (optionData?.votedBy?.includes(user)) {
            toast.error("You already voted")
            return
        }

        const questionRef = doc(db, "questions", questionId)

        await updateDoc(questionRef, {
            [`options.${option}.votes`]: (optionData?.votes || 0) + 1,
            [`options.${option}.votedBy`]: [
                ...(optionData?.votedBy || []),
                user,
            ],
        })
    }

    return (
        <div className="flex flex-col flex-grow overflow-auto rounded-md bg-darkHover p-2 relative">

            {/* Poll Button */}
            <button
                className="absolute top-2 right-2 text-white bg-gray-700 p-2 rounded-full hover:bg-gray-500"
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
                            "mb-2 w-[80%] break-words rounded-md bg-dark px-3 py-2 " +
                            (message.username === currentUser?.username
                                ? "ml-auto"
                                : "")
                        }
                    >
                        <div className="flex justify-between">
                            <span className="text-xs text-red-600">
                                {message.username}
                            </span>
                            <span className="text-xs text-white">
                                {message.timestamp}
                            </span>
                        </div>
                        <p className="py-1">{message.message}</p>
                    </div>
                ))}
            </div>

            {/* Poll Modal */}
            <Modal
                open={showPoll}
                onClose={() => setShowPoll(false)}
                className="flex items-center justify-center"
            >
                <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-auto">

                    <h3 className="text-white text-lg mb-2">Create a Poll</h3>

                    <input
                        type="text"
                        placeholder="Enter question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="w-full p-2 mb-2 bg-gray-800 text-white rounded"
                    />

                    <input
                        type="text"
                        placeholder="Options (comma separated)"
                        value={newOptions}
                        onChange={(e) => setNewOptions(e.target.value)}
                        className="w-full p-2 mb-2 bg-gray-800 text-white rounded"
                    />

                    <button
                        onClick={handleAddQuestion}
                        className="w-full p-2 bg-blue-500 rounded text-white"
                    >
                        Add Poll
                    </button>

                    <h3 className="text-white text-lg mt-4">Active Polls</h3>

                    <div className="max-h-60 overflow-y-auto">
                        {questions.length === 0 ? (
                            <p className="text-gray-300">No polls available</p>
                        ) : (
                            questions.map((question) => (
                                <div
                                    key={question.id}
                                    className="p-3 bg-gray-800 rounded mt-2"
                                >
                                    <p className="text-white">
                                        {question.text}
                                    </p>

                                    {Object.entries(
                                        question.options || {}
                                    ).map(([option, data]) => (
                                        <button
                                            key={option}
                                            onClick={() =>
                                                handleVote(
                                                    question.id,
                                                    option
                                                )
                                            }
                                            className="w-full mt-1 p-2 rounded bg-green-600 text-white"
                                        >
                                            {option} ({data?.votes || 0} votes)
                                        </button>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={() => setShowPoll(false)}
                        className="w-full mt-4 p-2 bg-red-500 rounded text-white"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default ChatList