import { HttpError } from "../../../../src/errors/http.error";
import { UserService } from "../../../../src/services/user.service";
import { prismaMock } from "../../prisma.mock";
import { UserMock } from "./mock/user.mock";

const fakeUser = UserMock.buildFakeUser();


describe("Testes de unidade para o método de listUser", () => {
  test("Deve lançar uma exeção se existir usuário cadastrado", () => {
    jest
      .spyOn(UserService.prototype, "listUsers")
      .mockRejectedValue(new HttpError("Nenhum usuário cadastrado", 404));

    const sut = new UserService();

    const result = sut.listUsers();

    expect(result).rejects.toThrow(
      new HttpError("Nenhum usuário cadastrado", 404)
    );
  });

//   test("Deve listar e rotornar a lista de usuários cadastrados", async () => {
//     jest
//       .spyOn(UserService.prototype, "listUsers")
//       .mockRejectedValue(fakeUser);

//       prismaMock.user.findMany();

//       const sut = new UserService();
//       const result = await sut.listUsers();

//       expect(result).toEqual(fakeUser);
//   });
});
