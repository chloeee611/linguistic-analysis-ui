import {
    CommentOutlined,
    FileTextOutlined,
    FolderOpenOutlined,
    LogoutOutlined,
    PieChartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation } from "react-router";
import { Menu, MenuProps } from "antd";
import { Paragraph } from "@/components/paragraph";
import { useState } from "react";
import { NavLink } from "@/components/nav-link";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";

import styles from "./nav-menu.module.scss";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    {
        key: "/",
        icon: <PieChartOutlined />,
        label: <NavLink to="/">Dashboard</NavLink>,
    },
    {
        key: "/projects",
        icon: <FolderOpenOutlined />,
        label: <NavLink to="/projects">Projects</NavLink>,
    },
    {
        key: "/transcripts",
        icon: <FileTextOutlined />,
        label: <NavLink to="/transcripts">Transcripts</NavLink>,
    },
    {
        key: "profile-group",
        icon: <UserOutlined />,
        label: "Profile",
        children: [
            {
                key: "/profile",
                label: <NavLink to="/profile">View</NavLink>,
            },
            {
                key: "/profile/edit",
                label: <NavLink to="/profile/edit">Edit</NavLink>,
            },
        ],
    },
    {
        key: "/logout",
        icon: <LogoutOutlined />,
        label: <NavLink to="/login">Logout</NavLink>,
        onClick: () => {
            localStorage.removeItem("token");
        },
    },
];

export const NavMenu = () => {
    const [current, setCurrent] = useState("mail");

    const location = useLocation();
    const { user } = useUser();

    const onClick: MenuProps["onClick"] = (e) => {
        console.log("click ", e);
        setCurrent(e.key);
    };

    return (
        <div className={styles.pageContainer}>
            {/* <Button type="primary" onClick={toggleDrawer}>
                Open
            </Button> */}
            <div className={styles.navMenuContainer}>
                <NavLink className={styles.logo} to="/">
                    <CommentOutlined />
                    ling.ui.ni
                </NavLink>

                <Menu
                    defaultSelectedKeys={[location.pathname]}
                    defaultOpenKeys={["sub1"]}
                    mode="inline"
                    theme="light"
                    items={items}
                    className={styles.navMenu}
                />
            </div>

            <div className={styles.main}>
                <div className={styles.header}>
                    <Menu
                        className={styles.projectMenu}
                        onClick={onClick}
                        selectedKeys={[current]}
                        mode="horizontal"
                        items={items}
                    />

                    {user?.id ? (
                        <div>
                            <Paragraph>{user.name}</Paragraph>
                            <Paragraph>{user.email}</Paragraph>
                        </div>
                    ) : (
                        <NavLink to="/login">
                            <Button>Login</Button>
                        </NavLink>
                    )}
                </div>

                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
