import { PrismaClient } from "@prisma/client";
// Ensure Prisma uses the local query engine (not Data Proxy) in dev
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
    process.env.PRISMA_CLIENT_ENGINE_TYPE = "library";
}
export const prisma = new PrismaClient();
//# sourceMappingURL=prisma.js.map