import { useEffect, useState } from "react";
import type { Project } from "../../../model/project.types";
import { useParams } from "react-router";
import { api } from "../../../api/api";

export const ProjectDetails = () => {
    const { projectId } = useParams();

    const [project, setProject] = useState<Project>();

    const getProject = async () => {
        const token = localStorage.getItem("token");
        const { data } = await api.get<Project>(`/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    };

    useEffect(() => {
        const loadProject = async () => {
            const data = await getProject();
            setProject(data);
        };

        loadProject();
    }, []);

    return (
        <div>
            <h1>Project {projectId} Details</h1>
            <h2>{project?.title}</h2>
            <p>{project?.description}</p>
            <h3>Transcripts</h3>
        </div>
    );
};
