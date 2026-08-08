import { useEffect, useState } from "react";
import { api, handleError } from "@/api/api";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { Paragraph } from "@/components/paragraph";
import { Project } from "@/model/project.types";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { Card } from "@/components/card";

import styles from "./projects.module.scss";

export const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    // const [wordCount, setWordCount] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const loadProject = async () => {
            const token = localStorage.getItem("token");

            try {
                const { data } = await api.get<Project[]>("/projects", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProjects(data);
            } catch (err) {
                handleError(err as AxiosError, navigate);
            }
        };

        loadProject();
    }, [navigate]);

    // const analyseWordCount = async (transcriptName: string) => {
    //     const token = localStorage.getItem("token");
    //     const { data } = await api.post(
    //         `analysis/frequency/${transcriptName}`,
    //         {},
    //         {
    //             headers: { Authorization: `Bearer ${token}` },
    //         },
    //     );
    //     return data;
    // };

    // const callAnalyseWordCount = async (transcriptName: string) => {
    //     try {
    //         const result = await analyseWordCount(transcriptName);
    //         setWordCount(result.wordCount);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading level={1}>Projects</Heading>
                <Button>
                    <NavLink to="/projects/create">Create Project</NavLink>
                </Button>
            </div>

            {/* TODO: create separate component for this */}
            <div className={styles.listingGrid}>
                {projects.map(({ id, title, description }) => (
                    <Card key={id} title={title} onClick={() => navigate(`/projects/${id}`)}>
                        <Paragraph>{description}</Paragraph>
                    </Card>
                ))}
            </div>

            {/* <h3>Results</h3>
            <Paragraph>Word count: {wordCount}</Paragraph>
            <Button onClick={() => callAnalyseWordCount("010920.cha")}>
                Analyse Word Count
            </Button> */}
        </div>
    );
};
