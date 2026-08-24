import { SubmitEvent, useCallback, useEffect, useState } from "react";
import { Children, Project } from "@/model/project.types";
import { parseFormData } from "@/helpers/form.helpers";
import { useNavigate } from "react-router";
import { useProject } from "@/hooks/projects.hooks";
import { Paragraph } from "@/components/paragraph";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Form, Space } from "antd";
import { Spin } from "@/components/spin";

import styles from "./project-settings.module.scss";

export const ProjectSettings = () => {
    const [currentNewChild, setCurrentNewChild] = useState<string>("");
    const [currentChildren, setCurrentChildren] = useState<Children[]>([]);
    const [newChildren, setNewChildren] = useState<string[]>([]);

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
                setCurrentChildren(projectChildren);
            }
        };

        loadProject();
    }, [project, getProjectChildren]);

    const callEditProject = async (event: SubmitEvent) => {
        try {
            event.preventDefault();

            const formObject = parseFormData<Project>(event);

            const { data, status } = await callApi<{ id: string }>({
                method: "PUT",
                url: `/projects/${project?.id}`,
                data: { ...formObject, children: newChildren },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (status === 201) {
                console.log("Project created successfully");
                navigate(`/projects/${data.id}`);
            }

            // TODO: return newly created project id, then navigate to new project page
        } catch (error) {
            console.error(error);
        }
    };

    if (loading || !project) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <Heading level={1}>Project Settings</Heading>

            <Form onFinish={callEditProject}>
                <Label>Title</Label>
                <Input defaultValue={project.title} name="title" />
                <Label>Description</Label>
                <Input defaultValue={project.description} name="description" />
                <Label>Children</Label>
                <Space.Compact style={{ width: "100%" }}>
                    <Input value={currentNewChild} onChange={(event) => setCurrentNewChild(event.target.value)} />
                    <Button
                        type="primary"
                        onClick={() => {
                            if (currentNewChild) {
                                setNewChildren((children) => [...children, currentNewChild]);
                                setCurrentNewChild("");
                            }
                        }}
                    >
                        Add Child
                    </Button>
                </Space.Compact>
                {currentChildren.map((child) => (
                    <Paragraph>{child.name}</Paragraph>
                ))}
                {newChildren.map((child) => (
                    <Paragraph style={{ color: "green" }}>{child}</Paragraph>
                ))}
                <div className={styles.buttons}>
                    <Button htmlType="submit" type="primary">
                        Update Project
                    </Button>
                </div>
            </Form>
        </div>
    );
};
