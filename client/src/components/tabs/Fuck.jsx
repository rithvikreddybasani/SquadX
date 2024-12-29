import React, { useState } from "react";
import { Button, Box, Typography, List, ListItem } from "@mui/material";
import * as acorn from "acorn";  // Correct Acorn import

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
      <Typography variant="h4" sx={{
        marginBottom: "20px",
        textAlign: "center",
        fontWeight: "bold",
        color: "white",
      }}>
        CodeParser
      </Typography>

      {/* Text Area for Code Editor */}
      <textarea
        value={code}
        onChange={handleEditorChange}
        style={{
          width: "60%",  // Set width to 60% to avoid occupying full width
          height: "300px",
          padding: "15px",
          marginBottom: "20px",  // Add margin at the bottom
          fontFamily: "monospace",
          color: "white",  
          backgroundColor: "#444444",  
          fontSize: "16px",
          borderRadius: "8px",  // Rounded corners
          border: "1px solid #666666",  
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",  // Slight shadow for better depth
          resize: "none",  // Disable resizing
        }}
      />

      {/* Centered Button */}
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
          backgroundColor: "#3f51b5",  // Custom button color
          ":hover": {
            backgroundColor: "#303f9f",  // Hover effect with darker button color
          }
        }}
        onClick={handleParseCode}
      >
        Parse Code
      </Button>

      {/* Display Extracted Info at Bottom */}
      <Box sx={{ marginTop: "30px", width: "60%" }}>
        {parsedInfo.functions.length > 0 && (
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>Functions:</Typography>
            <List>
              {parsedInfo.functions.map((func, index) => (
                <ListItem key={index} sx={{ color: "white" }}>{func}</ListItem>
              ))}
            </List>
          </Box>
        )}

        {parsedInfo.arrowFunctions.length > 0 && (
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>Arrow Functions:</Typography>
            <List>
              {parsedInfo.arrowFunctions.map((func, index) => (
                <ListItem key={index} sx={{ color: "white" }}>{func}</ListItem>
              ))}
            </List>
          </Box>
        )}

        {parsedInfo.variables.length > 0 && (
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>Variables:</Typography>
            <List>
              {parsedInfo.variables.map((variable, index) => (
                <ListItem key={index} sx={{ color: "white" }}>{variable}</ListItem>
              ))}
            </List>
          </Box>
        )}

        {parsedInfo.constants.length > 0 && (
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>Constants:</Typography>
            <List>
              {parsedInfo.constants.map((constant, index) => (
                <ListItem key={index} sx={{ color: "white" }}>{constant}</ListItem>
              ))}
            </List>
          </Box>
        )}

        {parsedInfo.letVariables.length > 0 && (
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>Let Variables:</Typography>
            <List>
              {parsedInfo.letVariables.map((letVar, index) => (
                <ListItem key={index} sx={{ color: "white" }}>{letVar}</ListItem>
              ))}
            </List>
          </Box>
        )}

        {parsedInfo.imports.length > 0 && (
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>Imports:</Typography>
            <List>
              {parsedInfo.imports.map((imported, index) => (
                <ListItem key={index} sx={{ color: "white" }}>{imported}</ListItem>
              ))}
            </List>
          </Box>
        )}

        {parsedInfo.classes.length > 0 && (
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>Classes:</Typography>
            <List>
              {parsedInfo.classes.map((cls, index) => (
                <ListItem key={index} sx={{ color: "white" }}>{cls}</ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CodeEditor;
