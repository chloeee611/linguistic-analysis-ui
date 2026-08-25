import axios, { AxiosError } from "axios";

// Create an Axios instance with a base URL and default headers
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Handles API errors and redirects to login if necessary
export const handleError = (error: AxiosError, callback: (path: string) => void) => {
    if (error.response?.status && error.response.status === 403) {
        callback("/login");
    } else {
        console.error(error);
        throw error;
    }
};
