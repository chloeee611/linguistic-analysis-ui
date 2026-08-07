import { useCallback, useEffect, useState } from "react";
import { Transcript } from "@/model/transcript.types";
import { Paragraph } from "@/components/paragraph";
import { useParams } from "react-router";
import { Heading } from "@/components/heading";
import { Project } from "@/model/project.types";
import { api } from "@/api/api";

import styles from "./project-details.module.scss";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { NavLink } from "@/components/nav-link";

export const ProjectTranscripts = () => {
    const { projectId } = useParams();

    const [, setProject] = useState<Project>();
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
                `/transcripts/projects/${projectId}`,
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
            <div className={styles.header}>
                <Heading>Project {projectId} Details</Heading>
                <Button>
                    <NavLink to={`/projects/${projectId}/transcripts/upload`}>
                        Upload
                    </NavLink>
                </Button>
            </div>
            <Heading>Transcripts</Heading>
            <div className={styles.listingGrid}>
                {transcripts.map(({ id, title, file_url }) => (
                    <Card key={id} title={title}>
                        <Paragraph>{file_url}</Paragraph>
                    </Card>
                ))}
            </div>
        </div>
    );
};
