import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
// import AccountPage from "./components/AccountPage";
import NewProjectPage from "./components/NewProjectPage";
import ProjectDetailsPage from "./components/ProjectDetailsPage";
import AddTaskPage from "./components/AddTaskPage";
import app from "./components/firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

const PrivateRoute = ({ children, ...rest }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking the authentication state
  }

  if (!user) {
    return <Navigate to="/login" />; // Redirect to the login page if the user is not logged in
  }

  return (
    <Routes>
      <Route {...rest}>{children}</Route>
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Route index element={<HomePage />} />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        {/* <Route
          path="/account/*"
          element={
            <PrivateRoute>
              <Route index element={<AccountPage />} />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/new-project"
          element={
            <PrivateRoute>
              <Route index element={<NewProjectPage />} />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:projectId/*"
          element={
            <PrivateRoute>
              <Route index element={<ProjectDetailsPage />} />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:projectId/add-task"
          element={
            <PrivateRoute>
              <Route index element={<AddTaskPage />} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
