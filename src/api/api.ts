import axios, { AxiosError } from "axios";

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

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

export const handleError = (error: AxiosError, callback: (path: string) => void) => {
    if (error.response?.status && error.response.status === 403) {
        callback("/login");
    } else {
        console.error(error);
        throw error;
    }
};
