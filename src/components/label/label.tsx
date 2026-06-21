import type { ComponentPropsWithRef, FC } from "react";
import styles from "./label.module.scss";

type LabelProps = ComponentPropsWithRef<"label">;

export const Label: FC<LabelProps> = ({ children, ...rest }) => {
    return (
        <label className={styles.form} {...rest}>
            {children}
        </label>
    );
};
