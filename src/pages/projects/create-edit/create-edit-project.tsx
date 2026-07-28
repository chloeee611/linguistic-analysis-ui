import { parseFormData } from "@/helpers/form.helpers";
import { useNavigate } from "react-router";
import { SubmitEvent } from "react";
import { Project } from "@/model/project.types";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Form } from "@/components/form";
import { api } from "@/api/api";

export const CreateEditProject = () => {
    const navigate = useNavigate();

    const callCreateProject = async (event: SubmitEvent) => {
        try {
            const token = localStorage.getItem("token");
            const formObject = parseFormData<Project>(event);
            const { data, status } = await api.post("/projects", formObject, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (status === 201) {
                console.log("Project created successfully");
                await navigate(`/projects/${data.id}`);
            }

            // TODO: return newly created project id, then navigate to new project page
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Heading>Create Project</Heading>

            <Form onSubmit={callCreateProject}>
                <Label>Title</Label>
                <Input name="title" />
                <Label>Description</Label>
                <Input name="description" />
                <Button htmlType="submit" type="primary">
                    Create Project
                </Button>
            </Form>
        </div>
    );
};
