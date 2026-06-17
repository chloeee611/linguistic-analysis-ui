import { Count, Dashboard, Transcript } from "./pages/analysis";
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router";
import { Register } from "./pages/register/register";
import { Landing } from "./pages/landing/landing";
import { Login } from "./pages/login/login";
import { api } from "./api/api";

import "./App.css";

type User = {
    id: number;
    username: string;
    email: string;
};

function Router() {
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get<User[]>("/users");
                setUsers(data.map((user) => user.username));
                console.log(data);
            } catch (error) {
                console.error("Could not load users", error);
            }
        };
        fetchUsers();
    }, []);

    console.log(users);

    return (
        <Routes>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route path="analysis">
                <Route index element={<Dashboard />} />
                <Route path="count" element={<Count />} />
                <Route
                    path="transcript/:transcriptId"
                    element={<Transcript />}
                />
            </Route>
        </Routes>
    );
}

export default Router;
