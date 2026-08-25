import { useNavigate } from "react-router";
import { Form, Space } from "antd";
import { Paragraph } from "@/components/paragraph";
import { useState } from "react";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Input } from "@/components/input";
import { Label } from "@/components/label";

import styles from "./create-project.module.scss";

// Defines input fields for create project form
const inputs = [
    {
        id: "title",
        label: "Title",
    },
    {
        id: "description",
        label: "Description",
    },
];

// Displays the create project form
export const CreateProject = () => {
    const [currentChild, setCurrentChild] = useState<string>("");
    const [currentChildren, setCurrentChildren] = useState<string[]>([]);

    const navigate = useNavigate();
    const { token } = useUser();
    const { callApi } = useApi();

    const callCreateProject = async (formObject: object) => {
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
    };

    return (
        <div className={styles.container}>
            <Heading level={1}>Create Project</Heading>

            <Form onFinish={callCreateProject} layout="vertical">
                {inputs.map(({ id, label }) => (
                    <Form.Item name={id} label={label} rules={[{ required: true, message: `${id} is required` }]}>
                        <Input />
                    </Form.Item>
                ))}
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
