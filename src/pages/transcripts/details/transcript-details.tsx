import { useCallback, useEffect, useState } from "react";
import { Transcript, TranscriptContent } from "@/model/transcript.types";
import { Pagination } from "@/components/pagination";
import { useParams } from "react-router";
import { Heading } from "@/components/heading";
import { api } from "@/api/api";

export const TranscriptDetails = () => {
    const { transcriptId } = useParams();

    const [transcript, setTranscript] = useState<Transcript>();
    const [transcriptContent, setTranscriptContent] =
        useState<TranscriptContent>();

    const getTranscript = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await api.get<Transcript>(
                `/transcripts/${transcriptId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            setTranscript(data);
        } catch (error) {
            console.error("Failed to request transcript", error);
            throw error;
        }
    }, [transcriptId]);

    const getTranscriptContent = useCallback(
        async (page: number = 1, pageSize: number = 25) => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await api.get<TranscriptContent>(
                    `/transcripts/${transcriptId}/content?page=${page}&pageSize=${pageSize}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                setTranscriptContent(data);
            } catch (error) {
                console.error("Failed to request transcript", error);
                throw error;
            }
        },
        [transcriptId],
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
                        {Object.entries(transcript.metadata).map(
                            ([key, value]) => (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{JSON.stringify(value)}</td>
                                </tr>
                            ),
                        )}
                    </tbody>
                </table>
            )}
            {transcriptContent && (
                <div>
                    {transcriptContent.content.map((line, i) => (
                        <p key={i}>{line}</p>
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
