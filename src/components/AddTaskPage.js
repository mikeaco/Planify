import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import app from "./firebaseconfig";
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";

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

const Select = styled.select`
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

const AddTaskPage = () => {
  const db = getFirestore(app);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Unassigned");

  const handleAddTask = async (e) => {
    e.preventDefault();

    const newTask = {
      Title: title,
      Description: description,
      Status: status,
    };

    try {
      const projectRef = doc(db, "Projects", projectId);
      await updateDoc(projectRef, {
        Tasks: arrayUnion(newTask),
      });

      setTitle("");
      setDescription("");
      setStatus("Unassigned");

      navigate(`/projects/${projectId}`); // Navigate back to the project details page
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}`); // Navigate back to the project details page
  };

  return (
    <Container>
      <Title>Add Task</Title>
      <Form onSubmit={handleAddTask}>
        <Input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
        ></TextArea>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="Unassigned">Unassigned</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Select>
        <ButtonGroup>
          <Button type="submit">Add Task</Button>
          <CancelButton type="button" onClick={handleCancel}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default AddTaskPage;
