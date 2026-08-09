import { useEffect, useState } from "react";
import { api, handleError } from "@/api/api";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { Paragraph } from "@/components/paragraph";
import { Project } from "@/model/project.types";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { Card } from "@/components/card";

import styles from "./projects.module.scss";

export const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const navigate = useNavigate();
    const { token } = useUser();

    useEffect(() => {
        const loadProject = async () => {
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
    }, [navigate, token]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading level={1}>Projects</Heading>
                <Button type="primary" gradient>
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
        </div>
    );
};
