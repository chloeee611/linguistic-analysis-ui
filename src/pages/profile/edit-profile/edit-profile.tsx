import { useNavigate } from "react-router";
import { Heading } from "@/components/heading";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";
import { useApi } from "@/hooks/api.hooks";
import { Input } from "@/components/input";
import { Field } from "@/model/form.types";
import { User } from "@/model/user.types";
import { Form } from "antd";

import styles from "./edit-profile.module.scss";
import { Spin } from "@/components/spin";

const fields: Field<User>[] = [
    {
        label: "Name",
        property: "name",
        type: "text",
        disabled: true,
    },
    { label: "Username", property: "username", type: "text", disabled: true },
    { label: "Email", property: "email", type: "email", required: true },
    { label: "Date of birth", property: "dob", type: "date", required: true },
    { label: "Bio", property: "bio", type: "text" },
    { label: "Research Field", property: "research_field", type: "text" },
    { label: "Location", property: "location", type: "text" },
];

export const EditProfile = () => {
    // const [user, setUser] = useState<Partial<User>>();
    const navigate = useNavigate();
    const { token } = useUser();
    const { callApi } = useApi();

    const { user } = useUser();

    // useEffect(() => {
    //     const loadProfile = async () => {
    //         const { data } = await callApi<User>({
    //             method: "GET",
    //             url: "/users/me",
    //             headers: { Authorization: `Bearer ${token}` },
    //         });

    //         setUser(data);
    //     };

    //     loadProfile();
    // }, [token, callApi]);

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = event.target;

    //     setUser((user) => ({
    //         ...user,
    //         [name]: value,
    //     }));
    // };

    const callEditProfile = async (updatedUser: User) => {
        if (!updatedUser) {
            console.error("Error with this profile");
            return;
        }

        await callApi({
            method: "PUT",
            url: "/users/me",
            data: {
                email: updatedUser.email,
                dob: updatedUser.dob,
                bio: updatedUser.bio,
                research_field: updatedUser.research_field,
                location: updatedUser.location,
            },
            headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/profile");
    };

    if (!user) {
        return <Spin />;
    }

    return (
        <Form className={styles.container} onFinish={callEditProfile} layout="vertical">
            <div className={styles.header}>
                <Heading level={1}>Profile</Heading>
                <Button htmlType="submit">Save</Button>
            </div>
            <div className={styles.fieldContainer}>
                {fields.map(({ label, property, type, disabled, required }) => (
                    <Form.Item
                        initialValue={user?.[property]}
                        name={property}
                        label={label}
                        rules={[{ required, message: `${property} is required` }]}
                    >
                        <Input className={styles.property} type={type} disabled={disabled} />
                    </Form.Item>
                ))}
            </div>
        </Form>
    );
};
