import React from "react";
import "./App.css";
import MainHome from "./components/MainHome";
import { AppProvider } from "./AppContext";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <MainHome />
      </AppProvider>
    </div>
  );
}

export default App;
