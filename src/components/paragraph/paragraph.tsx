import type { ComponentPropsWithRef, FC } from "react";
import styles from "./paragraph.module.scss";

type ParagraphProps = ComponentPropsWithRef<"p">;

export const Paragraph: FC<ParagraphProps> = ({ children, ...rest }) => {
    return (
        <p className={styles.paragraph} {...rest}>
            {children}
        </p>
    );
};
