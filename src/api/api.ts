import axios, { AxiosError } from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

export const handleError = (
    error: AxiosError,
    callback: (path: string) => void,
) => {
    if (error.response?.status && error.response.status === 403) {
        callback("/login");
    } else {
        console.error(error);
    }
};
