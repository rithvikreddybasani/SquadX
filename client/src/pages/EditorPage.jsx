import React, { useState, useEffect } from "react";
import SplitterComponent from "../components/SplitterComponent";
import ConnectionStatusPage from "../components/connection/ConnectionStatusPage";
import EditorComponent from "../components/editor/EditorComponent";
import Sidebar from "../components/sidebar/Sidebar";
import useAppContext from "../hooks/useAppContext";
import useFullScreen from "../hooks/useFullScreen";
import useSocket from "../hooks/useSocket";
import useUserActivity from "../hooks/useUserActivity";
import ACTIONS from "../utils/actions";
import UserStatus from "../utils/status";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function EditorPage() {
    const [showIntro, setShowIntro] = useState(true);
    const [animationPhase, setAnimationPhase] = useState(1);

    // Listen to user online/offline status
    useUserActivity();
    // Enable fullscreen mode
    useFullScreen();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { status, setCurrentUser, currentUser } = useAppContext();
    const { socket } = useSocket();
    const location = useLocation();

    useEffect(() => {
        if (currentUser.username.length > 0) return;
        const username = location.state?.username;
        if (!username) {
            navigate("/", { state: { roomId } });
        } else {
            const user = { username, roomId };
            setCurrentUser(user);
            socket.emit(ACTIONS.JOIN_REQUEST, user);
        }
    }, [
        currentUser.username,
        location.state?.username,
        navigate,
        roomId,
        setCurrentUser,
        socket,
    ]);

    useEffect(() => {
        const timer1 = setTimeout(() => setAnimationPhase(2), 1000);
        const timer2 = setTimeout(() => setAnimationPhase(3), 2000);
        const timer3 = setTimeout(() => setShowIntro(false), 4000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    if (showIntro) {
        return (
            <div className="screen-container">
                <div className={`intro-screen phase-${animationPhase}`}>
                    <div className="particles">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="particle" />
                        ))}
                    </div>

                    <div className="logo-container">
                        <div className="logo-circle" />
                        <h1 className="title">
                            <span className="text-gradient">DevSync</span>
                        </h1>
                        <h2 className="subtitle">Entering Room</h2>
                    </div>

                    <div className="loading-bar">
                        <div className="loading-progress" />
                    </div>
                </div>
            </div>
        );
    }

    if (status === UserStatus.CONNECTION_FAILED) {
        return <ConnectionStatusPage />;
    }

    return (
        <SplitterComponent>
            <Sidebar />
            <EditorComponent />
        </SplitterComponent>
    );
}

export default EditorPage;
