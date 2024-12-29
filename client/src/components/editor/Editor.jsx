import useAppContext from "@/hooks/useAppContext";
import useFileSystem from "@/hooks/useFileSystem";
import usePageEvents from "@/hooks/usePageEvents";
import useSetting from "@/hooks/useSetting";
import useSocket from "@/hooks/useSocket";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import useTypingIndicator from "@/hooks/useTypingIndicator"; // Custom Hook for Typing Indicator
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

function Editor() {
    const { users, currentUser } = useAppContext();
    const { currentFile, setCurrentFile } = useFileSystem();
    const { theme, language, fontSize } = useSetting();
    const { socket } = useSocket();
    const { tabHeight } = useWindowDimensions();
    const [timeOut, setTimeOut] = useState(null);
    const [timer, setTimer] = useState(0); // Timer state to track session time
    const [isTimerActive, setIsTimerActive] = useState(false); // To control timer activation

    // Using the typing indicator hook
    const typingMessage = useTypingIndicator();

    const filteredUsers = users.filter(
        (u) => u.username !== currentUser.username,
    );

    const onCodeChange = (code, view) => {
        const file = { ...currentFile, content: code };
        setCurrentFile(file);
        socket.emit(ACTIONS.FILE_UPDATED, { file });

        const cursorPosition = view.state?.selection?.main?.head;
        socket.emit(ACTIONS.TYPING_START, { username: currentUser.username, cursorPosition });

        clearTimeout(timeOut);
        const newTimeOut = setTimeout(() => {
            socket.emit(ACTIONS.TYPING_PAUSE, { username: currentUser.username });
        }, 1000);
        setTimeOut(newTimeOut);
    };

    // Listen wheel event to zoom in/out and prevent page reload
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

    // Start the timer when the session begins
    useEffect(() => {
        if (!isTimerActive) return;

        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1); // Increment timer every second
        }, 1000);

        return () => clearInterval(interval); // Clean up the interval when the component unmounts or timer stops
    }, [isTimerActive]);

    // Start the timer when the component mounts (session starts)
    useEffect(() => {
        setIsTimerActive(true);
    }, []);

    // Format the timer in minutes and seconds (mm:ss)
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
                        top: "10px",  // Adjusts the distance from the top
                        right: "10px", // Adjusts the distance from the right
                        backgroundColor: "#000", // Set the background color
                        color: "#fff",  // Set the text color
                        padding: "10px",
                        borderRadius: "5px", // Optional: adds rounded corners to the alert
                        fontSize: "14px", // You can adjust this value to change font size
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: adds shadow for better visibility
                    }}
                >
                    {typingMessage}
                </p>
            )}
            {/* Timer Display */}
            
        </>
    );
}

export default Editor;
