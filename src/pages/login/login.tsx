import type { SubmitEvent } from "react";
import type { UserJWT } from "../../model/user.types";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Form } from "../../components/form";
import { api } from "../../api/api";
import { useNavigate } from "react-router";

export const Login = () => {
    const navigate = useNavigate();

    const fetchUsers = async (event: SubmitEvent) => {
        try {
            event.preventDefault();
            const formObject = Object.fromEntries(
                new FormData(event.target).entries(),
            );
            const { data } = await api.post<UserJWT>("/login", formObject);
            console.log(data);
            // TODO set token to session like the EJS project
            navigate("/analysis");
        } catch (error) {
            console.error("Could not load users", error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <Form onSubmit={fetchUsers}>
                <Label>Username</Label>
                <Input name="username" />
                <Label>Password</Label>
                <Input name="password" type="password" />
                <button type="submit">Login</button>
            </Form>
        </div>
    );
};
