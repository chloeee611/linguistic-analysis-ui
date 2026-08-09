import { FileTextOutlined, PieChartOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useProject } from "@/hooks/projects.hooks";
import { useMemo, useState } from "react";
import { NavLink } from "@/components/nav-link";

import styles from "./project-menu.module.scss";

type MenuItem = Required<MenuProps>["items"][number];

export const ProjectMenu = () => {
    const [current, setCurrent] = useState("/dashboard");

    const { project } = useProject();

    const projectItems: MenuItem[] = useMemo(() => {
        if (project === undefined) {
            return [];
        }

        const projectUrlString = `/projects/${project.id}`;

        return [
            {
                key: "/",
                icon: <PieChartOutlined />,
                label: <NavLink to={`${projectUrlString}/`}>Dashboard</NavLink>,
            },
            {
                key: "/transcripts",
                icon: <FileTextOutlined />,
                label: <NavLink to={`${projectUrlString}/transcripts`}>Transcripts</NavLink>,
            },
            {
                key: "/analysis",
                icon: <SearchOutlined />,
                label: <NavLink to={`${projectUrlString}/analysis`}>Analysis</NavLink>,
            },
            {
                key: "/settings",
                icon: <SettingOutlined />,
                label: <NavLink to={`${projectUrlString}/settings`}>Project Settings</NavLink>,
            },
        ];
    }, [project]);

    const onClick: MenuProps["onClick"] = (e) => {
        setCurrent(e.key);
    };

    return project ? (
        <Menu
            className={styles.projectMenu}
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={projectItems}
        />
    ) : (
        <div></div>
    );
};
