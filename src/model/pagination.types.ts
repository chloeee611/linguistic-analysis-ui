export type PaginationLinks = {
    first: string;
    self: string;
    prev?: string;
    next?: string;
    last: string;
};

export type PaginationMeta = {
    page: number;
    size: number;
    lastPage: number;
    total: number;
};

export type PaginatedResults<T> = {
    results: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
};
