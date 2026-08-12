import { useCallback, useEffect, useState } from "react";
import { Transcript, TranscriptContentUtterance } from "@/model/transcript.types";
import { useNavigate, useParams } from "react-router";
import { PaginatedResults } from "@/model/pagination.types";
import { api, handleError } from "@/api/api";
import { Pagination } from "@/components/pagination";
import { useProject } from "@/hooks/projects.hooks";
import { AxiosError } from "axios";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";

export const TranscriptDetails = () => {
    const { transcriptId } = useParams();

    const [transcript, setTranscript] = useState<Transcript>();
    const [transcriptContent, setTranscriptContent] = useState<PaginatedResults<TranscriptContentUtterance>>();

    const navigate = useNavigate();
    const { token } = useUser();
    const { project } = useProject();

    const getTranscript = useCallback(async () => {
        if (!project) {
            return;
        }

        try {
            const { data } = await api.get<Transcript>(`/projects/${project.id}/transcripts/${transcriptId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTranscript(data);
        } catch (error) {
            handleError(error as AxiosError, navigate);
        }
    }, [project, transcriptId, navigate, token]);

    const getTranscriptContent = useCallback(
        async (page: number = 1, pageSize: number = 25) => {
            if (!project) {
                return;
            }

            try {
                const { data } = await api.get<PaginatedResults<TranscriptContentUtterance>>(
                    `/projects/${project.id}/transcripts/${transcriptId}/content`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: {
                            page,
                            pageSize,
                        },
                    }
                );

                setTranscriptContent(data);
            } catch (error) {
                handleError(error as AxiosError, navigate);
            }
        },
        [project, transcriptId, navigate, token]
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
            {transcriptContent && (
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
