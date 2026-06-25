import { useEffect } from "react";

export const Dashboard = () => {
    useEffect(() => {
        console.log(`token - `, localStorage.getItem("token"));
    }, []);

    return <div>Dashboard</div>;
};
