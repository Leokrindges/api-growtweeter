import { TweetService } from "../../../../src/services/tweet.service";
import { prismaMock } from "../../prisma.mock";
import { TweetMock } from "./mock/tweet.mock";

const fakeTweet = TweetMock.buildFakeTweet();
const fakeCreateTweet = TweetMock.buildCreateTweetDTO();

describe("Testes de unidade para o método createTweet", () => {
  test("Deve lançar uma exceção se o email já tiver sido cadastrado", async () => {
    prismaMock.tweet.create.mockResolvedValue(fakeTweet);

    const sut = new TweetService();
    const result = await sut.createTweet(fakeCreateTweet);

    expect(result).toEqual(fakeTweet);
  });
});
