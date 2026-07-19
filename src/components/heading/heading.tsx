import type { ComponentPropsWithRef, FC } from "react";
import styles from "./heading.module.scss";

type HeadingProps = ComponentPropsWithRef<"h1">;

export const Heading: FC<HeadingProps> = ({ children, ...rest }) => {
    return (
        <h1 className={styles.heading} {...rest}>
            {children}
        </h1>
    );
};
