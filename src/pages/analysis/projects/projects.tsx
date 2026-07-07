import { useEffect, useState, type SubmitEvent } from "react";
import { parseFormData } from "../../../helpers/form.helpers";
import type { Project } from "../../../model/project.types";
import { useNavigate } from "react-router";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { Label } from "../../../components/label";
import { Form } from "../../../components/form";
import { api } from "../../../api/api";

export const Projects = () => {
    const navigate = useNavigate();

    const [projects, setProjects] = useState<Project[]>([]);
    const [wordCount, setWordCount] = useState(null);

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

    const analyseWordCount = async (transcriptName: string) => {
        const token = localStorage.getItem("token");
        const { data } = await api.post(
            `analysis/frequency/${transcriptName}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );
        return data;
    };

    const callAnalyseWordCount = async (transcriptName: string) => {
        try {
            const result = await analyseWordCount(transcriptName);
            setWordCount(result.wordCount);
        } catch (error) {
            console.log(error);
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

            {/* TODO: create separate component for this */}
            {projects.map((project) => (
                <div key={project.id}>
                    <h3>{project.title}</h3>

                    <p>{project.description}</p>

                    <Button
                        onClick={() =>
                            navigate(`/analysis/projects/${project.id}`)
                        }
                    >
                        View Details
                    </Button>
                </div>
            ))}

            <h3>Results</h3>
            <p>Word count: {wordCount}</p>
            {/* TODO: change the hardcoded transcript name */}
            <Button onClick={() => callAnalyseWordCount("010920.cha")}>
                Analyse Word Count
            </Button>

            <Input name="uploaded_file" type="file" />
        </div>
    );
};
