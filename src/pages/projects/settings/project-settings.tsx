import { useCallback, useEffect, useState } from "react";
import { Children, Project } from "@/model/project.types";
import { useNavigate } from "react-router";
import { Form, Space } from "antd";
import { useProject } from "@/hooks/projects.hooks";
import { Paragraph } from "@/components/paragraph";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Field } from "@/model/form.types";
import { Spin } from "@/components/spin";

import styles from "./project-settings.module.scss";

// Defines input fields for project settings form
const inputs: Field<Project>[] = [
    {
        property: "title",
        label: "Title",
        type: "text",
    },
    {
        property: "description",
        label: "Description",
        type: "text",
    },
];

// Displays project settings forms and allows user to edit project title, description, and children
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

    // Handles PUT request to update project settings
    const callEditProject = async (formObject: object) => {
        try {
            const { data, status } = await callApi<{ id: string }>({
                method: "PUT",
                url: `/projects/${project?.id}`,
                data: { ...formObject, children: newChildren },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (status === 201) {
                console.log("Project edited successfully");
                navigate(`/projects/${data.id}`);
            }
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
            <Form onFinish={callEditProject} layout="vertical">
                {inputs.map(({ property, label }) => (
                    <Form.Item
                        name={property}
                        label={label}
                        rules={[{ required: true, message: `${property} is required` }]}
                        initialValue={project[property]}
                    >
                        <Input />
                    </Form.Item>
                ))}
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
