import { GetProp, Progress, Select, Spin, Upload, UploadFile, UploadProps } from "antd";
import { SubmitEvent, useEffect, useMemo, useState } from "react";
import { TranscriptUploadTask } from "@/model/task.types";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useProject } from "@/hooks/projects.hooks";
import { Paragraph } from "@/components/paragraph";
import { Children } from "@/model/project.types";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { api } from "@/api/api";

import styles from "./upload-transcript.module.scss";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const UploadTranscript = () => {
    const [total, setTotal] = useState<number>();
    const [progress, setProgress] = useState<number>();
    const [currentChild, setCurrentChild] = useState<string>();
    const [children, setChildren] = useState<Children[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
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

        if (currentChild === undefined) {
            console.error("Implement child validation");
            return;
        }

        const formData = new FormData(event.target);
        formData.append("child_id", currentChild);
        fileList.forEach((file) => {
            formData.append("uploaded_file", file as FileType);
        });

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

    const statusText = useMemo(() => {
        switch (uploadStatus) {
            case "running":
                return "Uploading files, this will continue in the background";
            case "success":
                return "Upload Complete!";
            case "failed":
                return "Upload Failed";
        }
    }, [uploadStatus]);

    useEffect(() => {
        const getChildren = async () => {
            if (project?.id !== undefined) {
                const { data, status } = await api.get<Children[]>(`/projects/${project.id}/children`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "content-type": "multipart/form-data",
                    },
                });

                if (status === 200) {
                    setChildren(data);
                }
            }
        };

        getChildren();
    }, [project, token]);

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

                setUploadStatus(data.status);

                switch (data.status) {
                    case "running":
                    case "success":
                        setProgress(data.content.transcriptsCompleted);
                        break;
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [taskLocation, total, navigate, project, uploadStatus, token]);

    if (project === undefined) {
        return <Spin />;
    }

    const uploadProps: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (_, newFiles) => {
            setFileList([...fileList, ...newFiles]);

            return false;
        },
        fileList,
        multiple: true,
        showUploadList: false,
        className: styles.upload,
        maxCount: 50,
        disabled: uploadStatus !== "pending",
    };

    return (
        <div className={styles.container}>
            <Heading level={1}>Upload Project Transcript</Heading>

            <Form className={styles.form} onSubmit={callUploadTranscript}>
                <Upload.Dragger {...uploadProps}>
                    {total !== undefined && progress !== undefined ? (
                        <div className={styles.progressContainer}>
                            <Progress
                                type="circle"
                                percent={(progress / total) * 100}
                                format={() => `${progress}/${total}`}
                                status={
                                    uploadStatus === "failed"
                                        ? "exception"
                                        : uploadStatus === "success"
                                          ? "success"
                                          : "active"
                                }
                            />
                            {statusText}
                        </div>
                    ) : (
                        <>
                            <UploadOutlined className={styles.uploadIcon} />
                            <Heading level={2}>Upload Transcripts</Heading>
                            <Paragraph>
                                Upload up to 50 transcripts at a time. Files must be .cha format, and will be uploaded
                                as a background task
                            </Paragraph>
                            {fileList.length > 0 && (
                                <Paragraph className={styles.fileCount}>{fileList.length} files added</Paragraph>
                            )}
                        </>
                    )}
                </Upload.Dragger>
                <input name="project_id" value={project.id} hidden />

                <Select
                    placeholder="Select a child"
                    onChange={(value) => {
                        setCurrentChild(value);
                    }}
                    value={currentChild}
                    options={children.map(({ id, name }) => ({ value: id, label: name }))}
                    disabled={uploadStatus !== "pending"}
                />

                {uploadStatus === "pending" ? (
                    <Button htmlType="submit" type="primary">
                        Upload Transcript
                    </Button>
                ) : (
                    <Button
                        htmlType="button"
                        type="primary"
                        onClick={() => navigate(`/projects/${project.id}/transcripts`)}
                    >
                        Go to Transcripts
                    </Button>
                )}
            </Form>
        </div>
    );
};
