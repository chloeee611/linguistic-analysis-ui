import { useCallback, useEffect, useMemo, useState } from "react";
import { PaginatedResults } from "@/model/pagination.types";
import { useNavigate } from "react-router";
import { Transcript } from "@/model/transcript.types";
import { Pagination } from "@/components/pagination";
import { useProject } from "@/hooks/projects.hooks";
import { Paragraph } from "@/components/paragraph";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Field } from "@/model/form.types";
import { Steps, Table } from "antd";
import { Card } from "@/components/card";
import { Spin } from "@/components/spin";

import styles from "./kwal.module.scss";

// Defines the title and content for the three steps of the KWAL analysis
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

type KwalForm = {
    search_utterance: string;
    gra_filters: string;
    mor_filters: string;
};

// Displays the KWAL analysis page which allows users to select transcripts, add search terms, and finalise details before submitting the analysis
export const Kwal = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [searches, setSearches] = useState<Record<keyof KwalForm, string | undefined>>({
        search_utterance: undefined,
        gra_filters: undefined,
        mor_filters: undefined,
    });
    const [transcriptsLookup, setTranscriptsLookup] = useState<Record<string, Transcript>>({});
    const [selectedTranscripts, setSelectedTranscripts] = useState<Record<string, Transcript>>({});
    const [paginatedTranscripts, setPaginatedTranscripts] = useState<PaginatedResults<Transcript>>();

    const { token } = useUser();
    const { project } = useProject();
    const { callApi } = useApi();
    const navigate = useNavigate();

    // Fetches the list of transcripts for the project and updates the state with the results
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

    // Handles selection/deselection of transcripts when a card is clicked and updates the selectedTranscripts state
    const onCardClick = (id: string) => {
        if (Object.keys(transcriptsLookup).length === 0) {
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

    // Handles selection/deselection of all transcripts when the relevant button is clicked
    const onSelectedAll = () => {
        if (Object.keys(transcriptsLookup).length === 0) {
            return;
        }

        setSelectedTranscripts(transcriptsLookup);
    };

    const onRemovedAll = () => {
        if (Object.keys(transcriptsLookup).length === 0) {
            return;
        }

        setSelectedTranscripts({});
    };

    // Submits the KWAL analysis request with the selected transcripts and search terms, then navigates to the analysis results page on completion
    const onSubmit = async () => {
        if (!project) {
            return;
        }

        const { data } = await callApi<{ id: string }>({
            method: "POST",
            url: `/analysis/kwal`,
            data: {
                project_id: project.id,
                search_utterance: [searches.search_utterance],
                mor_filters: [searches.mor_filters ?? ""],
                gra_filters: [searches.gra_filters ?? ""],
                transcripts: Object.values(selectedTranscripts).map(({ id, file_url }) => ({ id, file_url })),
            },

            headers: { Authorization: `Bearer ${token}` },
        });

        navigate(`/projects/${project.id}/analysis/${data.id}`);
    };

    // Defines the fields for the search terms input form
    const fields = useMemo<Field<KwalForm>[]>(
        () => [
            {
                label: "Search Word",
                property: "search_utterance",
                type: "text",
                onChange: (e) =>
                    setSearches((previousSearches) => ({ ...previousSearches, search_utterance: e.target.value })),
            },
            {
                id: "gra",
                label: "Gra Filter",
                property: "gra_filters",
                type: "text",
                onChange: (e) =>
                    setSearches((previousSearches) => ({ ...previousSearches, gra_filters: e.target.value })),
            },
            {
                id: "mor",
                label: "Mor Filter",
                property: "mor_filters",
                type: "text",
                onChange: (e) =>
                    setSearches((previousSearches) => ({ ...previousSearches, mor_filters: e.target.value })),
            },
        ],
        []
    );

    // Determines whether the "Next Step" button should be disabled based on the current step and selected transcripts
    const nextDisabled = useMemo(() => {
        switch (currentStep) {
            case 0:
                return Object.values(selectedTranscripts).length === 0;
            default:
                return false;
        }
    }, [currentStep, selectedTranscripts]);

    if (!project || Object.keys(transcriptsLookup).length === 0 || !paginatedTranscripts) {
        return <Spin />;
    }

    // Renders the content for the current step of the KWAL analysis process
    const CurrentTab = () => {
        const data = [
            {
                setting: "Number of Transcripts",
                value: Object.keys(selectedTranscripts).length,
            },
            {
                setting: "Utterance Search",
                value: searches.search_utterance ?? "-",
            },
            {
                setting: "MOR Search",
                value: searches.mor_filters ?? "-",
            },
            {
                setting: "GRA Search",
                value: searches.gra_filters ?? "-",
            },
        ];

        switch (currentStep) {
            case 0:
                return (
                    <>
                        <div className={styles.selectButtons}>
                            <Button type="secondary" onClick={onSelectedAll}>
                                Select All {Object.keys(transcriptsLookup).length}
                            </Button>
                            <Button type="secondary" onClick={onRemovedAll}>
                                Remove All {Object.keys(selectedTranscripts).length}
                            </Button>
                        </div>

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
                return (
                    <div className={styles.inputContainer}>
                        {fields.map(({ label, property, onChange }) => (
                            <div className={styles.field}>
                                <Label htmlFor={property}>{label}</Label>
                                <Input value={searches[property]} id={property} name={property} onChange={onChange} />
                            </div>
                        ))}
                    </div>
                );
            case 2:
                return (
                    <div className={styles.inputContainer}>
                        <Heading level={2}>Search Settings</Heading>
                        <Table dataSource={data} pagination={false}>
                            <Table.Column width="40%" title="Setting" dataIndex="setting" key="setting" />
                            <Table.Column width="60%" title="Value" dataIndex="value" key="value" />
                        </Table>
                    </div>
                );
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
