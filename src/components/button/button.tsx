import { Button as EButton, type ButtonProps as EButtonProps } from "antd";
import type { FC } from "react";

import styles from "./button.module.scss";
import clsx from "clsx";

type ButtonProps = Omit<EButtonProps, "type"> & {
    type?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    gradient?: boolean;
};

export const Button: FC<ButtonProps> = ({
    type = "primary",
    size = "medium",
    gradient = false,
    className,
    children,
    ...rest
}) => {
    return (
        <EButton
            className={clsx(styles.button, styles[size], styles[type], { [styles.gradient]: gradient }, className)}
            {...rest}
        >
            {children}
        </EButton>
    );
};
