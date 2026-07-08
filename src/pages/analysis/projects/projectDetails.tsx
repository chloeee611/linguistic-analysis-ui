import { useEffect, useState } from "react";
import type { Transcript } from "../../../model/transcript.types";
import type { Project } from "../../../model/project.types";
import { useParams } from "react-router";
import { api } from "../../../api/api";

export const ProjectDetails = () => {
    const { projectId } = useParams();

    const [project, setProject] = useState<Project>();
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);

    const getProject = async () => {
        const token = localStorage.getItem("token");
        const { data } = await api.get<Project>(`/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    };

    const getTranscript = async () => {
        try {
            console.log("getTranscript called");
            console.log("projectId:", projectId);
            const token = localStorage.getItem("token");
            const { data } = await api.get<Transcript[]>(
                `/transcripts/project/${projectId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            return data;
        } catch (error) {
            console.error("Failed to request transcript", error);
            throw error;
        }
    };

    useEffect(() => {
        const loadProject = async () => {
            const projectData = await getProject();
            setProject(projectData);

            const transcriptData = await getTranscript();
            setTranscripts(transcriptData);
        };

        loadProject();
    }, []);

    return (
        <div>
            <h1>Project {projectId} Details</h1>
            <h2>{project?.title}</h2>
            <p>{project?.description}</p>
            <h3>Transcripts</h3>
            {transcripts.map((transcript) => (
                <div key={transcript.id}>{transcript.file_url}</div>
            ))}
        </div>
    );
};
