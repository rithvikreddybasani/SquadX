import React, { useState, useEffect } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Toast from "./components/toast/Toast";
import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import PageNot from "./pages/PageNot";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MdContentCopy } from "react-icons/md";
import Chatbot from './Chatbot.jsx';
import {FaRobot, FaPlus, FaTrashAlt, FaRegFileCode, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const SUPPORTED_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "css",
  "html",
  "json",
  "sql",
  "bash",
  "markdown",
  "yaml",
  "xml",
  "rust",
  "go"
];

const CodeSnippet = ({ code, language = "javascript", onDelete, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCode, setNewCode] = useState(code);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    if (isEditing) {
      onEdit(newCode, selectedLanguage);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    onEdit(newCode, selectedLanguage);
    setIsEditing(false);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    onEdit(code, e.target.value);
  };

  return (
    <div className="snippet-container">
      <div className="snippet-header">
        <div className="snippet-actions">
          <button
            onClick={handleEdit}
            className="action-button edit"
            title={isEditing ? "Cancel" : "Edit"}
          >
            <FaEdit />
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="action-button save"
              title="Save"
            >
              <FaSave />
            </button>
          )}
          <button
            onClick={onDelete}
            className="action-button delete"
            title="Delete"
          >
            <FaTrashAlt />
          </button>
        </div>
        <select 
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="language-select"
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="snippet-content">
        {isEditing ? (
          <textarea
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="code-editor"
          />
        ) : (
          <SyntaxHighlighter
            language={selectedLanguage}
            style={dracula}
            customStyle={{
              margin: 0,
              borderRadius: '0 0 8px 8px',
              fontSize: '14px',
            }}
            showLineNumbers={true}
            wrapLines={true}
          >
            {code}
          </SyntaxHighlighter>
        )}
      </div>

      <button
        onClick={handleCopy}
        className={`copy-button ${copied ? 'copied' : ''}`}
        title="Copy to clipboard"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

// Update the editSnippet function in App component
const editSnippet = (index, newCode, newLanguage) => {
  const updatedSnippets = [...snippets];
  updatedSnippets[index] = {
    code: newCode,
    language: newLanguage || updatedSnippets[index].language
  };
  setSnippets(updatedSnippets);
};

function App() {
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [snippets, setSnippets] = useState([
    {
      code: `const greet = (name) => {
  return 'Hello ' + name + '!';
};

console.log(greet('World'));`,
      language: "javascript"
    },
  ]);

  const addSnippet = () => {
    const newSnippet = { code: `// New snippet`, language: "javascript" };
    setSnippets((prevSnippets) => [...prevSnippets, newSnippet]);
  };
  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };
  const deleteSnippet = (index) => {
    setSnippets((prevSnippets) => prevSnippets.filter((_, i) => i !== index));
  };

  const editSnippet = (index, newCode) => {
    const updatedSnippets = [...snippets];
    updatedSnippets[index].code = newCode;
    setSnippets(updatedSnippets);
  };

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
          <Route path="*" element={<PageNot />} />
        </Routes>
      </BrowserRouter>
      <Toast />

      <div>
  <button
    onClick={toggleChatbot}
    className=" chatbot-toggle-button"
    title="Toggle Chatbot"
  >
    <FaRobot size={33} />
  </button>
  {isChatbotOpen && (
    <div className="chatbot-wrapper">
      <Chatbot />
    </div>
  )}
</div>

      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="floating-button"
        title="Open Code Snippets"
      >
        <MdContentCopy />
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h1>Code Snippets</h1>
              <button
                onClick={() => setIsModalOpen(false)}
                className="close-button"
                title="Close"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="snippets-container">
              {snippets.map((snippet, index) => (
                <CodeSnippet
                  key={index}
                  code={snippet.code}
                  language={snippet.language}
                  onDelete={() => deleteSnippet(index)}
                  onEdit={(newCode) => editSnippet(index, newCode)}
                />
              ))}
            </div>
            
            <button
              onClick={addSnippet}
              className="add-snippet-button"
              title="Add New Snippet"
            >
              <FaPlus /> Add Snippet
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
