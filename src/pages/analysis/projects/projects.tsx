import { useEffect, useState, type SubmitEvent } from "react";
import { parseFormData } from "../../../helpers/form.helpers";
import type { NewProject, Project } from "../../../model/project.types";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { Label } from "../../../components/label";
import { Form } from "../../../components/form";
import { api } from "../../../api/api";

export const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const callCreateProject = async (event: SubmitEvent) => {
        try {
            const token = localStorage.getItem("token");
            const formObject = parseFormData<NewProject>(event);
            const { status } = await api.post("/projects", formObject, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (status === 201) {
                console.log("Project created successfully");
            }

            await loadProjects();

            // TODO: return newly created project id, then navigate to new project page
        } catch (error) {
            console.error(error);
        }
    };

    const getAllProjects = async () => {
        const token = localStorage.getItem("token");
        const { data } = await api.get<Project[]>("/projects", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    };

    const loadProjects = async () => {
        const data = await getAllProjects();
        setProjects(data);
    };

    useEffect(() => {
        loadProjects();
    }, []);

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

            {/* TODO: create separate component for this */}
            {projects.map((project) => (
                <div key={project.id}>
                    <h3>{project.title}</h3>

                    <p>{project.description}</p>
                </div>
            ))}

            <Input name="uploaded_file" type="file" />
        </div>
    );
};
