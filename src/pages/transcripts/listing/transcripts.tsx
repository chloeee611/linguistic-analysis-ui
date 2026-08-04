import { useEffect, useState } from "react";
import { api, handleError } from "@/api/api";
import { useNavigate } from "react-router";
import { Transcript } from "@/model/transcript.types";
import { AxiosError } from "axios";
import { Paragraph } from "@/components/paragraph";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { Card } from "@/components/card";

import styles from "./transcripts.module.scss";

export const Transcripts = () => {
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const loadTranscripts = async () => {
            const token = localStorage.getItem("token");

            try {
                const { data } = await api.get<Transcript[]>("/transcripts", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTranscripts(data);
            } catch (err) {
                handleError(err as AxiosError, navigate);
            }
        };

        loadTranscripts();
    }, [navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading>Transcripts</Heading>
                <Button>
                    <NavLink to="/transcripts/upload">Upload</NavLink>
                </Button>
            </div>

            {/* TODO: create separate component for this */}
            <div className={styles.listingGrid}>
                {transcripts.map(({ id, title, file_url }) => (
                    <Card
                        key={id}
                        title={title}
                        className={styles.card}
                        onClick={() => navigate(`/transcripts/${id}`)}
                    >
                        <Paragraph>{file_url}</Paragraph>
                    </Card>
                ))}
            </div>
        </div>
    );
};
