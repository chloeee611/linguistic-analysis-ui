import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Transcript } from "@/model/transcript.types";
import { Paragraph } from "@/components/paragraph";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { api } from "@/api/api";

import styles from "./transcripts.module.scss";

export const Transcripts = () => {
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const loadProject = async () => {
            const token = localStorage.getItem("token");

            try {
                const { data } = await api.get<Transcript[]>("/transcripts", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTranscripts(data);
            } catch (err) {
                console.log(err);
                navigate("/login");
            }
        };

        loadProject();
    }, [navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading>Transcripts</Heading>
                <Button>
                    <NavLink to="/analysis/transcripts/upload">Upload</NavLink>
                </Button>
            </div>

            {/* TODO: create separate component for this */}
            <div className={styles.listingGrid}>
                {transcripts.map(({ id, title, file_url }) => (
                    <Card
                        key={id}
                        title={title}
                        className={styles.card}
                        onClick={() => navigate(`/analysis/transcripts/${id}`)}
                    >
                        <Paragraph>{file_url}</Paragraph>
                    </Card>
                ))}
            </div>
        </div>
    );
};
