import React from "react";
import styled from "styled-components";
import { FaWindowClose, FaBars } from "react-icons/fa";
import { useAppContext } from "../AppContext";

const HeaderWrapper = styled.header`
  background-color: #fff;
  color: white;
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);

`;

const StyledSpan = styled.span`
  cursor: pointer;
  font-size: 20px;
  color: #252525;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  background-color: #4169E1;
  color: white;
  font-family: "Aquire";
  border: none;
  border-radius: 4px;
  padding: 9px 10px;
  margin-left: 15px;
  cursor: pointer;
`;

const Header = () => {
  const { isSidebarShrunk, handleSidebarClick } =
    useAppContext();


  return (
    <HeaderWrapper>
      <StyledSpan onClick={() => handleSidebarClick()}>
        {isSidebarShrunk ? <FaWindowClose size={20} /> : <FaBars size={20} />}
      </StyledSpan>
      <ButtonWrapper>
        <Button onClick={() => console.log("Master Board clicked")}>
          Master Board
        </Button>
        <Button onClick={() => console.log("Dashboard clicked")}>
          Dashboard
        </Button>
      </ButtonWrapper>
    </HeaderWrapper>
  );
};

export default Header;
