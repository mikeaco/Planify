import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";

const AuthPageContainer = styled.div`
  background-color: #f9f9f9;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  padding-top: 20px;
`;

const panInAndOutAnimation = keyframes`
  0% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(-5px);
  }
`;

const Logo = styled.div`
  font-size: 44px;
  font-weight: bold;
  margin-bottom: 5em;
  animation: ${panInAndOutAnimation} 3s infinite;
`;

const Title = styled.h1`
  color: #333;
  font-size: 18px;
  margin-bottom: 0.5em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 8px;
  width: 250px;
  font-size: 14px;
  color: #333;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #333;
  color: #fff;
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();


    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in

        console.log(userCredential)

        navigate("/");
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

  };

  return (
    <AuthPageContainer>
      <Logo>Planify</Logo>
      <Title>Login</Title>
      <Form>
        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={handleLogin}>
          Login
        </Button>
      </Form>
      <Link to="/register">Don't have an account? Register here</Link>
    </AuthPageContainer>
  );
};



export default LoginPage;
