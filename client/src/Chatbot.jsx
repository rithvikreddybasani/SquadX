import React, { useState } from "react";
import stringSimilarity from "string-similarity"; // Import string-similarity for matching
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [visibleQuestions, setVisibleQuestions] = useState(3);
  const [userInput, setUserInput] = useState("");
  const [isVisible, setIsVisible] = useState(true); // State for visibility

  const predefinedQuestions = [
    "What is your name?",
    "How can I contact support?",
    "What services do you provide?",
    "How can I reset my password?",
    "What are your working hours?",
    "Where are you located?",
    "How do I subscribe to your services?",
    "Do you offer discounts?",
    "Can I cancel my subscription anytime?",
    "What payment methods do you accept?",
    "Is there a free trial available?",
    "How can I update my account details?",
    "What happens if I forget my username?",
    "How can I deactivate my account?",
  ];

  const responses = {
    "What is your name?": "I am your friendly chatbot!",
    "How can I contact support?": "You can contact support at support@example.com.",
    "What services do you provide?": "We provide a variety of services including customer support, product information, and more.",
    "How can I reset my password?": "To reset your password, go to the settings page and click 'Reset Password'.",
    "What are your working hours?": "Our working hours are from 9 AM to 6 PM, Monday to Friday.",
    "Where are you located?": "We are located at 123 Main Street, Anytown, USA.",
    "How do I subscribe to your services?": "You can subscribe by visiting our website and clicking on 'Subscribe Now'.",
    "Do you offer discounts?": "Yes, we offer seasonal discounts. Check our website for ongoing offers.",
    "Can I cancel my subscription anytime?": "Yes, you can cancel your subscription at any time from your account settings.",
    "What payment methods do you accept?": "We accept credit cards, debit cards, and PayPal.",
    "Is there a free trial available?": "Yes, we offer a 14-day free trial for new users.",
    "How can I update my account details?": "You can update your account details in the 'My Account' section.",
    "What happens if I forget my username?": "If you forget your username, click on 'Forgot Username' on the login page to retrieve it.",
    "How can I deactivate my account?": "To deactivate your account, please contact our support team at support@example.com.",
  };

  const handleQuestionClick = (question) => {
    const response = getResponse(question);
    setMessages((prev) => [...prev, { type: "user", text: question }, { type: "bot", text: response }]);
  };

  const handleUserInput = () => {
    if (userInput.trim() === "") return;

    const response = getResponse(userInput);
    setMessages((prev) => [...prev, { type: "user", text: userInput }, { type: "bot", text: response }]);
    setUserInput(""); // Clear the input field
  };

  const getResponse = (userQuestion) => {
    const bestMatch = stringSimilarity.findBestMatch(userQuestion, predefinedQuestions);
    const closestQuestion = bestMatch.bestMatch.target;
    const similarityScore = bestMatch.bestMatch.rating;

    // If similarity score is above a threshold, return the matched response
    if (similarityScore > 0.5) {
      return responses[closestQuestion];
    } else {
      return "I'm sorry, I don't have an answer for that.";
    }
  };

  const closeChatbot = () => {
    setIsVisible(false); // Hide the chatbot
  };

  if (!isVisible) return null; // If the chatbot is not visible, render nothing

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        Elina
        <button className="close-button" onClick={closeChatbot}>X</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatbot-message ${msg.type === "user" ? "user-message" : "bot-message"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a question..."
          className="chatbot-text-input"
        />
        <button onClick={handleUserInput} className="send-button">
          Send
        </button>
      </div>
      <div className="chatbot-questions">
        {predefinedQuestions.slice(0, visibleQuestions).map((question, index) => (
          <button
            key={index}
            className="question-button"
            onClick={() => handleQuestionClick(question)}
          >
            {question}
          </button>
        ))}
        {visibleQuestions < predefinedQuestions.length && (
          <button
            className="load-more-button"
            onClick={() => setVisibleQuestions((prev) => prev + 3)}
          >
            Load More Questions
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
