import type { FC } from "react";
import { Card as ECard, type CardProps as ECardProps } from "antd";
import styles from "./card.module.scss";

type CardProps = ECardProps;

export const Card: FC<CardProps> = ({ children, ...rest }) => {
    return (
        <ECard className={styles.card} {...rest}>
            {children}
        </ECard>
    );
};
