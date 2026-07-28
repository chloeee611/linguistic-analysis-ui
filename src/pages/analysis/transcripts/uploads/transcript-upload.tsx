import { useNavigate } from "react-router";
import { SubmitEvent } from "react";
import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Form } from "@/components/form";
import { api } from "@/api/api";

import styles from "./transcript-upload.module.scss";

export const UploadTranscripts = () => {
    const navigate = useNavigate();

    const callUploadTranscript = async (event: SubmitEvent) => {
        event.preventDefault(); // Stop page from refreshing

        const formData = new FormData(event.target);

        const token = localStorage.getItem("token");
        const { status } = await api.post("/transcripts", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "multipart/form-data",
            },
        });

        if (status === 200) {
            navigate("/analysis/transcripts");
        }
    };

    return (
        <div className={styles.container}>
            <Heading>Upload Transcript</Heading>

            <Form onSubmit={callUploadTranscript}>
                <Input
                    name="uploaded_file"
                    type="file"
                    className={styles.uploadInput}
                />
                <Button htmlType="submit" type="primary">
                    Upload Transcript
                </Button>
            </Form>
        </div>
    );
};
