import { PrismaClient } from "@prisma/client"

declare global {
    // eslint-disable-next-line no-var
    var cachedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient()
} else {
    if (!global.cachedPrisma) {
        global.cachedPrisma = new PrismaClient()
    }

    prisma = global.cachedPrisma
}

const initializePrisma = async () => {
    prisma.$queryRaw`PRAGMA busy_timeout = 5000;`
}
initializePrisma()
    .then(() => {})
    .catch((error) => console.error(error))

export const db = prisma
