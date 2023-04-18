import NavBar from "./NavBar";
import { ProSidebarProvider } from 'react-pro-sidebar';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

function HomePage() {
  return (
    <Container>
        <ProSidebarProvider>
          <NavBar />
        </ProSidebarProvider>
      <div style={{fontSize:'36px'}}>Projects</div>
    </Container>
  );
}

export default HomePage;