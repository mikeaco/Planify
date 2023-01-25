import NavBar from "./NavBar";
import { ProSidebarProvider } from 'react-pro-sidebar';



function HomePage() {
  return (
    <ProSidebarProvider>
      <NavBar />
    </ProSidebarProvider>
  );
}

export default HomePage;
