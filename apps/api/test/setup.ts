import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Ensure database connection
  await prisma.$connect();
});

afterAll(async () => {
  // Clean up and disconnect
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

export { prisma };
