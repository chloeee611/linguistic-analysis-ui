import { Transcript, TranscriptContentUtterance, TranscriptMetadata } from "@/model/transcript.types";
import { Collapse, Descriptions, Popconfirm } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PaginatedResults } from "@/model/pagination.types";
import { parseMetadata } from "./transcript-details.helpers";
import { Pagination } from "@/components/pagination";
import { useProject } from "@/hooks/projects.hooks";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Spin } from "@/components/spin";

import styles from "./transcript-details.module.scss";

// Displays the details of a specific transcript including metadata and content
export const TranscriptDetails = () => {
    const { transcriptId } = useParams();

    const [transcript, setTranscript] = useState<Transcript>();
    const [transcriptContent, setTranscriptContent] = useState<PaginatedResults<TranscriptContentUtterance>>();

    const navigate = useNavigate();
    const { token } = useUser();
    const { project } = useProject();
    const { loading, callApi } = useApi();

    const getTranscript = useCallback(async () => {
        if (!project) {
            return;
        }

        const { data } = await callApi<Transcript>({
            method: "GET",
            url: `/projects/${project.id}/transcripts/${transcriptId}`,
            headers: { Authorization: `Bearer ${token}` },
        });
        setTranscript(data);
    }, [project, transcriptId, token, callApi]);

    // Fetches content of transcript and includes pagination functionality
    const getTranscriptContent = useCallback(
        async (page: number = 1, pageSize: number = 25) => {
            if (!project) {
                return;
            }

            const { data } = await callApi<PaginatedResults<TranscriptContentUtterance>>({
                method: "GET",
                url: `/projects/${project.id}/transcripts/${transcriptId}/content`,
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page,
                    pageSize,
                },
            });

            setTranscriptContent(data);
        },
        [project, transcriptId, token, callApi]
    );

    // Deletes the current transcript
    const deleteTranscript = useCallback(async () => {
        if (!project) {
            return;
        }

        const { status } = await callApi({
            method: "DELETE",
            url: `/projects/${project.id}/transcripts/${transcriptId}`,
            headers: { Authorization: `Bearer ${token}` },
        });

        if (status === 200) {
            navigate(`/projects/${project.id}/transcripts`);
        }
    }, [project, transcriptId, token, callApi, navigate]);

    useEffect(() => {
        const loadTranscript = async () => {
            await getTranscript();
        };

        const loadTranscriptContent = async () => {
            await getTranscriptContent();
        };

        loadTranscript();
        loadTranscriptContent();
    }, [getTranscript, getTranscriptContent]);

    if (!transcript) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading level={1}>Transcript</Heading>
                <Popconfirm
                    title="Delete the transcript"
                    description="Are you sure you want to delete this?"
                    onConfirm={deleteTranscript}
                    okText="Yes"
                    cancelText="No"
                    placement="left"
                >
                    <Button type="danger">Delete</Button>
                </Popconfirm>
            </div>
            {transcript?.metadata && (
                <Collapse
                    defaultActiveKey={["metadata"]}
                    items={[
                        {
                            key: "metadata",
                            label: "Summary",
                            children: (
                                <Descriptions
                                    bordered
                                    items={Object.keys(transcript.metadata).map((key) => ({
                                        key,
                                        label: key,
                                        // Object.entries loses the type context, needs added again
                                        children: parseMetadata(key as keyof TranscriptMetadata, transcript.metadata),
                                    }))}
                                />
                            ),
                        },
                    ]}
                />
            )}
            {transcriptContent && !loading && (
                <div>
                    {transcriptContent.results?.map((line, i) => (
                        <p key={i}>
                            {line.speaker}: {line.utterance}
                        </p>
                    ))}
                    <Pagination
                        current={transcriptContent.meta.page}
                        total={transcriptContent.meta.total}
                        showSizeChanger
                        pageSizeOptions={[25, 50, 75, 100]}
                        pageSize={transcriptContent.meta.size}
                        onShowSizeChange={getTranscriptContent}
                        onChange={getTranscriptContent}
                    />
                </div>
            )}
        </div>
    );
};
