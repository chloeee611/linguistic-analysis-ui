import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Paragraph } from "@/components/paragraph";
import { Label } from "@/components/label";
import { User } from "@/model/user.types";
import { api, handleError } from "@/api/api";
import { AxiosError } from "axios";

import styles from "./view-profile.module.scss";

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
    { label: "Research Field", property: "researchField" },
    { label: "Location", property: "location" },
];

export const ViewProfile = () => {
    const [user, setUser] = useState<User>();
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem("token");

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
    }, [navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.fieldContainer}>
                {fields.map(({ label, property }) => (
                    <div className={styles.field}>
                        <Label>{label}</Label>
                        <Paragraph className={styles.property}>
                            {user?.[property]}
                        </Paragraph>
                    </div>
                ))}
            </div>
        </div>
    );
};
