import useAppContext from "@/hooks/useAppContext";
import useFileSystem from "@/hooks/useFileSystem";
import usePageEvents from "@/hooks/usePageEvents";
import useSetting from "@/hooks/useSetting";
import useSocket from "@/hooks/useSocket";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import useTypingIndicator from "@/hooks/useTypingIndicator";
import { editorThemes } from "@/resources/Themes";
import ACTIONS from "@/utils/actions";
import placeholder from "@/utils/editorPlaceholder";
import { color } from "@uiw/codemirror-extensions-color";
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { cursorTooltipBaseTheme, tooltipField } from "./tooltip";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API setup
const genAI = new GoogleGenerativeAI("AIzaSyAVzZjFB6WWgIVET8eHKyebwGMHLqQNyh0"); // Replace with your real API key

async function getAIResponse(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

function Editor() {
    const { users, currentUser } = useAppContext();
    const { currentFile, setCurrentFile } = useFileSystem();
    const { theme, language, fontSize } = useSetting();
    const { socket } = useSocket();
    const [aiTimeout, setAiTimeout] = useState(null);
    const { tabHeight } = useWindowDimensions();
    const [timeOut, setTimeOut] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);

    const typingMessage = useTypingIndicator();

    const filteredUsers = users.filter(
        (u) => u.username !== currentUser.username
    );

   // const [aiTimeout, setAiTimeout] = useState(null); // Add this to component state

  // const [aiTimeout, setAiTimeout] = useState(null); // In state

   const onCodeChange = (code, view) => {
       const file = { ...currentFile, content: code };
       setCurrentFile(file);
       socket.emit(ACTIONS.FILE_UPDATED, { file });
   
       const cursorPosition = view.state?.selection?.main?.head;
       socket.emit(ACTIONS.TYPING_START, {
           username: currentUser.username,
           cursorPosition,
       });
   
       clearTimeout(timeOut);
       const newTimeOut = setTimeout(() => {
           socket.emit(ACTIONS.TYPING_PAUSE, {
               username: currentUser.username,
           });
       }, 1000);
       setTimeOut(newTimeOut);
   
       // Elina Trigger Logic
       const lines = code.split("\n");
       const lastLine = lines[lines.length - 1];
       const trimmed = lastLine.trim();
   
       if (trimmed.startsWith("@ai")) {
           clearTimeout(aiTimeout); // reset debounce
   
           const prompt = trimmed.replace("@ai", "").trim();
           if (prompt.length > 0) {
               const timeout = setTimeout(async () => {
                   toast.loading("AI is thinking...", { id: "ai-thinking" });
   
                   try {
                       const aiResponse = await getAIResponse(prompt);
                       toast.success("AI has responded!", { id: "ai-thinking" });
   
                       // Replace the @elina line with a block comment and response
                       const newLines = [...lines];
                       newLines[newLines.length - 1] = `/* Your Question: ${prompt} */`;
                       newLines.push(`/*  Answer: ${aiResponse} */`);
   
                       const updatedContent = newLines.join("\n");
                       const updatedFile = { ...currentFile, content: updatedContent };
                       setCurrentFile(updatedFile);
                   } catch (err) {
                       console.error(err);
                       toast.error(" Failed to respond", { id: "ai-thinking" });
                   }
               }, 2000); // Debounce delay
   
               setAiTimeout(timeout);
           }
       }
   };
   
    
    usePageEvents();

    const getExtensions = useMemo(() => {
        const extensions = [
            color,
            hyperLink,
            tooltipField(filteredUsers),
            cursorTooltipBaseTheme,
        ];
        const langExt = loadLanguage(language.toLowerCase());
        if (langExt) {
            extensions.push(langExt);
        } else {
            toast.error("Syntax Highlighting not available for this language", {
                duration: 4000,
            });
        }
        return extensions;
    }, [language, currentFile?.name]);

    useEffect(() => {
        if (!isTimerActive) return;
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isTimerActive]);

    useEffect(() => {
        setIsTimerActive(true);
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    return (
        <>
            <CodeMirror
                placeholder={placeholder(currentFile.name)}
                theme={editorThemes[theme]}
                onChange={onCodeChange}
                value={currentFile.content}
                extensions={getExtensions}
                minHeight="100%"
                maxWidth="100vw"
                style={{
                    fontSize: fontSize + "px",
                    height: tabHeight,
                    position: "relative",
                }}
            />
            {typingMessage && (
                <p
                    style={{
                        position: "fixed",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#000",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "5px",
                        fontSize: "14px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {typingMessage}
                </p>
            )}
            {/* Optional: Display session timer */}
            <p
                style={{
                    position: "fixed",
                    bottom: "10px",
                    right: "10px",
                    backgroundColor: "#333",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                }}
            >
                Session Time: {formatTime(timer)}
            </p>
        </>
    );
}

export default Editor;
