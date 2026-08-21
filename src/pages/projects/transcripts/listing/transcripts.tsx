import { useCallback, useEffect, useState } from "react";
import { PaginatedResults } from "@/model/pagination.types";
import { useNavigate } from "react-router";
import { Transcript } from "@/model/transcript.types";
import { Pagination } from "@/components/pagination";
import { useProject } from "@/hooks/projects.hooks";
import { Paragraph } from "@/components/paragraph";
import { Children } from "@/model/project.types";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Select } from "antd";
import { Card } from "@/components/card";
import { Spin } from "@/components/spin";

import styles from "./transcripts.module.scss";

type TranscriptWithChild = Transcript & {
    child_name: string;
};

type FilterChildOption = { value: string; label: string };

export const Transcripts = () => {
    const [transcripts, setTranscripts] = useState<PaginatedResults<TranscriptWithChild>>();
    const [currentChildren, setCurrentChildren] = useState<FilterChildOption[]>([]);
    const [filteredChildren, setFilteredChildren] = useState<number[]>([]);

    const navigate = useNavigate();
    const { token } = useUser();
    const { project } = useProject();
    const { loading, callApi } = useApi();

    const getProjectChildren = useCallback(async () => {
        if (!project) {
            return;
        }

        const { data } = await callApi<Children[]>({
            method: "GET",
            url: `/projects/${project.id}/children`,
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }, [project, token, callApi]);

    useEffect(() => {
        const loadProject = async () => {
            const projectChildren = await getProjectChildren();

            if (projectChildren) {
                setCurrentChildren(projectChildren.map(({ id, name }) => ({ value: id, label: name })));
            }
        };

        loadProject();
    }, [project, getProjectChildren]);

    const getTranscripts = useCallback(
        async (page: number = 1, pageSize: number = 25) => {
            if (project === undefined) {
                return [];
            }

            const { data } = await callApi<PaginatedResults<TranscriptWithChild>>({
                method: "GET",
                url: `/projects/${project.id}/transcripts`,
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page,
                    pageSize,
                    children: filteredChildren.length > 0 ? encodeURIComponent(filteredChildren.join(",")) : null,
                },
            });

            if (data) {
                setTranscripts(data);
            }
        },
        [project, token, filteredChildren, callApi]
    );

    useEffect(() => {
        const loadTranscripts = async () => {
            await getTranscripts();
        };

        loadTranscripts();
    }, [getTranscripts, filteredChildren]);

    if (loading || !project) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading level={1}>Transcripts</Heading>
                <Button>
                    <NavLink to={`/projects/${project.id}/transcripts/upload`}>Upload</NavLink>
                </Button>
            </div>
            {transcripts && (
                <>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Filter by children"
                        onChange={setFilteredChildren}
                        value={filteredChildren}
                        options={currentChildren}
                    />
                    <div className={styles.listingGrid}>
                        {transcripts.results.map(({ id, title, file_url }) => (
                            <Card
                                key={id}
                                title={title}
                                onClick={() => navigate(`/projects/${project.id}/transcripts/${id}`)}
                            >
                                <Paragraph>{file_url}</Paragraph>
                            </Card>
                        ))}
                    </div>
                    <Pagination
                        current={transcripts.meta.page}
                        total={transcripts.meta.total}
                        showSizeChanger
                        pageSizeOptions={[25, 50, 75, 100]}
                        pageSize={transcripts.meta.size}
                        onShowSizeChange={getTranscripts}
                        onChange={getTranscripts}
                    />
                </>
            )}
        </div>
    );
};
