import { Button, Drawer } from "antd";
import { useState } from "react";
import { NavLink } from "../../components/nav-link";
import { Outlet } from "react-router";

export const NavMenu = () => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button type="primary" onClick={showDrawer}>
                Open
            </Button>
            <Drawer
                title="ling.ui.ni"
                placement="left"
                closable={{ "aria-label": "Close Button" }}
                onClose={onClose}
                open={open}
            >
                <NavLink to="/analysis">Dashboard</NavLink>
                <NavLink to="/analysis/count">Home</NavLink>
                <NavLink to="/login">Login</NavLink>
            </Drawer>
            <Outlet />
        </div>
    );
};
