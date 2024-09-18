import { User } from '@prisma/client';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { HttpError } from '../errors/http.error';
import { Bcryt } from '../libs/bcrypt.lib';
import prismaConnection from '../database/prisma.connection';
import { UpdateUserDTO } from '../dtos/update-user.dto';



export class UserService {
    public async createUser(input: CreateUserDTO): Promise<User> {
        const emailExists = await this.isEmailAlreadyExists(input.email);

        if (emailExists) {
            throw new HttpError('Já existe esse e-mail cadastrado, por gentileza, digite um diferente!', 409)
        }

        const usernameExists = await this.isUsernameAlreadyExists(input.username);

        if (usernameExists) {
            throw new HttpError('Já existe um usuário com esse username, digite um diferente!', 409)
        }

        const bcrypt = new Bcryt()
        const hash = await bcrypt.encoded(input.password)

        const newUser = await prismaConnection.user.create({
            data: {
                name: input.name,
                email: input.email,
                username: input.username,
                password: hash,
            },
        });

        return newUser 
    }

    public async isEmailAlreadyExists(email: string): Promise<boolean> {
        const emailAlreadyExists = await prismaConnection.user.findFirst({
            where: {
            email: email,
            deleted: false,
            },
        });

        return Boolean(emailAlreadyExists)
        // return !!emailAlreadyExists
    }

    public async isUsernameAlreadyExists(username: string): Promise<boolean> {
        const usernameAlreadyExists = await prismaConnection.user.findFirst({
            where: {
            username: username,
            deleted: false,
            },
        });

        return Boolean(usernameAlreadyExists)
        // return !!usernameAlreadyExists
    }

    public async listUsers(): Promise<User[]> {
        const users = await prismaConnection.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                deleted: false,
            },
            include: {
                tweet: true,
                like: true,
            },
        });

        if(users.length === 0) {
            throw new HttpError('Nenhum usuário cadastrado', 404)
        }

        return users
    }

    public async updateUser(input: UpdateUserDTO): Promise<User> {
        const userFound = await this.getUserById(input.userId);

        if(input.username) {
            const usernameExist = await this.isUsernameAlreadyExists(input.username);

            if(usernameExist) {
                throw new HttpError('Já existe um usuário com esse username, digite um diferente!', 409)
            }

            userFound.username = input.username;
        }

        if (input.password) {
            const bcrypt = new Bcryt()
            const hash = await bcrypt.encoded(input.password)
            userFound.password = hash
        }

        if(input.name) {
            userFound.name = input.name
        }


        const userUpdated = await prismaConnection.user.update({
            where: { id: userFound.id },
            data: {
                name: userFound.name,
                username: userFound.username,
                password: userFound.password,
            },
        });

        return userUpdated
    }

    public async getUserById(id: string): Promise<User> {
        const userFound = await prismaConnection.user.findUnique({
            where: { id, deleted: false }
        });

        if(!userFound) {
            throw new HttpError('Usuário não encontrado', 404)
        }

        return userFound
    }

    public async deleteUser(id: string): Promise<User> {
        const userFound = await this.getUserById(id);

        const userDeleted = await prismaConnection.user.update({
            where: {
                id: userFound.id,
            },
            data: {
                deleted: true,
                deletedAt: new Date(),
            },
        });

        return userDeleted
    }
}