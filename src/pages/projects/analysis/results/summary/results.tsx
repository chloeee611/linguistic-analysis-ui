import { useEffect, useState } from "react";
import { TableProps, Table } from "antd";
import { PaginatedResults } from "@/model/pagination.types";
import { useProject } from "@/hooks/projects.hooks";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { useApi } from "@/hooks/api.hooks";
import { Spin } from "@/components/spin";

import styles from "./results.module.scss";

type AnalysisItem = {
    id: number;
    type: string;
    created_at: string;
    transcript_count: string;
};

const columns: TableProps<AnalysisItem>["columns"] = [
    {
        title: "Link",
        dataIndex: "id",
        key: "id",
        render: (id) => <NavLink to={`${id}`}>Details</NavLink>,
    },
    {
        title: "Type",
        dataIndex: "type",
        key: "type",
        filters: [{ text: "KWAL", value: "kwal" }],
    },
    {
        title: "Run Date",
        dataIndex: "created_at",
        key: "created_at",
    },
    {
        title: "No. of Transcripts",
        dataIndex: "transcript_count",
        key: "transcript_count",
    },
];

export const Results = () => {
    const [results, setResults] = useState<AnalysisItem[]>();

    const { token } = useUser();
    const { project } = useProject();
    const { loading, callApi } = useApi();

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await callApi<PaginatedResults<AnalysisItem>>({
                method: "GET",
                url: `/projects/${project?.id}/analysis`,
                headers: { Authorization: `Bearer ${token}` },
            });

            setResults(data.results);
        };
        fetchStats();
    }, [token, callApi, project]);

    if (loading) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <Heading level={1}>Results</Heading>
            <Heading level={3}>Here's an overview of the results for this project</Heading>
            <Table columns={columns} dataSource={results} />
        </div>
    );
};
