/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api, handleError } from "@/api/api";
import { AxiosError } from "axios";
import { Project } from "@/model/project.types";
import { useUser } from "./user.hooks";

export type ProjectContextProps = {
    project: Project | undefined;
};

export const ProjectContext = createContext<ProjectContextProps>({ project: undefined });

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const { projectId } = useParams();

    const [project, setProject] = useState<Project>();

    const { token } = useUser();
    const navigate = useNavigate();

    const getProject = useCallback(async () => {
        try {
            const { data, status } = await api.get<Project>(`/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (status === 200) {
                return data;
            }
        } catch (error) {
            handleError(error as AxiosError, navigate);
        }
    }, [projectId, navigate, token]);

    useEffect(() => {
        const loadProject = async () => {
            if (projectId === undefined || projectId === null) {
                setProject(undefined);
            }

            const projectData = await getProject();
            setProject(projectData);
        };

        loadProject();
    }, [getProject, projectId]);

    return <ProjectContext value={{ project }}>{children}</ProjectContext>;
};

export const useProject = () => {
    const { project } = useContext(ProjectContext);

    return { project };
};
