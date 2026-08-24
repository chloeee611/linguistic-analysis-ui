import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { useApi } from "@/hooks/api.hooks";
import { Spin } from "@/components/spin";

import styles from "./result-details.module.scss";
import { Paragraph } from "@/components/paragraph";

type AnalysisResult = {
    id: number;
};

export const ResultDetails = () => {
    const { projectId, analysisId } = useParams();

    const [result, setResult] = useState<AnalysisResult>();

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
            setResult(data);
        };
        fetchResults();
    }, [projectId, analysisId, token, callApi]);

    if (loading) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <Heading level={1}>Result Details</Heading>
            <Heading level={3}>Here's an overview of the results for this project</Heading>
            <Paragraph>{result?.id}</Paragraph>
        </div>
    );
};
