/*
  Warnings:

  - You are about to drop the column `deletado_em` on the `tweets` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `tweets` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "replys_user_id_key";

-- AlterTable
ALTER TABLE "tweets" DROP COLUMN "deletado_em",
DROP COLUMN "deleted";
