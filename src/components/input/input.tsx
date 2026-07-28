import { Input as EInput, type InputProps as EInputProps } from "antd";
import type { FC } from "react";

import styles from "./input.module.scss";

export type InputProps = EInputProps;

export const Input: FC<InputProps> = ({ children, ...rest }) => {
    return (
        <EInput className={styles.input} {...rest}>
            {children}
        </EInput>
    );
};
