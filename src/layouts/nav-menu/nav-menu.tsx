import { CommentOutlined, FolderOpenOutlined, HomeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Outlet, useLocation } from "react-router";
import { Menu, MenuProps } from "antd";
import { ProjectMenu } from "@/components/project-menu";
import { Paragraph } from "@/components/paragraph";
import { NavLink } from "@/components/nav-link";
import { useUser } from "@/hooks/user.hooks";
import { Button } from "@/components/button";

import styles from "./nav-menu.module.scss";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    {
        key: "/",
        icon: <HomeOutlined />,
        label: <NavLink to="/">Home</NavLink>,
    },
    {
        key: "/projects",
        icon: <FolderOpenOutlined />,
        label: <NavLink to="/projects">Projects</NavLink>,
    },
    {
        key: "/profile",
        icon: <UserOutlined />,
        label: <NavLink to="/profile">Profile</NavLink>,
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
    const { user } = useUser();

    return (
        <div className={styles.pageContainer}>
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
                    <ProjectMenu />

                    {user?.id ? (
                        <div className={styles.user}>
                            <Paragraph className={styles.userName}>{user.name}</Paragraph>
                            <Paragraph className={styles.userEmail}>{user.email}</Paragraph>
                        </div>
                    ) : (
                        <NavLink to="/login">
                            <Button type="secondary" gradient>
                                Login
                            </Button>
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
