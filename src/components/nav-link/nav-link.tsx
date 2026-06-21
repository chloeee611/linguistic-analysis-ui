import type { FC } from "react";
import {
    NavLink as ENavLink,
    type NavLinkProps as ENavLinkProps,
} from "react-router";
import styles from "./nav-link.module.scss";

type NavLinkProps = ENavLinkProps;

export const NavLink: FC<NavLinkProps> = ({ to, children }) => {
    return (
        <ENavLink to={to} className={styles.navLink}>
            {children}
        </ENavLink>
    );
};
