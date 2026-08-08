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
import { NavLink } from "@/components/nav-link";

import styles from "./nav-menu.module.scss";
import { useState } from "react";

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
    const location = useLocation();

    const [current, setCurrent] = useState("mail");

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
                </div>

                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
