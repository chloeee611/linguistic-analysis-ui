import { useEffect, useState } from "react";
import { Statistic } from "@/components/statistic";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { useApi } from "@/hooks/api.hooks";
import { Card } from "@/components/card";
import { Spin } from "@/components/spin";

import styles from "./home.module.scss";

type DashboardStats = {
    projectCount: number;
    transcriptCount: number;
    analysisCount: number;
};

export const Home = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    const { token } = useUser();
    const { loading, callApi } = useApi();

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await callApi<DashboardStats>({
                method: "GET",
                url: "/users/dashboard",
                headers: { Authorization: `Bearer ${token}` },
            });

            setStats(data);
        };
        fetchStats();
    }, [token, callApi]);

    if (loading) {
        return <Spin />;
    }

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
