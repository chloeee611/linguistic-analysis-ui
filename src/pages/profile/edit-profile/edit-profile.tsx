import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Label } from "@/components/label";
import { User } from "@/model/user.types";
import { api, handleError } from "@/api/api";
import { AxiosError } from "axios";

import styles from "./edit-profile.module.scss";
import { Input } from "@/components/input";
import { InputProps } from "@/components/input/input";

type Field = {
    label: string;
    type: InputProps["type"];
    disabled?: boolean;
    property: keyof User;
};

const fields: Field[] = [
    { label: "Name", property: "name", type: "text", disabled: true },
    { label: "Username", property: "username", type: "text", disabled: true },
    { label: "Email", property: "email", type: "email" },
    { label: "Date of birth", property: "dob", type: "date" },
    { label: "Bio", property: "bio", type: "text" },
    { label: "Research Field", property: "researchField", type: "text" },
    { label: "Location", property: "location", type: "text" },
];

export const EditProfile = () => {
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
                {fields.map(({ label, property, type, disabled }) => (
                    <div className={styles.field}>
                        <Label>{label}</Label>
                        <Input
                            name={property}
                            className={styles.property}
                            type={type}
                            disabled={disabled}
                            value={user?.[property]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
