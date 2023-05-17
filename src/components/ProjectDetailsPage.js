import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import app from "./firebaseconfig";
import { FaTrash } from "react-icons/fa";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #000000;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #333333;
  text-align: center;
`;

const TaskList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
  width: 100%;
`;



const TaskItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;



const TaskItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const TaskContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const TaskActionsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TaskTitle = styled.span`
  font-weight: bold;
`;

const TaskStatus = styled.span`
  margin-right: 10px;
  flex-shrink: 0; /* Prevent the status dropdown from shrinking */
`;


const TaskDescription = styled.p`
  color: #666666;
`;




const DeleteButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteTaskButton = styled(DeleteButton)`
  margin-left: 10px;
`;




const AddTaskButton = styled(Link)`
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const GoHomeButton = styled(Link)`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;

  &.show {
    opacity: 1;
    visibility: visible;
  }
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.3s ease, transform 0.3s ease;

  &.show {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CancelButton = styled.button`
  margin-top: 20px;
  margin-right:5px;
  padding: 10px 20px;
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #333333;
  border-radius: 5px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;



const DeleteConfirmationModal = ({ onDelete, onCancel }) => {
  return (
    <ModalContainer>
      <ModalContent>
        <h2>Confirmation</h2>
        <p>Are you sure you want to delete this project?</p>
        <ButtonContainer>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        </ButtonContainer>
      </ModalContent>
    </ModalContainer>
  );
};

const ProjectDetailsPage = () => {
  const db = getFirestore(app);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const toggleDeleteConfirmation = () => {
    setShowDeleteConfirmation((prevValue) => !prevValue);
  };

  const handleDeleteProject = async () => {
    toggleDeleteConfirmation();
  };

  const confirmDeleteProject = async () => {
    try {
      const projectRef = doc(db, "Projects", projectId);
      await deleteDoc(projectRef);
      navigate("/");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Projects", projectId),
      (snapshot) => {
        const projectData = {
          id: snapshot.id,
          UserId: snapshot.data().UserId,
          Title: snapshot.data().Title,
          Description: snapshot.data().Description,
          Tasks: snapshot.data().Tasks || [],
        };
        setProject(projectData);
      }
    );

    return () => unsubscribe();
  }, [db, projectId]);

  const handleStatusChange = async (taskIndex, newStatus) => {
    try {
      const projectRef = doc(db, "Projects", projectId);
      const projectSnapshot = await getDoc(projectRef);
      const projectData = projectSnapshot.data();

      const updatedTasks = [...projectData.Tasks];
      updatedTasks[taskIndex].Status = newStatus;

      await updateDoc(projectRef, {
        Tasks: updatedTasks,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  

  const handleDeleteTask = async (taskId, taskIndex) => {
    try {
      const projectRef = doc(db, "Projects", projectId);
      const projectSnapshot = await getDoc(projectRef);
      const projectData = projectSnapshot.data();

      const updatedTasks = [...projectData.Tasks];
      updatedTasks.splice(taskIndex, 1);

      await updateDoc(projectRef, {
        Tasks: updatedTasks,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };


  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <Title>{project.Title}</Title>
      <Description>{project.Description}</Description>
      <h3>Tasks:</h3>
      <TaskList>
        {project.Tasks.map((task, index) => (
          <TaskItem key={task.id}>
            <TaskContentWrapper>
              <div>
                <TaskTitle>{task.Title}</TaskTitle>
                <TaskDescription>{task.Description}</TaskDescription>
              </div>
              <TaskStatus>
                <select
                  value={task.Status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  <option value="Unassigned">Unassigned</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </TaskStatus>
            </TaskContentWrapper>
            <TaskActionsWrapper>
              <DeleteTaskButton
                onClick={() => handleDeleteTask(task.id, index)}
              >
                <FaTrash />
              </DeleteTaskButton>
            </TaskActionsWrapper>
          </TaskItem>
        ))}
      </TaskList>
      <AddTaskButton to={`/projects/${projectId}/add-task`}>
        + Add Task
      </AddTaskButton>
      <DeleteButton onClick={handleDeleteProject}>Delete Project</DeleteButton>
      <GoHomeButton to="/">Go Home</GoHomeButton>
      {showDeleteConfirmation && (
        <ModalContainer className="show">
          <ModalContent className="show">
            <h2>Confirmation</h2>
            <p>Are you sure you want to delete this project?</p>
            <ButtonContainer>
              <CancelButton onClick={toggleDeleteConfirmation}>
                Cancel
              </CancelButton>
              <DeleteButton onClick={confirmDeleteProject}>Delete</DeleteButton>
            </ButtonContainer>
          </ModalContent>
        </ModalContainer>
      )}
    </PageContainer>
  );
};

export default ProjectDetailsPage;
