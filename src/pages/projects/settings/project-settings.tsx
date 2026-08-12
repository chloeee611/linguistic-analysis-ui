import { SubmitEvent, useCallback, useEffect, useState } from "react";
import { Children, Project } from "@/model/project.types";
import { api, handleError } from "@/api/api";
import { parseFormData } from "@/helpers/form.helpers";
import { useNavigate } from "react-router";
import { Space, Spin } from "antd";
import { useProject } from "@/hooks/projects.hooks";
import { AxiosError } from "axios";
import { Paragraph } from "@/components/paragraph";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Form } from "@/components/form";

import styles from "./project-settings.module.scss";

export const ProjectSettings = () => {
    const [currentNewChild, setCurrentNewChild] = useState<string>("");
    const [currentChildren, setCurrentChildren] = useState<Children[]>([]);
    const [newChildren, setNewChildren] = useState<string[]>([]);

    const navigate = useNavigate();
    const { token } = useUser();
    const { project } = useProject();

    const getProjectChildren = useCallback(async () => {
        if (!project) {
            return;
        }

        try {
            const { data } = await api.get<Children[]>(`/projects/${project.id}/children`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        } catch (error) {
            handleError(error as AxiosError, navigate);
        }
    }, [project, navigate, token]);

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

            const { data, status } = await api.put(
                `/projects/${project?.id}`,
                { ...formObject, children: newChildren },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (status === 201) {
                console.log("Project created successfully");
                navigate(`/projects/${data.id}`);
            }

            // TODO: return newly created project id, then navigate to new project page
        } catch (error) {
            console.error(error);
        }
    };

    if (!project) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <Heading level={1}>Project Settings</Heading>

            <Form onSubmit={callEditProject}>
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
                {/* {project} */}
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
