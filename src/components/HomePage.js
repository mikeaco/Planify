import React, { useEffect, useState } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import styled from "styled-components";
import app from "./firebaseconfig";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

import NavBar from "./NavBar";

const PageContainer = styled.div`
  display: flex;
`;

const ProjectContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
`;

const ActionLink = styled(Link)`
  text-decoration: none;
  color: #007bff;
  margin-top: 10px;
`;

const AddProjectButton = styled(ActionLink)`
  width: fit-content;
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const AddProjectContainer = styled.div`
  padding: 20px;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const ProjectBox = styled.div`
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  }
`;


const Title = styled.h2`
  font-size: 24px;
  color: #000000;
  margin-bottom: 10px;
  text-align: center;
`;

const Description = styled.p`
  color: #333333;
  text-align: center;
`;

const TaskList = styled.ul`
  margin-top: 10px;
  padding-left: 20px;
`;

const TaskItem = styled.li`
  color: #666666;
`;

const HomePage = () => {
  const db = getFirestore(app);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const userId = getCurrentUserId();

    const unsubscribe = onSnapshot(collection(db, "Projects"), (snapshot) => {
      const projectsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          UserId: doc.data().UserId,
          Title: doc.data().Title,
          Description: doc.data().Description,
          Tasks: doc.data().Tasks || [],
        }))
        .filter((project) => project.UserId === userId);

      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, [db]);

  const getCurrentUserId = () => {
    const userID = getAuth(app).currentUser.uid;
    return userID;
  };

  return (
    <PageContainer>
      <ProSidebarProvider>
        <NavBar />
      </ProSidebarProvider>
      <ProjectContainer>
        <AddProjectContainer>
          <AddProjectButton to="/new-project">+ Add Project</AddProjectButton>
        </AddProjectContainer>
        <ProjectGrid>
          {projects.map((project) => (
            <ProjectBox
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div>
                <Title>{project.Title}</Title>
                <Description>{project.Description}</Description>
                <TaskList>
                  {Array.isArray(project.Tasks) &&
                    project.Tasks.map((task, index) => (
                      <TaskItem key={index}>
                        {task.Title} - {task.Status}
                      </TaskItem>
                    ))}
                </TaskList>
              </div>
            </ProjectBox>
          ))}
        </ProjectGrid>
      </ProjectContainer>
    </PageContainer>
  );
};

export default HomePage;
