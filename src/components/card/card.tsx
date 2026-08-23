import { Card as ECard, type CardProps as ECardProps } from "antd";
import type { FC } from "react";

import styles from "./card.module.scss";
import clsx from "clsx";

type CardProps = ECardProps & {
    disabled?: boolean;
    gradient?: boolean;
    background?: "primary" | "white";
};

export const Card: FC<CardProps> = ({
    disabled,
    gradient = false,
    background = "white",
    className,
    children,
    ...rest
}) => {
    return (
        <ECard
            className={clsx(styles.card, styles[background], { [styles.gradient]: gradient }, className, {
                [styles.disabled]: disabled,
            })}
            {...rest}
        >
            {children}
        </ECard>
    );
};
