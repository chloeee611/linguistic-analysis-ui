import { type SubmitEvent } from "react";
import { parseFormData } from "../../../helpers/form.helpers";
import type { Project } from "../../../model/user.types";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { Label } from "../../../components/label";
import { Form } from "../../../components/form";
import { api } from "../../../api/api";

export const Projects = () => {
    const callCreateProject = async (event: SubmitEvent) => {
        try {
            const token = localStorage.getItem("token");
            const formObject = parseFormData<Project>(event);
            const { status } = await api.post("/projects", formObject, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (status === 201) {
                console.log("Project created successfully");
            }

            // TODO: return newly created project id, then navigate to new project page
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Projects</h1>

            <Form onSubmit={callCreateProject}>
                <Label>Title</Label>
                <Input name="title" />
                <Label>Description</Label>
                <Input name="description" />
                <Button htmlType="submit" type="primary">
                    Create Project
                </Button>
            </Form>

            <Input name="uploaded_file" type="file" />
        </div>
    );
};
