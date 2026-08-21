import { useCallback, useEffect, useMemo, useState } from "react";
import { PaginatedResults } from "@/model/pagination.types";
import { Transcript } from "@/model/transcript.types";
import { Pagination } from "@/components/pagination";
import { useProject } from "@/hooks/projects.hooks";
import { Paragraph } from "@/components/paragraph";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Input } from "@/components/input";
import { Steps } from "antd";
import { Card } from "@/components/card";
import { Spin } from "@/components/spin";

import styles from "./kwal.module.scss";

const stepItems = [
    {
        title: "Choose Transcripts",
        content: "Click to select/unselect",
    },
    {
        title: "Add Search Terms",
        content: "Search across multiple tiers",
    },
    {
        title: "Finalise Details",
        content: "Check your settings then submit",
    },
];

// type KwalForm = {
//     search_utterance: string;
//     transcripts: Partial<Transcript>[];
// };

export const Kwal = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [searchUtterance, setSearchUtterance] = useState<string>("");
    const [transcriptsLookup, setTranscriptsLookup] = useState<Record<string, Transcript>>();
    const [selectedTranscripts, setSelectedTranscripts] = useState<Record<string, Transcript>>({});
    const [paginatedTranscripts, setPaginatedTranscripts] = useState<PaginatedResults<Transcript>>();

    const { token } = useUser();
    const { project } = useProject();
    const { loading, callApi } = useApi();

    const loadTranscripts = useCallback(
        async (page: number = 1, pageSize: number = 25) => {
            if (!project) {
                return;
            }

            const { data } = await callApi<PaginatedResults<Transcript>>({
                method: "GET",
                url: `/projects/${project.id}/transcripts`,
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page,
                    pageSize,
                },
            });

            const transcriptLookup = Object.fromEntries(
                data.results.map((transcript) => [
                    transcript.id,
                    {
                        ...transcript,
                        selected: false,
                    },
                ])
            );

            setTranscriptsLookup(transcriptLookup);
            setPaginatedTranscripts(data);
        },
        [project, token, callApi]
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadTranscripts();
    }, [loadTranscripts]);

    const onCardClick = (id: string) => {
        if (!transcriptsLookup) {
            return;
        }

        if (selectedTranscripts[id]) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _, ...rest } = selectedTranscripts;
            setSelectedTranscripts(rest);
        } else {
            setSelectedTranscripts((current) => ({ ...current, [id]: transcriptsLookup[id] }));
        }
    };

    const onSubmit = async () => {
        if (!project) {
            return;
        }

        await callApi({
            method: "POST",
            url: `/analysis/kwal`,
            data: {
                search_utterance: [searchUtterance],
                // project_id: project.id,
                transcripts: Object.values(selectedTranscripts).map(({ id, file_url }) => ({ id, file_url })),
            },

            headers: { Authorization: `Bearer ${token}` },
        });

        // navigate("/");
    };

    const nextDisabled = useMemo(() => {
        switch (currentStep) {
            case 0:
                return Object.values(selectedTranscripts).length === 0;
            default:
                return false;
        }
    }, [currentStep, selectedTranscripts]);

    if (loading || !project || !transcriptsLookup || !paginatedTranscripts) {
        return <Spin />;
    }

    const CurrentTab = () => {
        switch (currentStep) {
            case 0:
                return (
                    <>
                        <div className={styles.listingGrid}>
                            {Object.values(transcriptsLookup).map(({ id, title, file_url }) => (
                                <Card
                                    key={id}
                                    title={title}
                                    disabled={id in selectedTranscripts}
                                    onClick={() => onCardClick(id)}
                                >
                                    <Paragraph>{file_url}</Paragraph>
                                </Card>
                            ))}
                        </div>
                        <Pagination
                            current={paginatedTranscripts.meta.page}
                            total={paginatedTranscripts.meta.total}
                            showSizeChanger
                            pageSizeOptions={[25, 50, 75, 100]}
                            pageSize={paginatedTranscripts.meta.size}
                            onShowSizeChange={loadTranscripts}
                            onChange={loadTranscripts}
                        />
                    </>
                );
            case 1:
                return <Input name="search_utterance" onChange={(e) => setSearchUtterance(e.target.value)} />;
        }
    };

    return (
        <div className={styles.container}>
            <div>
                <Steps className={styles.steps} current={currentStep} items={stepItems} />
            </div>

            <div className={styles.currentTab}>{CurrentTab()}</div>

            <div className={styles.buttons}>
                <Button
                    onClick={() => {
                        setCurrentStep(currentStep - 1);
                    }}
                    htmlType="button"
                    disabled={currentStep === 0}
                    type="outline"
                >
                    Previous Step
                </Button>
                {currentStep === stepItems.length - 1 ? (
                    <Button htmlType="button" onClick={onSubmit}>
                        Run Analysis
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            setCurrentStep(currentStep + 1);
                        }}
                        htmlType="button"
                        disabled={nextDisabled}
                    >
                        Next Step
                    </Button>
                )}
            </div>
        </div>
    );
};
