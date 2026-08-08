import type { ComponentPropsWithRef, FC } from "react";

import styles from "./heading.module.scss";
import clsx from "clsx";

type HeadingProps = ComponentPropsWithRef<"h1"> & {
    level: 1 | 2 | 3 | 4 | 5 | 6;
};

export const Heading: FC<HeadingProps> = ({ level, className, children, ...rest }) => {
    const Component = `h${level}` as const;

    return (
        <Component className={clsx(styles.heading, styles[`headingLevel${level}`], className)} {...rest}>
            {children}
        </Component>
    );
};
