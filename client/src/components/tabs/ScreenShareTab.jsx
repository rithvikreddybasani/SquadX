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

function ScreenShareTab() {
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
    
  );
}

export default ScreenShareTab;
