import { useEffect, useState } from "react";
import { Paragraph } from "@/components/paragraph";
import { NavLink } from "@/components/nav-link";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Label } from "@/components/label";
import { User } from "@/model/user.types";
import { Spin } from "@/components/spin";

import styles from "./view-profile.module.scss";

type Field = {
    label: string;
    property: keyof User;
};

// Defines the fields in the user profile page
const fields: Field[] = [
    { label: "Name", property: "name" },
    { label: "Username", property: "username" },
    { label: "Email", property: "email" },
    { label: "Date of birth", property: "dob" },
    { label: "Bio", property: "bio" },
    { label: "Research Field", property: "research_field" },
    { label: "Location", property: "location" },
];

// Displays the user profile page with user information and an edit button
export const ViewProfile = () => {
    const [user, setUser] = useState<User>();
    const { token } = useUser();
    const { loading, callApi } = useApi();

    useEffect(() => {
        const loadProfile = async () => {
            const { data } = await callApi<User>({
                method: "GET",
                url: "/users/me",
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(data);
        };

        loadProfile();
    }, [token, callApi]);

    if (loading) {
        return <Spin />;
    }

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
