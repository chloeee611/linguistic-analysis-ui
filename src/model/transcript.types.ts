import { PaginationLinks, PaginationMeta } from "@/api/api";

export type Transcript = {
    id: string;
    project_id: string;
    title: string;
    file_url: string;
    metadata: Record<string, unknown>;
};

export type SelectableTranscript = Transcript & {
    selected: boolean;
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
    content: TranscriptContentUtterance[];
    links: PaginationLinks;
    meta: PaginationMeta;
};

export type TranscriptContentUtterance = {
    utterance?: string;
    speaker?: string;
    [key: string]: string | undefined;
};
