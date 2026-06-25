import type { ComponentPropsWithRef, FC } from "react";
import styles from "./label.module.scss";

type LabelProps = ComponentPropsWithRef<"label">;

export const Label: FC<LabelProps> = ({ children, ...rest }) => {
    return (
        <label className={styles.label} {...rest}>
            {children}
        </label>
    );
};
