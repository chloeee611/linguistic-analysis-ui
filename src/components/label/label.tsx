import type { ComponentPropsWithRef, FC } from "react";
import styles from "./label.module.scss";
import clsx from "clsx";

type LabelProps = ComponentPropsWithRef<"label">;

export const Label: FC<LabelProps> = ({ className, children, ...rest }) => {
    return (
        <label className={clsx(styles.label, className)} {...rest}>
            {children}
        </label>
    );
};
