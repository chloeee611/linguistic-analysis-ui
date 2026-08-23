import { parseFormData } from "../../helpers/form.helpers";
import { User, UserJWT } from "../../model/user.types";
import { useNavigate } from "react-router";
import { SubmitEvent } from "react";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Form } from "../../components/form";
import { api } from "../../api/api";

import styles from "./login.module.scss";

const inputs = [
    {
        id: "username",
        label: "Username",
    },
    {
        id: "password",
        label: "Password",
        type: "password",
    },
];

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useUser();

    const callLogin = async (event: SubmitEvent) => {
        try {
            event.preventDefault();
            const formObject = parseFormData<User>(event);
            const { data } = await api.post<UserJWT>("/login", formObject);
            await login(data);

            navigate("/home");
        } catch (error) {
            console.error("Could not load users", error);
        }
    };

    return (
        <div className={styles.container}>
            <Heading level={1}>Login</Heading>
            <Form onSubmit={callLogin}>
                {inputs.map(({ id, label, type }) => (
                    <>
                        <Label htmlFor={id}>{label}</Label>
                        <Input id={id} name={id} type={type} />
                    </>
                ))}
                <div className={styles.buttons}>
                    <Button htmlType="submit" type="primary">
                        Login
                    </Button>
                    <NavLink to="/register">
                        <Button htmlType="submit" type="outline">
                            Register
                        </Button>
                    </NavLink>
                </div>
            </Form>
        </div>
    );
};
