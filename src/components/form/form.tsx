import type { ComponentPropsWithRef, FC } from "react";
import styles from "./form.module.scss";

type FormProps = ComponentPropsWithRef<"form">;

export const Form: FC<FormProps> = ({ children, ...rest }) => {
    return (
        <form className={styles.form} {...rest}>
            {children}
        </form>
    );
};
