import React, { useState } from "react";
import { Button, Box, Typography, List, ListItem } from "@mui/material";
import * as acorn from "acorn"; // Correct Acorn import
import { motion } from "framer-motion"; // For animations

// Acorn Parsing Logic
const extractInfo = (jsCode) => {
  const ast = acorn.parse(jsCode, {
    ecmaVersion: 2020,
    sourceType: "module",
  });

  let functions = [];
  let variables = [];
  let constants = [];
  let letVariables = [];
  let imports = [];
  let classes = [];
  let arrowFunctions = [];

  function traverseNode(node) {
    if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
      if (node.type === "ArrowFunctionExpression") {
        arrowFunctions.push(node.id ? node.id.name : "Anonymous Arrow Function");
      } else {
        functions.push(node.id ? node.id.name : "Anonymous Function");
      }
    }

    if (node.type === "VariableDeclaration") {
      node.declarations.forEach(declaration => {
        const name = declaration.id.name;
        if (node.kind === "const") {
          constants.push(name);
        } else if (node.kind === "let") {
          letVariables.push(name);
        } else {
          variables.push(name);
        }
      });
    }

    if (node.type === "ImportDeclaration") {
      imports.push(node.source.value);
    }

    if (node.type === "ClassDeclaration") {
      classes.push(node.id ? node.id.name : "Anonymous Class");
    }
  }

  function traverse(ast) {
    ast.body.forEach(node => {
      traverseNode(node);
      if (node.body) traverse(node.body);
    });
  }

  traverse(ast);

  return { functions, variables, constants, letVariables, imports, classes, arrowFunctions };
};

const CodeEditor = () => {
  const [code, setCode] = useState("// Write your JavaScript code here...");
  const [parsedInfo, setParsedInfo] = useState({
    functions: [],
    variables: [],
    constants: [],
    letVariables: [],
    imports: [],
    classes: [],
    arrowFunctions: [],
  });

  const handleParseCode = () => {
    const info = extractInfo(code);
    setParsedInfo(info);
  };

  const handleEditorChange = (event) => {
    setCode(event.target.value);
  };

  return (
    <Box sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      zIndex: 1000,
      backgroundColor: "#2e2e2e",
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h4" sx={{
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold",
          color: "white",
        }}>
          CodeParser
        </Typography>
      </motion.div>

      {/* Text Area for Code Editor */}
      <motion.textarea
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        value={code}
        onChange={handleEditorChange}
        style={{
          width: "60%",
          height: "300px",
          padding: "15px",
          marginBottom: "20px",
          fontFamily: "monospace",
          color: "white",
          backgroundColor: "#444444",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #666666",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          resize: "none",
        }}
      />

      {/* Centered Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: "20px",
            alignSelf: "center",
            zIndex: 20,
            fontSize: "16px",
            fontWeight: "bold",
            padding: "10px 20px",
            backgroundColor: "#3f51b5",
            ":hover": {
              backgroundColor: "#303f9f",
            }
          }}
          onClick={handleParseCode}
        >
          Parse Code
        </Button>
      </motion.div>

      {/* Display Extracted Info at Bottom */}
      <Box sx={{ marginTop: "30px", width: "60%" }}>
        {Object.entries(parsedInfo).map(([key, values]) => (
          values.length > 0 && (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: "20px" }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </Typography>
              <List>
                {values.map((value, index) => (
                  <ListItem key={index} sx={{ color: "white" }}>
                    {value}
                  </ListItem>
                ))}
              </List>
            </motion.div>
          )
        ))}
      </Box>
    </Box>
  );
};

export default CodeEditor;