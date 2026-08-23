import { InputProps } from "@/components/input/input";
import { ChangeEvent } from "react";

export type Field<T extends object> = {
    type: InputProps["type"];
    label: string;
    property: keyof T;
    disabled?: boolean;
    required?: boolean;
    onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
};
