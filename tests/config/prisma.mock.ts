import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import prismaConnection from '../../src/database/prisma.connection';

jest.mock('../../src/database/prisma.connection', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

// hook - Antes de Cada teste
beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock =
  prismaConnection as unknown as DeepMockProxy<PrismaClient>;
