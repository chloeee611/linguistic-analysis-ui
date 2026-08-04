import type { ComponentPropsWithRef, FC } from "react";

import styles from "./heading.module.scss";
import clsx from "clsx";

type HeadingProps = ComponentPropsWithRef<"h1">;

export const Heading: FC<HeadingProps> = ({ className, children, ...rest }) => {
    return (
        <h1 className={clsx(styles.heading, className)} {...rest}>
            {children}
        </h1>
    );
};
