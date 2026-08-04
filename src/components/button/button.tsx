import { Button as EButton, type ButtonProps as EButtonProps } from "antd";
import type { FC } from "react";

import styles from "./button.module.scss";
import clsx from "clsx";

type ButtonProps = EButtonProps;

export const Button: FC<ButtonProps> = ({ className, children, ...rest }) => {
    return (
        <EButton className={clsx(styles.button, className)} {...rest}>
            {children}
        </EButton>
    );
};
