import { useCallback, useEffect, useMemo, useState } from "react";
import { Spin, Tabs, TabsProps } from "antd";
import { useNavigate } from "react-router";
import { Transcript } from "@/model/transcript.types";
import { useProject } from "@/hooks/projects.hooks";
import { Paragraph } from "@/components/paragraph";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { api } from "@/api/api";

import styles from "./transcripts.module.scss";

type TranscriptWithChild = Transcript & {
    child_name: string;
};

export const Transcripts = () => {
    const [transcripts, setTranscripts] = useState<TranscriptWithChild[]>([]);

    const navigate = useNavigate();
    const { token } = useUser();
    const { project } = useProject();

    const getTranscripts = useCallback(async () => {
        if (project === undefined) {
            return [];
        }

        try {
            const { data } = await api.get<TranscriptWithChild[]>(`/projects/${project.id}/transcripts`, {
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

    const transcriptsChildLookup = useMemo(() => {
        return transcripts.reduce<Record<TranscriptWithChild["child_id"], TranscriptWithChild[]>>((acc, transcript) => {
            if (transcript.child_id in acc) {
                acc[transcript.child_id].push(transcript);
            } else {
                acc[transcript.child_id] = [transcript];
            }
            return acc;
        }, {});
    }, [transcripts]);

    const items = useMemo<TabsProps["items"]>(() => {
        if (!project) {
            return;
        }

        return Object.keys(transcriptsChildLookup)
            .toSorted()
            .map((childId) => {
                const childTranscripts = transcriptsChildLookup[childId];

                return {
                    key: childId,
                    label: childTranscripts[0].child_name,
                    children: (
                        <div className={styles.listingGrid}>
                            {childTranscripts.map(({ id, title, file_url }) => (
                                <Card
                                    key={id}
                                    title={title}
                                    onClick={() => navigate(`/projects/${project.id}/transcripts/${id}`)}
                                >
                                    <Paragraph>{file_url}</Paragraph>
                                </Card>
                            ))}
                        </div>
                    ),
                };
            });
    }, [navigate, project, transcriptsChildLookup]);

    if (!project) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading level={1}>Transcripts</Heading>
                <Button>
                    <NavLink to={`/projects/${project.id}/transcripts/upload`}>Upload</NavLink>
                </Button>
            </div>
            <Tabs items={items} />
        </div>
    );
};
