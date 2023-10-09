import React from "react";
import "./App.css";
import MainHome from "./components/MainHome";
import { ThemeProvider } from '@mui/material/styles';
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
