import type { SubmitEvent } from "react";
import type { UserJWT } from "../../model/user.types";
import { useNavigate } from "react-router";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Form } from "../../components/form";
import { api } from "../../api/api";

export const Register = () => {
    const navigate = useNavigate();

    const callRegister = async (event: SubmitEvent) => {
        try {
            event.preventDefault();
            const formObject = Object.fromEntries(
                new FormData(event.target).entries(),
            );
            const { status } = await api.post<UserJWT>("/register", formObject);

            if (status === 201) {
                navigate("/login");
            } // TODO handle error if register fails
        } catch (error) {
            console.error("Could not load users", error);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <Form onSubmit={callRegister}>
                <Label>Name</Label>
                <Input name="name" />
                <Label>Username</Label>
                <Input name="username" />
                <Label>Email</Label>
                <Input name="email" />
                <Label>Password</Label>
                <Input name="password" type="password" />
                <Button htmlType="submit" type="primary">
                    Register
                </Button>
            </Form>
        </div>
    );
};
