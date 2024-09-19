import { HttpError } from "../../../../src/errors/http.error";
import { TweetService } from "../../../../src/services/tweet.service";
import { prismaMock } from "../../prisma.mock";
import { TweetMock } from "./mock/tweet.mock";

const fakeUpdateTweetDto = TweetMock.buildUpdateTweetDTO();
const fakeTweet = TweetMock.buildFakeTweet()

describe("Testes de unidade para o método updateTweets", () => {
  test("Deve retornar uma exceção se o tweet não existir", async () => {
    jest
      .spyOn(TweetService.prototype, "updateTweets")
      .mockRejectedValue(new HttpError("Tweet não encontrado", 404));

    const sut = new TweetService();

    const result = sut.updateTweets(fakeUpdateTweetDto);

    expect(result).rejects.toThrow(new HttpError("Tweet não encontrado", 404));
  });

  test("Deve atualizar e retornar o tweet atualizado", async () => {
    jest
    .spyOn(TweetService.prototype, "updateTweets")
    .mockResolvedValue(fakeTweet);

    prismaMock.tweet.update.mockResolvedValue(fakeTweet);

    const sut = new TweetService();
    const result = await sut.updateTweets(fakeUpdateTweetDto);
    expect(result).toEqual(fakeTweet);

  })
});
