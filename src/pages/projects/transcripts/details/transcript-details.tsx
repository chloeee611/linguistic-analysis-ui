import { Transcript, TranscriptContentUtterance } from "@/model/transcript.types";
import { useCallback, useEffect, useState } from "react";
import { PaginatedResults } from "@/model/pagination.types";
import { Pagination } from "@/components/pagination";
import { useProject } from "@/hooks/projects.hooks";
import { useParams } from "react-router";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { useApi } from "@/hooks/api.hooks";
import { Spin } from "@/components/spin";

// Displays the details of a specific transcript including metadata and content
export const TranscriptDetails = () => {
    const { transcriptId } = useParams();

    const [transcript, setTranscript] = useState<Transcript>();
    const [transcriptContent, setTranscriptContent] = useState<PaginatedResults<TranscriptContentUtterance>>();

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
        <div>
            <Heading level={1}>Transcript</Heading>
            {transcript && <div key={transcript.id}>{transcript.file_url}</div>}
            {transcript?.metadata && (
                <table>
                    <tbody>
                        {Object.entries(transcript.metadata).map(([key, value]) => (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{JSON.stringify(value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
