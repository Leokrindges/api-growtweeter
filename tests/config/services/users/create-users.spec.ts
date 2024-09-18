import { UserService } from "../../../../src/services/user.service";
import { UserMock } from "./mock/user.mock";
import { HttpError } from "../../../../src/errors/http.error";
import { Bcryt } from "../../../../src/libs/bcrypt.lib";
import { prismaMock } from "../../prisma.mock";

const fakeUser = UserMock.buildFakeUser();
const fakeCreateUserDto = UserMock.buildCreateUserDTO();

describe("Testes de unidade para o método createUser", () => {
  test("Deve lançar uma exceção se o email já tiver sido cadastrado", async () => {
    jest
      .spyOn(UserService.prototype, "isEmailAlreadyExists")
      .mockResolvedValue(true);

    const sut = new UserService();

    const result = sut.createUser(fakeCreateUserDto);

    expect(result).rejects.toThrow(
      new HttpError(
        "Já existe esse e-mail cadastrado, por gentileza, digite um diferente!",
        409
      )
    );
  });

  test("deve lançar uma exceção se o nome de usuário já tiver sido cadastrado", async () => {
    jest
      .spyOn(UserService.prototype, "isEmailAlreadyExists")
      .mockResolvedValue(false);

    jest
      .spyOn(UserService.prototype, "isUsernameAlreadyExists")
      .mockResolvedValue(true);

    const sut = new UserService();

    const result = sut.createUser(fakeCreateUserDto);

    expect(result).rejects.toThrow(
      new HttpError(
        "Já existe um usuário com esse username, digite um diferente!",
        409
      )
    );
  });

  test("Deve salvar e retornar o usuário cadastrado", async () => {
    jest
      .spyOn(UserService.prototype, "isEmailAlreadyExists")
      .mockResolvedValue(false);

    jest
      .spyOn(UserService.prototype, "isUsernameAlreadyExists")
      .mockResolvedValue(false);

    jest.spyOn(Bcryt.prototype, "encoded").mockResolvedValue("Leo123456@");

    prismaMock.user.create.mockResolvedValue(fakeUser);

    const sut = new UserService();

    const result = await sut.createUser(fakeCreateUserDto);

    expect(result).toEqual(fakeUser);
  });
});
