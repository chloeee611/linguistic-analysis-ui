import { useCallback, useEffect, useState } from "react";
import { TableProps, Table, Select } from "antd";
import { PaginatedResults } from "@/model/pagination.types";
import { AnalysisType } from "@/model/analysis.types";
import { Pagination } from "@/components/pagination";
import { useProject } from "@/hooks/projects.hooks";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { useApi } from "@/hooks/api.hooks";
import { Spin } from "@/components/spin";

import styles from "./results.module.scss";

// Defines available analysis types for filtering
const ANALYSIS_TYPES: { value: AnalysisType; label: string }[] = [
    { value: "kwal", label: "kwal" },
    { value: "mlu", label: "mlu" },
    { value: "freq", label: "freq" },
    { value: "lexrare", label: "lexrare" },
];

type AnalysisItem = {
    id: number;
    type: string;
    created_at: string;
    transcript_count: string;
};

// Defines the columns for the results table
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
    },
    {
        title: "Run Date",
        dataIndex: "created_at",
        key: "created_at",
        render: (created_at) => new Date(created_at).toUTCString(),
    },
    {
        title: "No. of Transcripts",
        dataIndex: "transcript_count",
        key: "transcript_count",
    },
];

//  Displays the results table for the project
export const Results = () => {
    const [results, setResults] = useState<PaginatedResults<AnalysisItem>>();
    const [currentAnalysisFilter, setCurrentAnalysisFilter] = useState<AnalysisType[]>([]);

    const { token } = useUser();
    const { project } = useProject();
    const { loading, callApi } = useApi();

    // Fetches the analysis results for the project and allows filtering by analysis type
    const fetchStats = useCallback(
        async (page: number = 1, pageSize: number = 25) => {
            if (!project) {
                return;
            }

            const { data } = await callApi<PaginatedResults<AnalysisItem>>({
                method: "GET",
                url: `/projects/${project?.id}/analysis`,
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page,
                    pageSize,
                    analysisTypes:
                        currentAnalysisFilter.length > 0 ? encodeURIComponent(currentAnalysisFilter.join(",")) : null,
                },
            });

            setResults(data);
        },
        [project, token, callApi, currentAnalysisFilter]
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStats();
    }, [fetchStats]);

    if (loading || !results) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <Heading level={1}>Results</Heading>
            <Heading level={3}>Here's an overview of the results for this project</Heading>
            <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Filter by type"
                onChange={setCurrentAnalysisFilter}
                value={currentAnalysisFilter}
                options={ANALYSIS_TYPES}
            />
            <Table columns={columns} dataSource={results.results} pagination={false} scroll={{ y: 55 * 10 }} />
            <Pagination
                current={results.meta.page}
                total={results.meta.total}
                showSizeChanger
                pageSizeOptions={[25, 50, 75, 100]}
                pageSize={results.meta.size}
                onShowSizeChange={fetchStats}
                onChange={fetchStats}
            />
        </div>
    );
};
