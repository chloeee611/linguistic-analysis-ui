import { AxiosError, AxiosRequestConfig } from "axios";
import { useCallback, useState } from "react";
import { api, handleError } from "@/api/api";
import { useNavigate } from "react-router";

// Provides a custom hook for making API calls with loading state management and error handling
export const useApi = () => {
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const callApi = useCallback(
        async <T extends object>(config: AxiosRequestConfig) => {
            try {
                setLoading(true);
                const response = await api<T>(config);
                setLoading(false);
                return response;
            } catch (err) {
                const error = err as AxiosError;
                handleError(error, navigate);
                throw err;
            }
        },
        [navigate]
    );

    return { loading, callApi };
};
