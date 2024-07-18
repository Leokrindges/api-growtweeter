/*
  Warnings:

  - You are about to drop the column `tweet_id` on the `replys` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `replys` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,tweet_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tweet_reply_id]` on the table `replys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tweet_original_id` to the `replys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tweet_reply_id` to the `replys` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "replys" DROP CONSTRAINT "replys_tweet_id_fkey";

-- DropForeignKey
ALTER TABLE "replys" DROP CONSTRAINT "replys_user_id_fkey";

-- DropIndex
DROP INDEX "likes_user_id_key";

-- AlterTable
ALTER TABLE "replys" DROP COLUMN "tweet_id",
DROP COLUMN "user_id",
ADD COLUMN     "tweet_original_id" UUID NOT NULL,
ADD COLUMN     "tweet_reply_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_tweet_id_key" ON "likes"("user_id", "tweet_id");

-- CreateIndex
CREATE UNIQUE INDEX "replys_tweet_reply_id_key" ON "replys"("tweet_reply_id");

-- AddForeignKey
ALTER TABLE "replys" ADD CONSTRAINT "replys_tweet_original_id_fkey" FOREIGN KEY ("tweet_original_id") REFERENCES "tweets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replys" ADD CONSTRAINT "replys_tweet_reply_id_fkey" FOREIGN KEY ("tweet_reply_id") REFERENCES "tweets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
