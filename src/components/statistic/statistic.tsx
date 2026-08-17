import { Statistic as EStatistic, type StatisticProps as EStatisticProps } from "antd";
import type { FC } from "react";

import styles from "./statistic.module.scss";
import clsx from "clsx";

export type StatisticProps = EStatisticProps;

export const Statistic: FC<StatisticProps> = ({ className, ...rest }) => {
    return <EStatistic className={clsx(styles.statistic, className)} {...rest}></EStatistic>;
};
