import { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { UserJWT } from "../../model/user.types";
import { Heading } from "@/components/heading";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Form } from "../../components/form";
import { api } from "../../api/api";

import styles from "./register.module.scss";

const inputs = [
    {
        id: "name",
        label: "Name",
    },
    {
        id: "username",
        label: "Username",
    },
    {
        id: "email",
        label: "Email",
        type: "email",
    },
    {
        id: "password",
        label: "Password",
        type: "password",
    },
];

export const Register = () => {
    const navigate = useNavigate();

    const callRegister = async (event: SubmitEvent) => {
        try {
            event.preventDefault();
            const formObject = Object.fromEntries(new FormData(event.target).entries());
            const { status } = await api.post<UserJWT>("/register", formObject);

            if (status === 201) {
                navigate("/login");
            } // TODO handle error if register fails
        } catch (error) {
            console.error("Could not load users", error);
        }
    };

    return (
        <div className={styles.container}>
            <Heading level={1}>Register</Heading>
            <Form onSubmit={callRegister}>
                {inputs.map(({ id, label, type }) => (
                    <>
                        <Label htmlFor={id}>{label}</Label>
                        <Input id={id} name={id} type={type} />
                    </>
                ))}
                <div className={styles.buttons}>
                    <Button htmlType="submit" type="primary">
                        Register
                    </Button>
                </div>
            </Form>
        </div>
    );
};
