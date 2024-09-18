import prismaConnection from '../database/prisma.connection';
import { LoginUserInputDTO, LoginUserOutputDTO } from '../dtos/login-user.dto';
import { HttpError } from '../errors/http.error';
import { Bcryt } from '../libs/bcrypt.lib';
import { JWT } from '../libs/jwt.lib';



export class AuthService {

    public async loginUser(input: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
        const userFound = await prismaConnection.user.findFirst({
            where: {
                OR: [{ email: input.email }, { username: input.username }],
                deleted: false,
            },
        });

        if (!userFound) {
            throw new HttpError('Credeciais inválidas', 401)
        }

        const bcrypt = new Bcryt();
        const isMatch = await bcrypt.verify(userFound.password, input.password);

        if (!isMatch) {
            throw new HttpError('Credeciais inválidas', 401)
        }

        const jwt = new JWT()
        const token = jwt.generateToken({
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
            username: userFound.username
        })

        return {
            authToken: token,
            userLogged: userFound
        }
    }
}