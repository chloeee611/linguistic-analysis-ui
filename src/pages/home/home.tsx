import { useEffect, useState } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { Statistic } from "@/components/statistic";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { useApi } from "@/hooks/api.hooks";
import { Button } from "antd";
import { Card } from "@/components/card";
import { Spin } from "@/components/spin";

import styles from "./home.module.scss";

// Defines the structure of the dashboard stats
type DashboardStats = {
    projectCount: number;
    transcriptCount: number;
    analysisCount: number;
    weeklyAnalysisCount: number;
};

// Displays the home page with an overview of the user's current projects and stats
export const Home = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    const { token } = useUser();
    const { loading, callApi } = useApi();
    const navigate = useNavigate();

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
                <Card className={styles.card} background="primary" gradient onClick={() => navigate(`/projects`)}>
                    <Button
                        className={styles.externalButton}
                        shape="circle"
                        icon={<ArrowUpOutlined rotate={45} />}
                    ></Button>
                    <Statistic
                        styles={{
                            title: { color: "var(--text-color)", fontSize: "1rem" },
                            content: { color: "var(--text-color)", fontSize: "2.5rem" },
                        }}
                        title="Total Projects"
                        value={stats?.projectCount ?? 0}
                    />
                </Card>
                <Card className={styles.card}>
                    <Button
                        className={styles.externalButton}
                        shape="circle"
                        icon={<ArrowUpOutlined rotate={45} />}
                    ></Button>
                    <Statistic title="Total Transcripts Uploaded" value={stats?.transcriptCount ?? 0} />
                </Card>
                <Card className={styles.card}>
                    <Button
                        className={styles.externalButton}
                        shape="circle"
                        icon={<ArrowUpOutlined rotate={45} />}
                    ></Button>
                    <Statistic title="Total Analyses Conducted" value={stats?.analysisCount ?? 0} />
                </Card>
                <Card className={styles.card}>
                    <Button
                        className={styles.externalButton}
                        shape="circle"
                        icon={<ArrowUpOutlined rotate={45} />}
                    ></Button>
                    <Statistic title="Total Analyses This Week" value={stats?.weeklyAnalysisCount ?? 0} />
                </Card>
            </div>
        </div>
    );
};
