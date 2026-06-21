import type { ComponentPropsWithRef, FC } from "react";
import styles from "./input.module.scss";

type InputProps = ComponentPropsWithRef<"input">;

export const Input: FC<InputProps> = ({ children, ...rest }) => {
    return (
        <input className={styles.form} {...rest}>
            {children}
        </input>
    );
};
