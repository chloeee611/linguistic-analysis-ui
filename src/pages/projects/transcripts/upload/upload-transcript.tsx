import { SubmitEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { TranscriptUploadTask } from "@/model/task.types";
import { Progress } from "antd";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { api } from "@/api/api";

import styles from "./upload-transcript.module.scss";

export const UploadTranscript = () => {
    const { projectId } = useParams();

    const [progress, setProgress] = useState<number>();
    const [total, setTotal] = useState<number>();
    const [taskLocation, setTaskLocation] = useState<string>();
    const [uploadStatus, setUploadStatus] = useState<TranscriptUploadTask["status"]>("pending");

    const navigate = useNavigate();

    const callUploadTranscript = async (event: SubmitEvent) => {
        event.preventDefault(); // Stop page from refreshing

        if (!projectId) {
            console.error("Error with project ID");
            return;
        }

        const formData = new FormData(event.target);

        const token = localStorage.getItem("token");

        const { data, status } = await api.post(`/projects/${projectId}/transcripts`, formData, {
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

        const token = localStorage.getItem("token");

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
    }, [taskLocation, total, navigate, projectId, uploadStatus]);

    return (
        <div className={styles.container}>
            <Heading level={1}>Upload Project Transcript</Heading>

            <Form onSubmit={callUploadTranscript}>
                <input name="uploaded_file" type="file" multiple />
                <input name="project_id" value={projectId} hidden />
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
