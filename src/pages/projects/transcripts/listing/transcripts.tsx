import { useCallback, useEffect, useState } from "react";
import { Transcript } from "@/model/transcript.types";
import { Paragraph } from "@/components/paragraph";
import { useParams } from "react-router";
import { Project } from "@/model/project.types";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { api } from "@/api/api";

import styles from "./transcripts.module.scss";

export const Transcripts = () => {
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

    const getTranscripts = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await api.get<Transcript[]>(`/projects/${projectId}/transcripts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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

            const transcriptData = await getTranscripts();
            setTranscripts(transcriptData);
        };

        loadProject();
    }, [getProject, getTranscripts]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading>Project {projectId} Details</Heading>
                <Button>
                    <NavLink to={`/projects/${projectId}/transcripts/upload`}>Upload</NavLink>
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
