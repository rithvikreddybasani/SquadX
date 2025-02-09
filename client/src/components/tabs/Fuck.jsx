import React, { useState } from "react";
import Groq from "groq-sdk";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const Fuck = () => {
  const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function getGroqChatCompletion(code) {
    return groq.chat.completions.create({
      messages: [{ role: "user", content: code }],
      model: "llama-3.3-70b-versatile",
    });
  }

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleAnalyzeClick = async () => {
    setLoading(true);
    try {
      const chatCompletion = await getGroqChatCompletion(code);
      setOutput(chatCompletion.choices[0]?.message?.content || "No response.");
    } catch (error) {
      console.error(error);
      setOutput("Error analyzing the code.");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "auto", // Makes the entire page scrollable
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        padding: 3,
      }}
    >
      {/* Header */}
      <Typography
        variant="h4" // Decreased size
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#fff", marginBottom: 3 }}
      >
        Code Analyzer 🔍
      </Typography>

      {/* Input and Output Section */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          gap: 3,
          flexDirection: { xs: "column", md: "row" }, // Responsive layout
        }}
      >
        {/* Code Input Section */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <TextField
            multiline
            rows={10} // Reduced rows for better spacing
            variant="outlined"
            fullWidth
            placeholder="Enter your code here..."
            value={code}
            onChange={handleCodeChange}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 1,
              fontSize: "0.9rem", // Reduced font size
              "& .MuiInputBase-input": { color: "#fff", fontSize: "0.9rem" },
            }}
          />
          <motion.div whileHover={{ scale: 1.05 }} style={{ marginTop: 12 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleAnalyzeClick}
              disabled={loading}
              sx={{
                padding: 1.2,
                fontSize: "0.9rem", // Reduced button text size
                fontWeight: "bold",
                background: "#ff9800",
                "&:hover": { background: "#e68900" },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Analyze Code"}
            </Button>
          </motion.div>
        </Box>

        {/* Output Section */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderRadius: 2,
            padding: 2,
            backdropFilter: "blur(5px)",
            overflowY: "auto",
            minHeight: "200px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff", marginBottom: 1.5 }}>
            Analysis Result:
          </Typography>
          <Typography
            variant="body2" // Reduced font size for better fit
            sx={{
              color: "#fff",
              fontSize: "0.9rem",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
            }}
          >
            {output}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Fuck;
