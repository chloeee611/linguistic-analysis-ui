import { FileTextOutlined, PieChartOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useLocation } from "react-router";
import { useProject } from "@/hooks/projects.hooks";
import { NavLink } from "@/components/nav-link";
import { useMemo } from "react";

import styles from "./project-menu.module.scss";

type MenuItem = Required<MenuProps>["items"][number];

const regex = /^\/projects\/\d+(?<route>\/(.*?))(?:\/(.*?))?$/i;

export const ProjectMenu = () => {
    const { pathname } = useLocation();

    const current = useMemo(() => {
        const regexMatch = pathname.match(regex);
        return regexMatch?.groups?.["route"] ?? "/";
    }, [pathname]);

    const { project } = useProject();

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
                        key: "/analysis/mlu",
                        label: <NavLink to={`${projectUrlString}/analysis/mlu`}>Mean Length of Utterance</NavLink>,
                    },
                    {
                        key: "/analysis/freq",
                        label: <NavLink to={`${projectUrlString}/analysis/freq`}>Frequency</NavLink>,
                    },
                    {
                        key: "/analysis/lexrare",
                        label: <NavLink to={`${projectUrlString}/analysis/lexrare`}>Word Rarity</NavLink>,
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
        <div></div>
    );
};
