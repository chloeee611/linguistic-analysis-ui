import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Transcript } from "@/model/transcript.types";
import { useProject } from "@/hooks/projects.hooks";
import { Paragraph } from "@/components/paragraph";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Spin } from "antd";
import { api } from "@/api/api";

import styles from "./transcripts.module.scss";

export const Transcripts = () => {
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);

    const navigate = useNavigate();
    const { token } = useUser();
    const { project } = useProject();

    const getTranscripts = useCallback(async () => {
        if (project === undefined) {
            return [];
        }

        try {
            const { data } = await api.get<Transcript[]>(`/projects/${project.id}/transcripts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        } catch (error) {
            console.error("Failed to request transcript", error);
            throw error;
        }
    }, [project, token]);

    useEffect(() => {
        const loadTranscripts = async () => {
            const transcriptData = await getTranscripts();
            setTranscripts(transcriptData);
        };

        loadTranscripts();
    }, [getTranscripts]);

    if (!project) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading level={1}>Project {project.id} Details</Heading>
                <Button>
                    <NavLink to={`/projects/${project.id}/transcripts/upload`}>Upload</NavLink>
                </Button>
            </div>
            <Heading level={2}>Transcripts</Heading>
            <div className={styles.listingGrid}>
                {transcripts.map(({ id, title, file_url }) => (
                    <Card key={id} title={title} onClick={() => navigate(`/projects/${project.id}/transcripts/${id}`)}>
                        <Paragraph>{file_url}</Paragraph>
                    </Card>
                ))}
            </div>
        </div>
    );
};
