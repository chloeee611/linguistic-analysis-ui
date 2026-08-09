import { useLocation } from "react-router";
import { useMemo } from "react";

const titles: Record<string, string> = {
    "/projects/": "Project Listing",
    "/about": "About",
};

export const usePageTitle = () => {
    const location = useLocation();

    const pageTitle = useMemo(() => {
        console.log(`title.hook.ts:13 || location.pathname: `, location.pathname);
        return titles[location.pathname] ?? "ling.ui.ni";
    }, [location]);

    return { pageTitle };
};
