import { useCallback, useEffect, useState } from "react";
import { Transcript } from "@/model/transcript.types";
import { Paragraph } from "@/components/paragraph";
import { useParams } from "react-router";
import { Heading } from "@/components/heading";
import { Project } from "@/model/project.types";
import { api } from "@/api/api";

export const ProjectDetails = () => {
    const { projectId } = useParams();

    const [project, setProject] = useState<Project>();
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);

    const getProject = useCallback(async () => {
        const token = localStorage.getItem("token");
        const { data } = await api.get<Project>(`/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }, [projectId]);

    const getTranscript = useCallback(async () => {
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
    }, [projectId]);

    useEffect(() => {
        const loadProject = async () => {
            const projectData = await getProject();
            setProject(projectData);

            const transcriptData = await getTranscript();
            setTranscripts(transcriptData);
        };

        loadProject();
    }, [getProject, getTranscript]);

    return (
        <div>
            <Heading>Project {projectId} Details</Heading>
            <Paragraph>{project?.title}</Paragraph>
            <Paragraph>{project?.description}</Paragraph>
            <Heading>Transcripts</Heading>
            {transcripts.map((transcript) => (
                <div key={transcript.id}>{transcript.file_url}</div>
            ))}
        </div>
    );
};
