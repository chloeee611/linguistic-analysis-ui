import { type SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { api } from "@/api/api";

export const UploadProjectTranscript = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const callUploadTranscript = async (event: SubmitEvent) => {
        event.preventDefault(); // Stop page from refreshing

        if (!projectId) {
            console.error("Error with project ID");
            return;
        }

        const formData = new FormData(event.target);

        const token = localStorage.getItem("token");
        const { status } = await api.post("/transcripts", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "multipart/form-data",
            },
        });

        if (status === 200) {
            navigate(`/projects/${projectId}`);
        }
    };

    return (
        <div>
            <Heading>Upload Project Transcript</Heading>

            <Form onSubmit={callUploadTranscript}>
                <input name="uploaded_file" type="file" />
                <input name="project_id" value={projectId} hidden />
                <Button htmlType="submit" type="primary">
                    Upload Transcript
                </Button>
            </Form>
        </div>
    );
};
