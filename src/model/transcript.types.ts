export type Transcript = {
    id: string;
    project_id: string;
    title: string;
    file_url: string;
    metadata: TranscriptMetadata;
    child_id: string;
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

export type TranscriptContentUtterance = {
    utterance?: string;
    speaker?: string;
    [key: string]: string | undefined;
};
