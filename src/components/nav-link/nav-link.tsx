import type { FC } from "react";
import {
    NavLink as ENavLink,
    type NavLinkProps as ENavLinkProps,
} from "react-router";
import styles from "./nav-link.module.scss";
import clsx from "clsx";

type NavLinkProps = ENavLinkProps;

export const NavLink: FC<NavLinkProps> = ({
    to,
    children,
    className,
    ...rest
}) => {
    return (
        <ENavLink to={to} className={clsx(styles.navLink, className)} {...rest}>
            {children}
        </ENavLink>
    );
};
