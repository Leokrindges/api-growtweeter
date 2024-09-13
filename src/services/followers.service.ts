import { Follower } from "@prisma/client";
import { prismaConnection } from "../database/prisma.connection";
import { Follow } from "../dtos/follow.dto";
import { HttpError } from "../errors/http.error";

export class FollowService {
  public async followService(input: Follow): Promise<Follower> {
    if (input.userId === input.userIdLogged)
      throw new HttpError("Não é possivel seguir a si mesmo", 400);

    const userFound = await prismaConnection.user.findFirst({
      where: { id: input.userId, deleted: false },
    });

    if (!userFound) throw new HttpError("Usuário não encontrado", 404);

    const checkAlredyFollow = await prismaConnection.follower.findFirst({
      where: { followerId: input.userIdLogged, userId: input.userId },
    });

    if (checkAlredyFollow)
      throw new HttpError(
        `O usuário ${input.name} já segue ${userFound.name}`,
        400
      );

    const createFollower = await prismaConnection.follower.create({
      data: {
        userId: input.userId,
        followerId: input.userIdLogged,
      },
    });

    return createFollower;
  }

  public async unfollowService(input: Follow): Promise<Follower> {
    if (input.userId === input.userIdLogged)
      throw new HttpError("Não é possivel deixar seguir a si mesmo", 400);

    const userFound = await prismaConnection.user.findFirst({
      where: { id: input.userId },
    });

    if (!userFound) throw new HttpError("Usuário inválido", 400);

    const checkAlredyFollow = await prismaConnection.follower.findFirst({
      where: { followerId: input.userIdLogged, userId: userFound.id },
    });

    if (!checkAlredyFollow)
      throw new HttpError(
        `O usuário ${input.name} não segue ${userFound.name}`,
        400
      );

    const unfollow = await prismaConnection.follower.delete({
      where: {
        id: checkAlredyFollow.id,
      },
    });

    return unfollow;
  }

  public async showFollowersService(input: any): Promise<any> {}

  public async showFollowingService(input: any): Promise<any> {}
}
