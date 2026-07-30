import {
    Pagination as EPagination,
    PaginationProps as EPaginationProps,
} from "antd";
import { FC } from "react";

import styles from "./pagination.module.scss";

export type PaginationProps = EPaginationProps;

export const Pagination: FC<PaginationProps> = ({ ...rest }) => {
    return <EPagination className={styles.input} {...rest} />;
};
