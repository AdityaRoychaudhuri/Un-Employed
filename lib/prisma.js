import "dotenv/config"
import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })

const globalPrisma = globalThis
export const db = globalPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV == 'production') {
    globalPrisma.prisma = db;
}
