import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api, handleError } from "@/api/api";
import { Transcript } from "@/model/transcript.types";
import { AxiosError } from "axios";
import { Paragraph } from "@/components/paragraph";
import { ChartData } from "recharts/types/state/chartDataSlice";
import { Heading } from "@/components/heading";
import { Project } from "@/model/project.types";
import { NavLink } from "@/components/nav-link";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { Card } from "@/components/card";

import styles from "./project-details.module.scss";

type ProjectSummaryReturn = { data: ChartData };

export const ProjectDetails = () => {
    const { projectId } = useParams();

    const [, setProject] = useState<Project>();
    const [transcripts, setTranscripts] = useState<Transcript[]>();
    const [projectSummary, setProjectSummary] = useState<ProjectSummaryReturn>();

    const navigate = useNavigate();
    const { token } = useUser();

    const getProject = useCallback(async () => {
        try {
            const { data } = await api.get<Project>(`/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        } catch (error) {
            handleError(error as AxiosError, navigate);
        }
    }, [projectId, navigate, token]);

    const getTranscript = useCallback(async () => {
        try {
            const { data } = await api.get<Transcript[]>(`/projects/${projectId}/transcripts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        } catch (error) {
            handleError(error as AxiosError, navigate);
        }
    }, [projectId, navigate, token]);

    const getProjectSummary = useCallback(async () => {
        try {
            const { data } = await api.get<ProjectSummaryReturn>(`/projects/${projectId}/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        } catch (error) {
            handleError(error as AxiosError, navigate);
        }
    }, [projectId, navigate, token]);

    useEffect(() => {
        const loadProject = async () => {
            const projectData = await getProject();
            setProject(projectData);

            const transcriptData = await getTranscript();
            setTranscripts(transcriptData);

            const projectSummary = await getProjectSummary();
            setProjectSummary(projectSummary);
        };

        loadProject();
    }, [getProject, getTranscript, getProjectSummary]);

    return (
        <div>
            <div className={styles.header}>
                <Heading level={1}>Project {projectId} Details</Heading>
                <Button>
                    <NavLink to={`/projects/${projectId}/transcripts/upload`}>Upload</NavLink>
                </Button>
            </div>
            <Heading level={2}>Transcripts</Heading>
            <div className={styles.listingGrid}>
                {transcripts?.map(({ id, title, file_url }) => (
                    <Card key={id} title={title} onClick={() => navigate(`transcripts/${id}`)}>
                        <Paragraph>{file_url}</Paragraph>
                    </Card>
                ))}
            </div>

            {projectSummary && (
                <LineChart
                    style={{ width: "100%", maxWidth: "700px", height: "100%", maxHeight: "50vh", aspectRatio: 1.618 }}
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
                    <XAxis dataKey="date" stroke="#52525b" />
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
                    <Line
                        type="monotone"
                        dataKey="CHI"
                        stroke="#8884d8"
                        dot={{
                            fill: "#fff",
                        }}
                        activeDot={{ r: 8, stroke: "#fff" }}
                    />
                </LineChart>
            )}
        </div>
    );
};
