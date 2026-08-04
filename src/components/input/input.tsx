import { Input as EInput, type InputProps as EInputProps } from "antd";
import type { FC } from "react";

import styles from "./input.module.scss";
import clsx from "clsx";

export type InputProps = EInputProps;

export const Input: FC<InputProps> = ({ className, children, ...rest }) => {
    return (
        <EInput className={clsx(styles.input, className)} {...rest}>
            {children}
        </EInput>
    );
};
