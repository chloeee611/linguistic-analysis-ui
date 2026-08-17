import { useEffect, useState } from "react";
import { api, handleError } from "@/api/api";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { Paragraph } from "@/components/paragraph";
import { NavLink } from "@/components/nav-link";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { Label } from "@/components/label";
import { User } from "@/model/user.types";

import styles from "./view-profile.module.scss";
import { Heading } from "@/components/heading";

type Field = {
    label: string;
    property: keyof User;
};

const fields: Field[] = [
    { label: "Name", property: "name" },
    { label: "Username", property: "username" },
    { label: "Email", property: "email" },
    { label: "Date of birth", property: "dob" },
    { label: "Bio", property: "bio" },
    { label: "Research Field", property: "research_field" },
    { label: "Location", property: "location" },
];

export const ViewProfile = () => {
    const [user, setUser] = useState<User>();
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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading level={1}>Profile</Heading>
                <Button>
                    <NavLink to="/profile/edit">Edit</NavLink>
                </Button>
            </div>
            <div className={styles.fieldContainer}>
                {fields.map(({ label, property }) => (
                    <div className={styles.field}>
                        <Label>{label}</Label>
                        <Paragraph className={styles.property}>{user?.[property]}</Paragraph>
                    </div>
                ))}
            </div>
        </div>
    );
};
