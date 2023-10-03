import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const tabs = [
  {
    title: "summary",
    image: "/summary.png", // Replace with actual image path
  },
  {
    title: "timing",
    image: "/timing.png", // Replace with actual image path
  },
  {
    title: "design",
    image: "/sketch.png", // Replace with actual image path
  },
  {
    title: "power",
    image: "/power.png", // Replace with actual image path
  },
  {
    title: "flow",
    image: "/diagram.png", // Replace with actual image path
  }
];

export const AppProvider = ({ children }) => {
  const [isSidebarShrunk, setIsSidebarShrunk] = useState(true);


  const handleSidebarClick = () => {
    setIsSidebarShrunk(!isSidebarShrunk);
  };




  const contextValue = {
    isSidebarShrunk,
    tabs,
    handleSidebarClick,
    
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
