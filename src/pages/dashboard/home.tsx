import { useEffect, useState } from "react";
import { api, handleError } from "@/api/api";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { Statistic } from "antd";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Card } from "@/components/card";

import styles from "./home.module.scss";

type DashboardStats = {
    projectCount: number;
    transcriptCount: number;
    analysisCount: number;
};

export const Home = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const navigate = useNavigate();
    const { token } = useUser();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get("/users/dashboard", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setStats(data);
            } catch (err) {
                handleError(err as AxiosError, navigate);
            }
        };
        fetchStats();
    }, [navigate, token]);

    return (
        <div className={styles.container}>
            <Heading level={1}>Welcome back!</Heading>
            <Heading level={3}>Here's an overview of your current projects</Heading>
            <div className={styles.listingGrid}>
                <Card>
                    <Statistic title="Total Projects" value={stats?.projectCount ?? 0} />
                </Card>
                <Card>
                    <Statistic title="Total Transcripts Uploaded" value={stats?.transcriptCount ?? 0} />
                </Card>
                <Card>
                    <Statistic title="Total Analyses Conducted" value={stats?.analysisCount ?? 0} />
                </Card>
            </div>
        </div>
    );
};
