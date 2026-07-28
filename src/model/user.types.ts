export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    dob: string;
    bio: string;
    researchField: string;
    location: string;
};

export type UserJWT = {
    id: string;
    token: string;
};
