import Users from "@/components/common/Users"
import useAppContext from "@/hooks/useAppContext"
import useSocket from "@/hooks/useSocket"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import UserStatus from "@/utils/status"
import toast from "react-hot-toast"
import { GoSignOut } from "react-icons/go"
import { IoShareOutline } from "react-icons/io5"
import { LuCopy } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Button, Box, Typography, TextField } from "@mui/material";
//import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "regenerator-runtime/runtime";


const Dictaphone = () => {
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition,
    } = useSpeechRecognition();
  
    if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn't support speech recognition.</span>;
    }
  
    return (
      <div style={{ padding: "20px", marginTop: "50px" }}>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <button onClick={SpeechRecognition.startListening}>Start</button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p>
      </div>
    );
  };

function UsersTab() {
    const navigate = useNavigate()
    const { tabHeight } = useWindowDimensions()
    const { setStatus } = useAppContext()
    const { socket } = useSocket()

    const copyURL = async () => {
        const url = window.location.href
        try {
            await navigator.clipboard.writeText(url)
            toast.success("URL copied to clipboard")
        } catch (error) {
            toast.error("Unable to copy URL to clipboard")
            console.log(error)
        }
    }

    const shareURL = async () => {
        const url = window.location.href
        try {
            await navigator.share({ url })
        } catch (error) {
            toast.error("Unable to share URL")
            console.log(error)
        }
    }

    const leaveRoom = () => {
        socket.disconnect()
        setStatus(UserStatus.DISCONNECTED)
        navigate("/", {
            replace: true,
        })
    }

    const { status, startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({ screen: true });
    
      const handleDownload = () => {
        if (mediaBlobUrl) {
          const link = document.createElement("a");
          link.href = mediaBlobUrl;
          link.download = "screen-recording.mp4";
          link.click();
        } else {
          alert("No recording available to download!");
        }
      };

    return (
        
        <div className="flex flex-col p-4" style={{ height: tabHeight }}>
            <h1 className="tab-title">Users</h1>
            {/* List of connected users */}
            <Users />
            <div className="flex flex-col items-center gap-4 pt-4">
                <div className="flex w-full gap-4">
                    {/* Share URL button */}
                    <button
                        className="flex flex-grow items-center justify-center rounded-md bg-white p-3 text-black"
                        onClick={shareURL}
                        title="Share Link"
                    >
                        <IoShareOutline size={26} />
                    </button>
                    {/* Copy URL button */}
                    <button
                        className="flex flex-grow items-center justify-center rounded-md bg-white p-3 text-black"
                        onClick={copyURL}
                        title="Copy Link"
                    >
                        <LuCopy size={22} />
                    </button>
                    {/* Leave room button */}
                    <button
                        className="flex flex-grow items-center justify-center rounded-md bg-red-600 p-3 text-black"
                        onClick={leaveRoom}
                        title="Leave room"
                    >
                        <GoSignOut size={22} />
                    </button>
                </div>
            </div>
            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Status: <span style={{ color: "#3f51b5" }}>{status}</span>
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={startRecording}
          sx={{ margin: "5px", textTransform: "none" }}
        >
          Start Recording
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={stopRecording}
          sx={{ margin: "5px", textTransform: "none" }}
        >
          Stop Recording
        </Button>
      </Box>
      {mediaBlobUrl && (
        <Box
          sx={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ marginBottom: "10px" }}>
            Preview:
          </Typography>
          <video
            src={mediaBlobUrl}
            controls
            autoPlay
            loop
            style={{
              width: "300px",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleDownload}
            sx={{
              marginTop: "10px",
              textTransform: "none",
            }}
          >
            Download Video
          </Button>
        </Box>
      )}
    
    </Box>
        </div>
    )
}

export default UsersTab
