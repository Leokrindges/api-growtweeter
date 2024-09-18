import { randomUUID } from "crypto";
import { HttpError } from "../../../../src/errors/http.error";
import { UserService } from "../../../../src/services/user.service";
import { UserMock } from "./mock/user.mock";
import { prismaMock } from "../../prisma.mock";

const fakeUser = UserMock.buildFakeUser();

describe("Testes de unidade para o método deleteUser", () => {
  test("Deve lançar uma exceção se não encontrar o usuário", () => {
    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockRejectedValue(new HttpError("Usuário não encontrado", 404));

    const sut = new UserService();

    const result = sut.deleteUser(randomUUID());

    expect(result).rejects.toThrow(
      new HttpError("Usuário não encontrado", 404)
    );
  });

  test("Deve deletar e retornar o usuário deletado", async () => {
    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockResolvedValue(fakeUser);

    prismaMock.user.update.mockResolvedValue(fakeUser);

    const sut = new UserService();

    const result = await sut.deleteUser(randomUUID());

    expect(result).toEqual(fakeUser);
  });
});
