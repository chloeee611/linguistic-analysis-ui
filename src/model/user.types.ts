export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
};

export type UserJWT = {
    id: string;
    token: string;
};
