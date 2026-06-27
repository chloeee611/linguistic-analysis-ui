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

export type Project = {
    userId: string;
    title: string;
    description: string;
};
