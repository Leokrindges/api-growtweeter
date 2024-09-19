import { randomUUID } from "crypto";
import { HttpError } from "../../../../src/errors/http.error";
import { TweetService } from "../../../../src/services/tweet.service";
import { TweetMock } from "./mock/tweet.mock";

const fakeDeleteTweet = TweetMock.buildTweetUser();
const fakeTweet = TweetMock.buildFakeTweet();

describe("Testes de unidade para o metodo de deleteTweets", () => {
    test("Deve retornar uma exceção se o tweet não existir", () => {
        jest
        .spyOn(TweetService.prototype, "deleteTweets")
        .mockRejectedValue(new HttpError("Tweet não encontrado", 404));
  
      const sut = new TweetService();
  
      const result = sut.deleteTweets(fakeDeleteTweet);
  
      expect(result).rejects.toThrow(new HttpError("Tweet não encontrado", 404));
    });

    test("Deve deletar e retornar o tweet deletado", async () => {
        jest
        .spyOn(TweetService.prototype, "deleteTweets")
        .mockResolvedValue(fakeTweet);
  
        const sut = new TweetService();
        const result = await sut.deleteTweets(fakeDeleteTweet);
  
        expect(result).toEqual(fakeTweet);
    })
});
