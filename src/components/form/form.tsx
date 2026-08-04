import type { ComponentPropsWithRef, FC } from "react";
import styles from "./form.module.scss";
import clsx from "clsx";

type FormProps = ComponentPropsWithRef<"form">;

export const Form: FC<FormProps> = ({ className, children, ...rest }) => {
    return (
        <form className={clsx(styles.form, className)} {...rest}>
            {children}
        </form>
    );
};
