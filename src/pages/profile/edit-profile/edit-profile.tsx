import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Field } from "@/model/form.types";
import { User } from "@/model/user.types";
import { Spin } from "@/components/spin";

import styles from "./edit-profile.module.scss";
import { Form } from "antd";

const fields: Field<User>[] = [
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

        await callApi({
            method: "PUT",
            url: "/users/me",
            data: {
                email: user.email,
                dob: user.dob,
                bio: user.bio,
                research_field: user.research_field,
                location: user.location,
            },
            headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/profile");
    };

    if (loading) {
        return <Spin />;
    }

    return (
        <Form className={styles.container} onFinish={callEditProfile}>
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
