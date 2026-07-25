import {
    CommentOutlined,
    FileTextOutlined,
    LogoutOutlined,
    PieChartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Menu, type MenuProps } from "antd";
import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { NavLink } from "../../components/nav-link";

import styles from "./nav-menu.module.scss";
import clsx from "clsx";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    {
        key: "/analysis",
        icon: <PieChartOutlined />,
        label: <NavLink to="/analysis">Dashboard</NavLink>,
    },
    {
        key: "/analysis/projects",
        icon: <FileTextOutlined />,
        label: <NavLink to="/analysis/projects">Projects</NavLink>,
    },
    {
        key: "/profile",
        icon: <UserOutlined />,
        label: <NavLink to="/profile">Profile</NavLink>,
    },
    {
        key: "/logout",
        icon: <LogoutOutlined />,
        label: <NavLink to="/logout">Logout</NavLink>,
    },
];

export const NavMenu = () => {
    const [collapsed] = useState(false);
    const location = useLocation();

    // const toggleDrawer = () => {
    //     if (collapsed) {
    //         setCollapsed(false);
    //     } else {
    //         setCollapsed(true);
    //     }
    // };

    return (
        <div
            className={clsx(styles.pageContainer, {
                [styles.pageContainerCollapsed]: collapsed,
            })}
        >
            {/* <Button type="primary" onClick={toggleDrawer}>
                Open
            </Button> */}
            <div className={styles.navMenuContainer}>
                <NavLink className={styles.logo} to="/">
                    <CommentOutlined />
                    {!collapsed && "ling.ui.ni"}
                </NavLink>

                <Menu
                    defaultSelectedKeys={[location.pathname]}
                    defaultOpenKeys={["sub1"]}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={collapsed}
                    items={items}
                    className={styles.navMenu}
                />
            </div>

            <div className={styles.contentPadding}>
                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
