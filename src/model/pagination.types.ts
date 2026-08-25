/**
 * Defines the types related to pagination.
 * PaginationLinks represents the navigation links for paginated results.
 * PaginationMeta contains metadata about the current page, size, last page, and total items.
 * PaginatedResults is a generic type that combines the results with pagination links and metadata.
 */

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
