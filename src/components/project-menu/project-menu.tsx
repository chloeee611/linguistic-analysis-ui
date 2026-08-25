import { FileTextOutlined, PieChartOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useLocation } from "react-router";
import { useProject } from "@/hooks/projects.hooks";
import { NavLink } from "@/components/nav-link";
import { useMemo } from "react";
import { Button } from "../button";

import styles from "./project-menu.module.scss";

type MenuItem = Required<MenuProps>["items"][number];

const regex = /^\/projects\/\d+(?<route>\/(.*?))(?:\/(.*?))?$/i;

export const ProjectMenu = () => {
    const { pathname } = useLocation();

    // Get the current project route
    const current = useMemo(() => {
        const regexMatch = pathname.match(regex);
        return regexMatch?.groups?.["route"] ?? "/";
    }, [pathname]);

    const { project } = useProject();

    // List of menu items in the projects sub-menu
    const projectItems = useMemo<MenuItem[]>(() => {
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
                label: "Analysis",
                children: [
                    {
                        key: "/analysis/kwal",
                        label: <NavLink to={`${projectUrlString}/analysis/kwal`}>Search</NavLink>,
                    },
                    {
                        key: "/analysis/",
                        label: <NavLink to={`${projectUrlString}/analysis`}>Results</NavLink>,
                    },
                ],
            },
            {
                key: "/settings",
                icon: <SettingOutlined />,
                label: <NavLink to={`${projectUrlString}/settings`}>Project Settings</NavLink>,
            },
        ];
    }, [project]);

    return project ? (
        <Menu className={styles.projectMenu} selectedKeys={[current]} mode="horizontal" items={projectItems} />
    ) : (
        <NavLink to="/projects/create">
            <Button type="secondary" gradient>
                Create Project
            </Button>
        </NavLink>
    );
};
