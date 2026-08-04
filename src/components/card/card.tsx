import { Card as ECard, type CardProps as ECardProps } from "antd";
import type { FC } from "react";

import styles from "./card.module.scss";
import clsx from "clsx";

type CardProps = ECardProps & {
    disabled?: boolean;
};

export const Card: FC<CardProps> = ({
    disabled,
    className,
    children,
    ...rest
}) => {
    return (
        <ECard
            className={clsx(styles.card, className, {
                [styles.disabled]: disabled,
            })}
            {...rest}
        >
            {children}
        </ECard>
    );
};
