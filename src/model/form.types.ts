import { ChangeEvent } from "react";
import { InputProps } from "@/components/input/input";
import { Rule } from "antd/es/form";

export type Field<T extends object> = {
    type: InputProps["type"];
    label: string;
    property: keyof T;
    disabled?: boolean;
    required?: boolean;
    onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
    rules?: Rule[];
};
