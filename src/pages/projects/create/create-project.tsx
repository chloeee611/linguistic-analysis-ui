import { SubmitEvent, useState } from "react";
import { parseFormData } from "@/helpers/form.helpers";
import { useNavigate } from "react-router";
import { Paragraph } from "@/components/paragraph";
import { Project } from "@/model/project.types";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Space } from "antd";
import { Form } from "@/components/form";

import styles from "./create-project.module.scss";

export const CreateProject = () => {
    const [currentChild, setCurrentChild] = useState<string>("");
    const [currentChildren, setCurrentChildren] = useState<string[]>([]);

    const navigate = useNavigate();
    const { token } = useUser();
    const { callApi } = useApi();

    const callCreateProject = async (event: SubmitEvent) => {
        event.preventDefault();

        const formObject = parseFormData<Project>(event);

        const { data, status } = await callApi<{ id: string }>({
            method: "POST",
            url: "/projects",
            data: { ...formObject, children: currentChildren },
            headers: { Authorization: `Bearer ${token}` },
        });

        if (status === 201) {
            console.log("Project created successfully");
            navigate(`/projects/${data.id}`);
        }

        // TODO: return newly created project id, then navigate to new project page
    };

    return (
        <div className={styles.container}>
            <Heading level={1}>Create Project</Heading>

            <Form onSubmit={callCreateProject}>
                <Label>Title</Label>
                <Input name="title" />
                <Label>Description</Label>
                <Input name="description" />
                <Label>Children</Label>
                <Space.Compact style={{ width: "100%" }}>
                    <Input value={currentChild} onChange={(event) => setCurrentChild(event.target.value)} />
                    <Button
                        type="primary"
                        onClick={() => {
                            if (currentChild) {
                                setCurrentChildren((children) => [...children, currentChild]);
                                setCurrentChild("");
                            }
                        }}
                    >
                        Add Child
                    </Button>
                </Space.Compact>
                {currentChildren.map((child) => (
                    <Paragraph>{child}</Paragraph>
                ))}
                <div className={styles.buttons}>
                    <Button htmlType="submit" type="primary">
                        Create Project
                    </Button>
                </div>
            </Form>
        </div>
    );
};
