import type { SubmitEvent } from "react";
import type { UserJWT } from "../../model/user.types";
import { useNavigate } from "react-router";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Form } from "../../components/form";
import { api } from "../../api/api";

export const Login = () => {
    const navigate = useNavigate();

    const callLogin = async (event: SubmitEvent) => {
        try {
            event.preventDefault();
            const formObject = Object.fromEntries(
                new FormData(event.target).entries(),
            );
            const { data } = await api.post<UserJWT>("/login", formObject);
            localStorage.setItem("token", data.token);

            navigate("/analysis");
        } catch (error) {
            console.error("Could not load users", error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <Form onSubmit={callLogin}>
                <Label>Username</Label>
                <Input name="username" />
                <Label>Password</Label>
                <Input name="password" type="password" />
                <Button htmlType="submit" type="primary">
                    Login
                </Button>
            </Form>
        </div>
    );
};
