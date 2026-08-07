import { useCallback, useEffect, useState } from "react";
import { Transcript, TranscriptContent } from "@/model/transcript.types";
import { useNavigate, useParams } from "react-router";
import { api, handleError } from "@/api/api";
import { Pagination } from "@/components/pagination";
import { AxiosError } from "axios";
import { Heading } from "@/components/heading";

export const TranscriptDetails = () => {
    const { projectId, transcriptId } = useParams();

    const [transcript, setTranscript] = useState<Transcript>();
    const [transcriptContent, setTranscriptContent] = useState<TranscriptContent>();

    const navigate = useNavigate();

    const getTranscript = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await api.get<Transcript>(
                `/projects/${projectId}/transcripts/${transcriptId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            setTranscript(data);
        } catch (error) {
            handleError(error as AxiosError, navigate);
        }
    }, [projectId, transcriptId, navigate]);

    const getTranscriptContent = useCallback(
        async (page: number = 1, pageSize: number = 25) => {
            try {
                const token = localStorage.getItem("token");

                const { data } = await api.get<TranscriptContent>(
                    `/projects/${projectId}/transcripts/${transcriptId}/content`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: {
                            page,
                            pageSize,
                        },
                    },
                );

                setTranscriptContent(data);
            } catch (error) {
                handleError(error as AxiosError, navigate);
            }
        },
        [projectId, transcriptId, navigate],
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
            <Heading>Transcript</Heading>
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
                    {transcriptContent.content?.map((line, i) => (
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
