/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useMemo, useCallback, useContext, useEffect, useState } from "react";
import { api, handleError } from "@/api/api";
import { User, UserJWT } from "@/model/user.types";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";

export type UserContextProps = {
    user: User | undefined;
    token: string | null;
    login: (user: UserJWT) => void;
    logout: () => void;
};

export const UserContext = createContext<UserContextProps>({
    user: undefined,
    token: null,
    login: () => {},
    logout: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>();

    const navigate = useNavigate();

    const token = useMemo(() => {
        return localStorage.getItem("token");
    }, []);

    const login = useCallback(({ token }: UserJWT) => {
        localStorage.setItem("token", token);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
    }, []);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const { data, status } = await api.get<User>("/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (status === 200) {
                    setUser(data);
                }
            } catch (error) {
                handleError(error as AxiosError, navigate);
            }
        };

        if (token) {
            getCurrentUser();
        }
    }, [token, navigate]);

    return <UserContext value={{ user, token, login, logout }}>{children}</UserContext>;
};

export const useUser = () => {
    const { user, token, login, logout } = useContext(UserContext);

    return { user, token, login, logout };
};
