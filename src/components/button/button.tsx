import type { FC } from "react";
import { Button as EButton, type ButtonProps as EButtonProps } from "antd";
import styles from "./button.module.scss";

type ButtonProps = EButtonProps;

export const Button: FC<ButtonProps> = ({ children, ...rest }) => {
    return (
        <EButton className={styles.button} {...rest}>
            {children}
        </EButton>
    );
};
