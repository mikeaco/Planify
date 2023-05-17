import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { getAuth, signOut } from "firebase/auth";
import app from "./firebaseconfig";

const NavTitle = styled.h1`
  font-weight: 400;
  font-size: 34px;
  color: #bcb1b1;
  margin: 0;
  padding: 10px 20px;
  display: flex;
  align-items: center;
`;

const SidebarWrapper = styled.div`
  height: 100vh;
  display: flex;
`;

const SidebarContent = styled.div`
  background-color: #332e2e;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const NavBar = () => {
  const auth = getAuth(app);
    const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Perform any additional actions after successful logout
      navigate("/login")

    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <SidebarWrapper>
      <Sidebar>
        <SidebarContent>
          <div>
            <NavTitle>Planify</NavTitle>
            <Menu
              menuItemStyles={{
                button: ({ level, active, disabled }) => {
                  if (level === 0) {
                    return {
                      color: disabled ? "#f5d9ff" : "#ffffff",
                      backgroundColor: active ? "#eecef9" : undefined,
                      ":hover": { backgroundColor: "#8f9094" },
                    };
                  }
                },
              }}
            >
              <MenuItem component={<Link to="/" />}>Home</MenuItem>
              <MenuItem component={<Link to="/account" />}>My Account</MenuItem>
            </Menu>
          </div>
          <div>
            <Menu
              menuItemStyles={{
                button: ({ level, active, disabled }) => {
                  if (level === 0) {
                    return {
                      color: disabled ? "#f5d9ff" : "#ffffff",
                      backgroundColor: active ? "#eecef9" : undefined,
                      ":hover": { backgroundColor: "#8f9094" },
                    };
                  }
                },
              }}
            >
              <MenuItem onClick={handleLogout} to="/login">
                Log Out
              </MenuItem>
            </Menu>
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarWrapper>
  );
};

export default NavBar;
