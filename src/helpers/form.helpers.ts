import type { SubmitEvent } from "react";

export const parseFormData = <T extends Record<string, unknown>>(event: SubmitEvent): T => {
    return Object.fromEntries(new FormData(event.target).entries()) as T;
};
