import { PrismaClient } from "@prisma/client";

const globalForPrisma = gloal as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (prosss.env.NODE_ENV === "development") globalForPrisma.prisma = prisma;