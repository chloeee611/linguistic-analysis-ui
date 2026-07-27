import { useCallback, useEffect, useState } from "react";
import { Transcript } from "@/model/transcript.types";
import { useParams } from "react-router";
import { Heading } from "@/components/heading";
import { api } from "@/api/api";

export const TranscriptDetails = () => {
    const { transcriptId } = useParams();

    const [transcript, setTranscript] = useState<Transcript>();

    const getTranscript = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await api.get<Transcript>(
                `/transcripts/${transcriptId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            return data;
        } catch (error) {
            console.error("Failed to request transcript", error);
            throw error;
        }
    }, [transcriptId]);

    useEffect(() => {
        const loadTranscript = async () => {
            const transcriptData = await getTranscript();
            setTranscript(transcriptData);
        };

        loadTranscript();
    }, [getTranscript]);

    return (
        <div>
            <Heading>Transcript</Heading>
            {transcript && <div key={transcript.id}>{transcript.file_url}</div>}
        </div>
    );
};
