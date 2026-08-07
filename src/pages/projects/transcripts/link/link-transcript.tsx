import { SelectableTranscript, Transcript } from "@/model/transcript.types";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { api, handleError } from "@/api/api";
import { AxiosError } from "axios";
import { Paragraph } from "@/components/paragraph";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Card } from "@/components/card";

import styles from "./link-transcript.module.scss";

export const LinkTranscript = () => {
    const [transcripts, setTranscripts] = useState<
        Record<string, SelectableTranscript>
    >({});
    const [existingTranscripts, setExistingTranscripts] = useState<
        Transcript[]
    >([]);

    const { projectId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loadTranscripts = async () => {
            const token = localStorage.getItem("token");

            try {
                const { data } = await api.get<Transcript[]>(`/transcripts`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const existingTranscripts = data.filter(
                    ({ project_id }) => projectId === project_id,
                );

                // Create lookup object from array
                const transcriptLookup = Object.fromEntries(
                    data
                        .filter(({ project_id }) => projectId !== project_id)
                        .map((transcript) => [
                            transcript.id,
                            {
                                ...transcript,
                                selected: projectId === transcript.project_id,
                            },
                        ]),
                );

                setTranscripts(transcriptLookup);
                setExistingTranscripts(existingTranscripts);
            } catch (err) {
                handleError(err as AxiosError, navigate);
            }
        };

        loadTranscripts();
    }, [projectId, navigate]);

    if (projectId === undefined) {
        navigate("/projects");
        return;
    }

    const onCardClick = (id: string) => {
        const currentTranscript = transcripts[id];

        setTranscripts({
            ...transcripts,
            [id]: {
                ...currentTranscript,
                selected: !currentTranscript.selected,
            },
        });
    };

    const onSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            await api.post(
                `/projects/${projectId}/transcripts`,
                {
                    transcripts: Object.values(transcripts)
                        .filter(({ selected }) => selected)
                        .map(({ id }) => id),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
        } catch (error) {
            handleError(error as AxiosError, navigate);
        }
    };

    return (
        <Form onSubmit={onSubmit}>
            <Heading>Already Linked Transcripts</Heading>
            <div className={styles.listingGrid}>
                {existingTranscripts.map(({ id, title, file_url }) => (
                    <Card
                        key={id}
                        title={title}
                        className={styles.existingCard}
                    >
                        <Paragraph>{file_url}</Paragraph>
                    </Card>
                ))}
            </div>
            <Heading>Link Transcripts</Heading>
            <div className={styles.listingGrid}>
                {Object.values(transcripts).map(
                    ({ id, title, file_url, selected }) => (
                        <Card
                            key={id}
                            title={title}
                            disabled={selected}
                            onClick={() => onCardClick(id)}
                        >
                            <Paragraph>{file_url}</Paragraph>
                        </Card>
                    ),
                )}
            </div>
            <Button htmlType="submit">Link Transcripts</Button>
        </Form>
    );
};
