import NavBar from "./NavBar";
import { ProSidebarProvider } from "react-pro-sidebar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const AccountPage = () => {
  return (
    <Container>
      <ProSidebarProvider>
        <NavBar />
      </ProSidebarProvider>
      <div style={{ fontSize: "36px" }}>My Account</div>
    </Container>
  );
}

export default AccountPage;
