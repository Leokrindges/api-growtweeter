import { HttpError } from "../../../../src/errors/http.error";
import { LikeService } from "../../../../src/services/like.service";
import { prismaMock } from "../../prisma.mock";
import { LikeMock } from "./mock/like.mock";

const fakeLike = LikeMock.buildFakeLike();

const fakeCreateLikeDto = LikeMock.buildCreateLikeDTO();

describe("Testes de unidade para o método createLike", () => {
  test("Deve retornar uma exceção se tentar curtir o proprio tweet", async () => {
    jest
      .spyOn(LikeService.prototype, "createLike")
      .mockRejectedValue(
        new HttpError("Não é possivel curtir seu próprio tweet", 400)
      );

    const sut = new LikeService();
    const result = sut.createLike(fakeLike);
    expect(result).rejects.toThrow(
      new HttpError("Não é possivel curtir seu próprio tweet", 400)
    );
  });

  test("Deve retornar uma exceção se o tweet não existir", async () => {
    jest.spyOn(LikeService.prototype, "createLike").mockResolvedValue(true);

    jest
      .spyOn(LikeService.prototype, "createLike")
      .mockRejectedValue(new HttpError("Tweet não encontrado", 400));

    const sut = new LikeService();
    const result = sut.createLike(fakeLike);
    expect(result).rejects.toThrow(new HttpError("Tweet não encontrado", 400));
  });

  test("Deve curtir o like e retornar  sucesso", async () => {
    jest.spyOn(LikeService.prototype, "createLike").mockResolvedValue(true);

    jest.spyOn(LikeService.prototype, "createLike").mockResolvedValue(false);

    prismaMock.like.create.mockResolvedValue(fakeLike);

    const sut = new LikeService();
    const result = await sut.createLike(fakeCreateLikeDto);
    expect(result).toEqual(false);
  });
});
