import { Spin as ESpin, type SpinProps as ESpinProps } from "antd";
import type { FC } from "react";

import styles from "./spin.module.scss";
import clsx from "clsx";

type SpinProps = ESpinProps & {
    disabled?: boolean;
};

export const Spin: FC<SpinProps> = ({ disabled, className, children, ...rest }) => {
    return (
        <ESpin
            className={clsx(styles.spin, className, {
                [styles.disabled]: disabled,
            })}
            {...rest}
        >
            {children}
        </ESpin>
    );
};
