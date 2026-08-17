import { useEffect, useState } from "react";
import { api, handleError } from "@/api/api";
import { useNavigate } from "react-router";
import { InputProps } from "@/components/input/input";
import { AxiosError } from "axios";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { User } from "@/model/user.types";
import { Form } from "@/components/form";

import styles from "./edit-profile.module.scss";
import { Heading } from "@/components/heading";

type Field = {
    type: InputProps["type"];
    label: string;
    property: keyof User;
    disabled?: boolean;
    required?: boolean;
};

const fields: Field[] = [
    {
        label: "Name",
        property: "name",
        type: "text",
        disabled: true,
    },
    { label: "Username", property: "username", type: "text", disabled: true },
    { label: "Email", property: "email", type: "email" },
    { label: "Date of birth", property: "dob", type: "date" },
    { label: "Bio", property: "bio", type: "text" },
    { label: "Research Field", property: "research_field", type: "text" },
    { label: "Location", property: "location", type: "text" },
];

export const EditProfile = () => {
    const [user, setUser] = useState<Partial<User>>();
    const navigate = useNavigate();
    const { token } = useUser();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { data } = await api.get<User>("/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(data);
            } catch (err) {
                handleError(err as AxiosError, navigate);
            }
        };

        loadProfile();
    }, [navigate, token]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setUser((user) => ({
            ...user,
            [name]: value,
        }));
    };

    const callEditProfile = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            console.error("Error with this profile");
            return;
        }

        try {
            await api.put(
                "/users/me",
                {
                    email: user.email,
                    dob: user.dob,
                    bio: user.bio,
                    research_field: user.research_field,
                    location: user.location,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            navigate("/profile");
        } catch (error) {
            handleError(error as AxiosError, navigate);
        }
    };

    return (
        <Form className={styles.container} onSubmit={callEditProfile}>
            <div className={styles.header}>
                <Heading level={1}>Profile</Heading>
                <Button htmlType="submit">Save</Button>
            </div>
            <div className={styles.fieldContainer}>
                {fields.map(({ label, property, type, disabled, required }) => (
                    <div className={styles.field}>
                        <Label>{label}</Label>
                        <Input
                            name={property}
                            className={styles.property}
                            type={type}
                            disabled={disabled}
                            onChange={handleChange}
                            value={user?.[property]}
                            required={required}
                        />
                    </div>
                ))}
            </div>
        </Form>
    );
};
