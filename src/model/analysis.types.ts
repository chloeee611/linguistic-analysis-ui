export type AnalysisType = "kwal" | "mlu" | "freq" | "lexrare";

export type LexRareResult = {
    [code: string]: {
        code: string;
        num_rare_words: number;
        num_total_words: number;
        num_common_words: number;
        percent_rare_words: number;
    };
};

export type KwalResult = {
    keyword: string;
    speaker: number;
    utterance: number;
    line_number: number;
};

export type FreqResult = {
    [code: string]: {
        counts: Record<string, number>;
        summary: {
            total_items: number;
            unique_word_ratio: number;
            total_unique_words: number;
        };
    };
};

export type MluResult = {
    counts: {
        [code: string]: {
            mlu: number;
            std: number;
            morphs: number;
            utterances: number;
        };
    };
};

export type AnalysisResult = {
    id: number;
    type: AnalysisType;
    created_at: string;
} & (
    | {
          type: "kwal";
          results: KwalResult[][];
      }
    | {
          type: "lexrare";
          results: LexRareResult[];
      }
    | {
          type: "freq";
          results: FreqResult[];
      }
    | {
          type: "mlu";
          results: MluResult[];
      }
);

export type AnalysisArgs = {
    kwal: {
        search_utterance?: string;
    };
    mlu: unknown;
    freq: {
        search?: string;
    };
    lexrare: {
        target_tier: "mor" | "utt";
    };
};
