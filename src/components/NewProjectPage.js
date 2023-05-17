import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import app from "./firebaseconfig";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Title = styled.h1`
  font-size: 36px;
  color: #333333;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 320px;
`;

const Input = styled.input`
  margin-bottom: 16px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #f0f0f0;
  color: #333333;
  font-size: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:focus {
    outline: none;
    background-color: #ffffff;
  }
`;

const TextArea = styled.textarea`
  margin-bottom: 16px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #f0f0f0;
  color: #333333;
  font-size: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  resize: vertical;
  transition: background-color 0.3s ease;

  &:focus {
    outline: none;
    background-color: #ffffff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

const CancelButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #b02a37;
  }
`;

const NewProjectPage = () => {
  const db = getFirestore(app);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddProject = async (e) => {
    e.preventDefault();

    const newProject = {
      UserId: getCurrentUserId(),
      Title: title,
      Description: description,
      Tasks: [],
    };

    try {
      await addDoc(collection(db, "Projects"), newProject);

      setTitle("");
      setDescription("");

      navigate("/"); // Navigate back to the homepage
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const getCurrentUserId = () => {
    const userID = getAuth(app).currentUser.uid;
    return userID;
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Container>
      <Title>Add New Project</Title>
      <Form onSubmit={handleAddProject}>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
        ></TextArea>
        <ButtonGroup>
          <Button type="submit">Add Project</Button>

          <CancelButton type="button" onClick={handleCancel}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default NewProjectPage;
