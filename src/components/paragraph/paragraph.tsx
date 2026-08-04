import type { ComponentPropsWithRef, FC } from "react";
import styles from "./paragraph.module.scss";
import clsx from "clsx";

type ParagraphProps = ComponentPropsWithRef<"p">;

export const Paragraph: FC<ParagraphProps> = ({
    className,
    children,
    ...rest
}) => {
    return (
        <p className={clsx(styles.paragraph, className)} {...rest}>
            {children}
        </p>
    );
};
