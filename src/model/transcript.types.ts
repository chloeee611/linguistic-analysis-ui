import { PaginationLinks, PaginationMeta } from "@/api/api";

export type Transcript = {
    id: number;
    project_id: number;
    title: string;
    file_url: string;
    metadata: Record<string, unknown>;
};

export type TranscriptMetadata = {
    id: Record<string, TranscriptSpeaker>;
    date: string;
    types: string[];
    comment: string[];
    languages: string[];
    situation: string;
    participants: Record<string, string>;
};

export type TranscriptSpeaker = {
    age: string;
    role: string;
    corpus: string;
    languages_spoken: string[];
    participant_code: string;
};

export type TranscriptContent = {
    content: string[];
    links: PaginationLinks;
    meta: PaginationMeta;
};
