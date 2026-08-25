import { useEffect, useMemo, useState } from "react";
import { AnalysisResult } from "@/model/analysis.types";
import { useParams } from "react-router";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { useApi } from "@/hooks/api.hooks";
import { Table } from "antd";
import { Spin } from "@/components/spin";

import styles from "./result-details.module.scss";

// Displays the details of a specific analysis result
export const ResultDetails = () => {
    const { projectId, analysisId } = useParams();

    const [analysis, setAnalysis] = useState<AnalysisResult>();

    const { token } = useUser();
    const { loading, callApi } = useApi();

    useEffect(() => {
        const fetchResults = async () => {
            const { data } = await callApi<AnalysisResult>({
                method: "GET",
                url: `/projects/${projectId}/analysis/${analysisId}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAnalysis(data);
        };
        fetchResults();
    }, [projectId, analysisId, token, callApi]);

    // Renders the results table based on the analysis type and displays relevant data for each type
    const resultComponent = useMemo(() => {
        if (!analysis) {
            return;
        }

        switch (analysis.type) {
            case "kwal": {
                const data = analysis?.results.flatMap((x) => x.map((result) => result));

                return (
                    <div className={styles.resultsTable}>
                        <Table dataSource={data}>
                            <Table.Column width="20%" title="Speaker" dataIndex="speaker" key="speaker" />
                            <Table.Column width="20%" title="Line Number" dataIndex="line_number" key="line_number" />
                            <Table.Column width="60%" title="Utterance" dataIndex="utterance" key="utterance" />
                        </Table>
                    </div>
                );
            }
            case "lexrare": {
                const data = Object.values(analysis?.results[0]);

                return (
                    <div className={styles.resultsTable}>
                        <Table dataSource={data}>
                            <Table.Column width="20%" title="Speaker" dataIndex="code" key="code" />
                            <Table.Column
                                width="20%"
                                title="Rare Words"
                                dataIndex="num_rare_words"
                                key="num_rare_words"
                            />
                            <Table.Column
                                width="20%"
                                title="Total Words"
                                dataIndex="num_total_words"
                                key="num_total_words"
                            />
                            <Table.Column
                                width="20%"
                                title="Common Words"
                                dataIndex="num_common_words"
                                key="num_common_words"
                            />
                            <Table.Column
                                width="20%"
                                title="Rare Words Ratio"
                                dataIndex="percent_rare_words"
                                key="percent_rare_words"
                            />
                        </Table>
                    </div>
                );
            }
            case "mlu": {
                const data = Object.entries(analysis?.results[0].counts).map(([code, result]) => ({ code, ...result }));

                return (
                    <div className={styles.resultsTable}>
                        <Table dataSource={data}>
                            <Table.Column width="25%" title="Speaker" dataIndex="code" key="code" />
                            <Table.Column width="25%" title="Utterances" dataIndex="utterances" key="utterances" />
                            <Table.Column width="25%" title="Words" dataIndex="morphs" key="morphs" />
                            <Table.Column width="25%" title="MLU" dataIndex="mlu" key="mlu" />
                        </Table>
                    </div>
                );
            }
            case "freq": {
                const data = Object.entries(analysis?.results[0]).map(([code, result]) => ({
                    code,
                    ...result.summary,
                }));

                return (
                    <div className={styles.resultsTable}>
                        <Table dataSource={data}>
                            <Table.Column width="25%" title="Speaker" dataIndex="code" key="code" />
                            <Table.Column
                                width="25%"
                                title="Unique Words"
                                dataIndex="total_unique_words"
                                key="total_unique_words"
                            />
                            <Table.Column width="25%" title="Total Words" dataIndex="total_items" key="total_items" />
                            <Table.Column
                                width="25%"
                                title="Unique Word Ratio"
                                dataIndex="unique_word_ratio"
                                key="unique_word_ratio"
                            />
                        </Table>
                    </div>
                );
            }
        }
    }, [analysis]);

    if (loading || !analysis) {
        return <Spin />;
    }

    // Defines the summary data for the general details table
    const data = [
        {
            setting: "Analysis Type",
            value: analysis.type,
        },
        {
            setting: "Run Date",
            value: new Date(analysis.created_at).toUTCString(),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.summaryTable}>
                <Heading level={1}>Analysis Details</Heading>
                <Table dataSource={data} pagination={false}>
                    <Table.Column width="40%" title="Summary" dataIndex="setting" key="setting" />
                    <Table.Column width="60%" title="Details" dataIndex="value" key="value" />
                </Table>
            </div>

            {resultComponent}
        </div>
    );
};
