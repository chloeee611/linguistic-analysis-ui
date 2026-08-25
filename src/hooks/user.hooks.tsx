/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { api, handleError } from "@/api/api";
import { User, UserJWT } from "@/model/user.types";
import { AxiosError } from "axios";

// Defines the shape of the user context properties
export type UserContextProps = {
    user: User | undefined;
    token: string | null;
    login: (user: UserJWT) => void;
    logout: () => void;
};

// Provides a context for managing the current user state and authentication
export const UserContext = createContext<UserContextProps>({
    user: undefined,
    token: null,
    login: () => {},
    logout: () => {},
});

// Component for UserContext that manages the current user state and authentication
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>();
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

    const login = useCallback(({ token }: UserJWT) => {
        localStorage.setItem("token", token);
        setToken(token);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
    }, []);

    // Fetches the current user data when the token changes and updates the user state
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
                handleError(error as AxiosError, () => {});
            }
        };

        if (token && !user) {
            getCurrentUser();
        } else if (!token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(undefined);
        }
    }, [token, user]);

    return <UserContext value={{ user, token, login, logout }}>{children}</UserContext>;
};

export const useUser = () => {
    const { user, token, login, logout } = useContext(UserContext);

    return { user, token, login, logout };
};
