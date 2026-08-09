import { useCallback, useEffect, useMemo, useState } from "react";
import { User, UserJWT } from "@/model/user.types";
import { api } from "@/api/api";

export const useUser = () => {
    const [user, setUser] = useState<User>();

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
            const { data, status } = await api.get<User>("/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (status === 200) {
                setUser(data);
            }
        };

        if (token) {
            getCurrentUser();
        }
    }, [token]);

    console.log(`user.hooks.ts:22 || user:`, user);

    return { user, token, login, logout };
};
