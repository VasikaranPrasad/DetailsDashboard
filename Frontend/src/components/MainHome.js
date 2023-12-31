import React, { useState } from "react";
import styled from "styled-components";
import { ThemeProvider } from '@mui/material/styles';
// import { BrowserRouter, Route, Switch } from "react-router-dom"; // Import BrowserRouter and Route
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BootstrapTable from "../contents/BootstrapTable";
import { useAppContext } from "../AppContext"; // Import the AppProvider and useAppContext
import LNLtable from "../contents/LNLtable";
import CrossProbing from "../Displayfiles/CrossProbing";
import FileProcessor from "../Displayfiles/FileProcessor";
import FileVerification from "../Displayfiles/FileVerification";
import FileViewer from "../Displayfiles/FileViewer";
import GridExample from "../Displayfiles/GridExample";
import NewTabContent from "../Displayfiles/NewTabContent";
import DetailDashboard from "../Displayfiles/DetailDashboard";
import FileViewerRenderer from "../Displayfiles/FileViewerRenderer";
import DataGrid from "../Displayfiles/DataGrid"







const AppWrapper = styled.div`
  display: grid;
  grid-template-columns: ${({ isSidebarShrunk }) =>
    isSidebarShrunk ? "200px 1fr" : "55px 1fr"};
  // height: 100%;
  transition: grid-template-columns 0.4s ease;

  
  }
`;

const ContentWrapper = styled.div`
  padding: 1px;
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  padding: 0 0 5px 0; /* Add padding to create space between header and main content */
`;

const MainPage = () => {
  return <h1>hello world </h1>;
};

const Tab2Contents = () => {
  return <h1>tab2</h1>;
};
const Tab3Contents = () => {
  return <h1>tab3</h1>;
};
const Tab4Contents = () => {
  return <h1>flow</h1>;
};

const MainHome = () => {
  const { isSidebarShrunk } = useAppContext(); // Use the isSidebarShrunk value from context

  return (
    <AppWrapper isSidebarShrunk={isSidebarShrunk}>
      <Sidebar />

      <ContentWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>

        <Routes>
          <Route path="/summary" element={<BootstrapTable />} />
          <Route path="/timing" element={<MainPage />} />
          <Route path="/design" element={<Tab3Contents />} />
          <Route path="/power" element={<Tab2Contents />} />
          <Route path="/flow" element={<Tab4Contents />} />
          <Route path="/LNLtable" element={<LNLtable />} />
          <Route path="/crossprobing" element={<CrossProbing />} />
          <Route path="/fileprocessor" element={<FileProcessor />} />
          <Route path="/fileverify" element={<FileVerification />} />
          <Route path="/fileviewer" element={<FileViewer />} />
          <Route path="/grid" element={<GridExample />} />
          <Route path="/newtab" element={<NewTabContent />} />
          <Route path="/dd" element={<DetailDashboard />} />
          <Route path="/filerender" element={<FileViewerRenderer />} />
          <Route path="/dg" element={<DataGrid />} />





        </Routes>
      </ContentWrapper>
    </AppWrapper>
  );
};

export default MainHome;
