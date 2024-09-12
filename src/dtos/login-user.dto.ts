import { User } from '@prisma/client';

export interface LoginUserInputDTO {
    email?: string;
    username?: string;
    password: string;
}

export interface LoginUserOutputDTO {
    authToken: string;
    userLogged: User;
}