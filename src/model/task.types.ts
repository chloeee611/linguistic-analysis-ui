export type Task = {
    id: string;
    type: "task_upload";
    status: "pending" | "running" | "success" | "failed" | "cancelled";
};

export type TranscriptUploadTask = Task & {
    content: { transcriptsCompleted: number; totalTranscripts: number };
};
