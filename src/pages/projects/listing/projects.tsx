import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Paragraph } from "@/components/paragraph";
import { Project } from "@/model/project.types";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Card } from "@/components/card";
import { Spin } from "@/components/spin";

import styles from "./projects.module.scss";

// Displays the list of projects for the user
export const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const navigate = useNavigate();
    const { token } = useUser();
    const { loading, callApi } = useApi();

    // GET request to fetch all projects for the user
    useEffect(() => {
        const loadProject = async () => {
            const { data } = await callApi<Project[]>({
                method: "GET",
                url: "/projects",
                headers: { Authorization: `Bearer ${token}` },
            });

            setProjects(data);
        };

        loadProject();
    }, [token, callApi]);

    if (loading) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading level={1}>Projects</Heading>
                <Button type="primary" gradient>
                    <NavLink to="/projects/create">Create Project</NavLink>
                </Button>
            </div>
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
