import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useCallback, useEffect, useState } from "react";
import { api, handleError } from "@/api/api";
import { useNavigate } from "react-router";
import { useProject } from "@/hooks/projects.hooks";
import { AxiosError } from "axios";
import { ChartData } from "recharts/types/state/chartDataSlice";
import { Heading } from "@/components/heading";
import { NavLink } from "@/components/nav-link";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { Spin } from "antd";

import styles from "./project-dashboard.module.scss";

type ProjectSummaryReturn = { keys: Record<string, string>; data: ChartData };

export const ProjectDashboard = () => {
    const [projectSummary, setProjectSummary] = useState<ProjectSummaryReturn>();

    const navigate = useNavigate();
    const { token } = useUser();
    const { project } = useProject();

    const getProjectSummary = useCallback(async () => {
        if (!project) {
            return;
        }

        try {
            const { data } = await api.get<ProjectSummaryReturn>(`/projects/${project.id}/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        } catch (error) {
            handleError(error as AxiosError, navigate);
        }
    }, [project, navigate, token]);

    useEffect(() => {
        const loadProject = async () => {
            const projectSummary = await getProjectSummary();
            setProjectSummary(projectSummary);
        };

        loadProject();
    }, [project, getProjectSummary]);

    if (!project) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading level={1}>{project.title}</Heading>
                <Button>
                    <NavLink to={`/projects/${project.id}/transcripts/upload`}>Upload</NavLink>
                </Button>
            </div>
            <Heading level={2}>Lex Rare For Children</Heading>

            {projectSummary && (
                <LineChart
                    style={{ width: "100%", height: "100%", maxHeight: "50vh", aspectRatio: 1.618 }}
                    responsive
                    data={projectSummary.data}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" stroke="#52525b" />
                    <YAxis width="auto" stroke="#52525b" />
                    <Tooltip
                        cursor={{
                            stroke: "#a8a29e",
                        }}
                        contentStyle={{
                            backgroundColor: "#fafafa",
                            borderColor: "#a8a29e",
                        }}
                    />
                    <Legend />

                    {Object.entries(projectSummary.keys).map(([name, color]) => (
                        <Line
                            type="monotone"
                            dataKey={name}
                            stroke={color}
                            dot={{
                                fill: "#fff",
                            }}
                            connectNulls
                        />
                    ))}
                </LineChart>
            )}
        </div>
    );
};
