import { useCallback, useEffect, useState, type SubmitEvent } from "react";
import { parseFormData } from "../../../helpers/form.helpers";
import { useNavigate } from "react-router";
import { Paragraph } from "../../../components/paragraph";
import { Project } from "../../../model/project.types";
import { Heading } from "../../../components/heading";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { Label } from "../../../components/label";
import { Form } from "../../../components/form";
import { api } from "../../../api/api";

export const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [wordCount, setWordCount] = useState(null);

    const navigate = useNavigate();

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

    const loadProjects = useCallback(async () => {
        const token = localStorage.getItem("token");

        try {
            const { data } = await api.get<Project[]>("/projects", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProjects(data);
        } catch {
            navigate("/login");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

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
            <Heading>Projects</Heading>

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
                    <Paragraph>{project.title}</Paragraph>

                    <Paragraph>{project.description}</Paragraph>

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
            <Paragraph>Word count: {wordCount}</Paragraph>
            {/* TODO: change the hardcoded transcript name */}
            <Button onClick={() => callAnalyseWordCount("010920.cha")}>
                Analyse Word Count
            </Button>
        </div>
    );
};
