import { User, UserJWT } from "../../model/user.types";
import { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { Heading } from "@/components/heading";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Field } from "@/model/form.types";
import { Form } from "antd";
import { api } from "../../api/api";

import styles from "./register.module.scss";

// Defines the input fields for the register form which includes the validation rules
const inputs: Field<User>[] = [
    {
        property: "name",
        label: "Name",
        type: "text",
    },
    {
        property: "username",
        label: "Username",
        type: "text",
        rules: [{ min: 3, max: 15, message: "Username must be 3-15 characters long" }],
    },
    {
        property: "email",
        label: "Email",
        type: "email",
    },
    {
        property: "password",
        label: "Password",
        type: "password",
        rules: [
            { min: 8, message: "Password must have a minimum length of 8" },
            {
                pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
                message: "Password must contain at least one lowercase letter, one uppercase letter, and one number",
            },
        ],
    },
];

// This component renders the registration form and handles the registration process
export const Register = () => {
    const navigate = useNavigate();

    // Handles registration by sending POST request to Express API and navigates to login page if successful
    const callRegister = async (event: SubmitEvent) => {
        try {
            event.preventDefault();
            const formObject = Object.fromEntries(new FormData(event.target).entries());
            const { status } = await api.post<UserJWT>("/register", formObject);

            if (status === 201) {
                navigate("/login");
            }
        } catch (error) {
            console.error("Could not load users", error);
        }
    };

    return (
        <div className={styles.container}>
            <Heading level={1}>Register</Heading>
            <Form onFinish={callRegister} layout="vertical" style={{ width: 600 }}>
                {inputs.map(({ property, label, type, rules }) => (
                    <Form.Item
                        name={property}
                        label={label}
                        rules={[{ required: true, message: `${property} is required` }, ...(rules ?? [])]}
                    >
                        <Input type={type} />
                    </Form.Item>
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
