import { HttpError } from "../../../../src/errors/http.error";
import { Bcryt } from "../../../../src/libs/bcrypt.lib";
import { UserService } from "../../../../src/services/user.service";
import { prismaMock } from "../../prisma.mock";
import { UserMock } from "./mock/user.mock";

const fakeUser = UserMock.buildFakeUser();
const fakeUpdateUserDto = UserMock.buildUpdateUserDTO();

describe("Testes de unidade para o metodo updateUser", () => {
  test("Deve lançar uma exceção se não encontrar o usuário", () => {
    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockRejectedValue(new HttpError("Usuário não encontrado", 404));

    const sut = new UserService();

    const result = sut.updateUser(fakeUpdateUserDto);

    expect(result).rejects.toThrow(
      new HttpError("Usuário não encontrado", 404)
    );
  });

  test("deve lançar uma exceção se o nome de usuário já tiver sido cadastrado", async () => {
    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockResolvedValue(fakeUser);

    jest
      .spyOn(UserService.prototype, "isUsernameAlreadyExists")
      .mockResolvedValue(true);

    const sut = new UserService();

    const result = sut.updateUser(fakeUpdateUserDto);

    expect(result).rejects.toThrow(
      new HttpError(
        "Já existe um usuário com esse username, digite um diferente!",
        409
      )
    );
  });

  test("Deve atualizar e retornar o usuário atualizado", async () => {
    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockResolvedValue(fakeUser);

    jest
      .spyOn(UserService.prototype, "isUsernameAlreadyExists")
      .mockResolvedValue(false);

    jest.spyOn(Bcryt.prototype, "encoded").mockResolvedValue("Leo123456@");

    prismaMock.user.update.mockResolvedValue(fakeUser);

    const sut = new UserService();

    const result = await sut.updateUser(fakeUpdateUserDto);

    expect(result).toEqual(fakeUser);
  });
});
