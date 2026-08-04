import {
    Pagination as EPagination,
    PaginationProps as EPaginationProps,
} from "antd";
import { FC } from "react";

import styles from "./pagination.module.scss";
import clsx from "clsx";

export type PaginationProps = EPaginationProps;

export const Pagination: FC<PaginationProps> = ({ className, ...rest }) => {
    return <EPagination className={clsx(styles.input, className)} {...rest} />;
};
