import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD0U2FziHXVhI1yrLqfaxlElatWYkduJns",
  authDomain: "ai-notes-58a2c.firebaseapp.com",
  projectId: "ai-notes-58a2c",
  storageBucket: "ai-notes-58a2c.appspot.com",
  messagingSenderId: "757417908275",
  appId: "1:757417908275:web:c5658d9800497c70232b46",
};

const firebaseApp = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App firebaseApp={firebaseApp} />
  </React.StrictMode>
);
