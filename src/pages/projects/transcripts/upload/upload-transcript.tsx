import { SubmitEvent, useEffect, useState } from "react";
import { TranscriptUploadTask } from "@/model/task.types";
import { useNavigate } from "react-router";
import { useProject } from "@/hooks/projects.hooks";
import { Progress, Spin } from "antd";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { api } from "@/api/api";

import styles from "./upload-transcript.module.scss";

export const UploadTranscript = () => {
    const [progress, setProgress] = useState<number>();
    const [total, setTotal] = useState<number>();
    const [taskLocation, setTaskLocation] = useState<string>();
    const [uploadStatus, setUploadStatus] = useState<TranscriptUploadTask["status"]>("pending");

    const navigate = useNavigate();
    const { token } = useUser();
    const { project } = useProject();

    const callUploadTranscript = async (event: SubmitEvent) => {
        event.preventDefault(); // Stop page from refreshing

        if (!project) {
            console.error("Error with project ID");
            return;
        }

        const formData = new FormData(event.target);

        const { data, status } = await api.post(`/projects/${project.id}/transcripts`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "multipart/form-data",
            },
        });

        if (status === 202) {
            setTaskLocation(data.location);
        }
    };

    useEffect(() => {
        if (!taskLocation) {
            return;
        }

        if (uploadStatus === "failed" || uploadStatus === "success") {
            return;
        }

        const interval = setInterval(async () => {
            const { data, status } = await api.get<TranscriptUploadTask>(taskLocation, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "multipart/form-data",
                },
            });

            if (status === 200) {
                if (!total) {
                    setTotal(data.content.totalTranscripts);
                }

                switch (data.status) {
                    case "failed":
                        setUploadStatus("failed");
                        break;
                    case "running":
                        setProgress(data.content.transcriptsCompleted);
                        break;
                    case "success":
                        setProgress(data.content.transcriptsCompleted);
                        setUploadStatus("success");
                        break;
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [taskLocation, total, navigate, project, uploadStatus, token]);

    if (project === undefined) {
        return <Spin />;
    }

    return (
        <div className={styles.container}>
            <Heading level={1}>Upload Project Transcript</Heading>

            <Form onSubmit={callUploadTranscript}>
                <input name="uploaded_file" type="file" multiple />
                <input name="project_id" value={project.id} hidden />
                <Button htmlType="submit" type="primary">
                    Upload Transcript
                </Button>
            </Form>

            {total !== undefined && progress !== undefined && (
                <div>
                    <Progress type="circle" percent={(progress / total) * 100} format={() => `${progress}/${total}`} />
                </div>
            )}
        </div>
    );
};
