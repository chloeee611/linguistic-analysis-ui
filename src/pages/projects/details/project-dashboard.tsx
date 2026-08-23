import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useCallback, useEffect, useState } from "react";
import { AnalysisType } from "@/model/analysis.types";
import { useProject } from "@/hooks/projects.hooks";
import { ChartData } from "recharts/types/state/chartDataSlice";
import { Heading } from "@/components/heading";
import { NavLink } from "@/components/nav-link";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Spin } from "@/components/spin";

import styles from "./project-dashboard.module.scss";

type ProjectSummaryReturn = {
    graphData: Record<AnalysisType, { keys: string[]; data: ChartData; title: string }>;
    colourKeys: Record<string, string>;
};

const formatAgeLabel = (value: string) => {
    const [year, rest] = value.split(";");
    const [month, day] = rest.split(".");

    const yearNumber = Number(year);
    const monthNumber = Number(month);
    const dayNumber = Number(day);

    // Average
    const totalDays = dayNumber + monthNumber * 30;

    return `${(yearNumber + totalDays / 365).toFixed(2)}`;
};

export const ProjectDashboard = () => {
    const [projectSummary, setProjectSummary] = useState<ProjectSummaryReturn>();

    const { token } = useUser();
    const { project } = useProject();
    const { loading, callApi } = useApi();

    const getProjectSummary = useCallback(async () => {
        if (!project) {
            return;
        }

        const { data } = await callApi<ProjectSummaryReturn>({
            method: "GET",
            url: `/projects/${project.id}/dashboard`,
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }, [project, token, callApi]);

    useEffect(() => {
        const loadProject = async () => {
            const projectSummary = await getProjectSummary();
            setProjectSummary(projectSummary);
        };

        loadProject();
    }, [project, getProjectSummary]);

    if (loading || !project || !projectSummary) {
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

            <div className={styles.graphGrid}>
                {Object.keys(projectSummary.graphData).map((type) => {
                    const currentSummary = projectSummary.graphData[type as AnalysisType];

                    return (
                        <div className={styles.graph} key={type}>
                            <Heading level={2}>{currentSummary.title}</Heading>

                            <LineChart
                                style={{ width: "100%", height: "100%", maxHeight: "50vh", aspectRatio: 1.618 }}
                                responsive
                                data={currentSummary.data}
                                margin={{
                                    top: 5,
                                    right: 0,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="age" stroke="#52525b" tickFormatter={formatAgeLabel} minTickGap={20} />
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

                                {currentSummary.keys.map((name) => (
                                    <Line
                                        type="monotone"
                                        dataKey={name}
                                        stroke={projectSummary.colourKeys[name]}
                                        dot={{
                                            fill: "#fff",
                                        }}
                                        connectNulls
                                    />
                                ))}
                            </LineChart>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
