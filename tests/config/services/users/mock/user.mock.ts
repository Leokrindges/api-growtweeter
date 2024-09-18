import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import { CreateUserDTO } from "../../../../../src/dtos/create-user.dto";
import { UpdateUserDTO } from "../../../../../src/dtos/update-user.dto";

export class UserMock {
  public static buildFakeUser(): User {
    return {
      id: randomUUID(),
      name: "Leonardo da silva",
      email: "leonardo@mock.com",
      username: "leo",
      password: "Leo123456@",
      createdAt: new Date().toISOString() as unknown as Date,
      deleted: false,
      deletedAt: null,
    };
  }

  public static buildCreateUserDTO(): CreateUserDTO {
    return {
      name: "Leonardo da silva",
      email: "leonardo@mock.com",
      username: "leo",
      password: "Leo1234567@",
    };
  }

  public static buildUpdateUserDTO(): UpdateUserDTO {
    return {
      userId: randomUUID(),
      name: "Leonardo da silva",
      username: "leo",
      password: "Leo123456@",
    };
  }

}
