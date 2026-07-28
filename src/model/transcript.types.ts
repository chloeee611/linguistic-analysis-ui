export type Transcript = {
    id: number;
    project_id: number;
    title: string;
    file_url: string;
    metadata: Record<string, unknown>;
};

// TODO: make TranscriptMetadata type
