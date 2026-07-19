import { useEffect, useState, type SubmitEvent } from "react";
import type { Transcript } from "../../../model/transcript.types";
import type { Project } from "../../../model/project.types";
import { Paragraph } from "../../../components/paragraph";
import { useParams } from "react-router";
import { Heading } from "../../../components/heading";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { Form } from "../../../components/form";
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

    const callUploadTranscript = async (event: SubmitEvent) => {
        event.preventDefault(); // Stop page from refreshing

        if (!projectId) {
            console.error("Error with project ID");
            return;
        }

        const formData = new FormData(event.target);
        formData.append("projectId", projectId);

        const token = localStorage.getItem("token");
        const { data } = await api.post("/transcripts", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "multipart/form-data",
            },
        });
        return data;
    };

    return (
        <div>
            <Heading>Project {projectId} Details</Heading>
            <Paragraph>{project?.title}</Paragraph>
            <Paragraph>{project?.description}</Paragraph>
            <Heading>Transcripts</Heading>
            {transcripts.map((transcript) => (
                <div key={transcript.id}>{transcript.file_url}</div>
            ))}

            <Form onSubmit={callUploadTranscript}>
                <Input name="uploaded_file" type="file" />
                <Button htmlType="submit" type="primary">
                    Upload Transcript
                </Button>
            </Form>
        </div>
    );
};
