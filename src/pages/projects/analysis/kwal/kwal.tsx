import { SelectableTranscript, Transcript } from "@/model/transcript.types";
import { SubmitEvent, useEffect, useState } from "react";
import { api, handleError } from "@/api/api";
import { parseFormData } from "@/helpers/form.helpers";
import { useNavigate } from "react-router";
import { useProject } from "@/hooks/projects.hooks";
import { AxiosError } from "axios";
import { Paragraph } from "@/components/paragraph";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Form } from "@/components/form";
import { Card } from "@/components/card";

import styles from "./kwal.module.scss";
import { Spin } from "antd";

type KwalForm = {
    search_utterance: string;
    transcripts: Partial<Transcript>[];
};

export const Kwal = () => {
    // Need input for searching utterance
    // Need a way of selecting transcripts - move the transcripts listing into a separate component so that we can re-use it in this page to select transcript

    const [transcripts, setTranscripts] = useState<Record<string, SelectableTranscript>>({});

    const navigate = useNavigate();
    const { token } = useUser();
    const { project } = useProject();

    useEffect(() => {
        const loadTranscripts = async () => {
            if (!project) {
                return;
            }

            try {
                const { data } = await api.get<Transcript[]>(`/projects/${project.id}/transcripts`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const transcriptLookup = Object.fromEntries(
                    data.map((transcript) => [
                        transcript.id,
                        {
                            ...transcript,
                            selected: false,
                        },
                    ])
                );

                setTranscripts(transcriptLookup);
            } catch (err) {
                handleError(err as AxiosError, navigate);
            }
        };

        loadTranscripts();
    }, [project, navigate, token]);

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

    const onSubmit = async (event: SubmitEvent) => {
        try {
            event.preventDefault();
            const formObject = parseFormData<KwalForm>(event);
            formObject.transcripts = Object.values(transcripts)
                .filter(({ selected }) => selected)
                .map(({ id, file_url }) => ({ id, file_url }));

            await api.post(`/analysis/kwal`, formObject, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // navigate("/");
        } catch (error) {
            handleError(error as AxiosError, navigate);
        }
    };

    if (!project) {
        return <Spin />;
    }

    return (
        <Form onSubmit={onSubmit}>
            <Input name="search_utterance" />
            <input name="project_id" value={project.id} hidden />
            <div className={styles.listingGrid}>
                {Object.values(transcripts).map(({ id, title, file_url, selected }) => (
                    <Card key={id} title={title} disabled={selected} onClick={() => onCardClick(id)}>
                        <Paragraph>{file_url}</Paragraph>
                    </Card>
                ))}
            </div>
            <Button htmlType="submit">Run Analysis</Button>
        </Form>
    );
};
