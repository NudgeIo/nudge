import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  })

if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
      console.log(
        `   \x1b[36mQuery\x1b[0m:`,
        e.query,
        `\n  \x1b[36mParams\x1b[0m:`,
        e.params,
        `\n\x1b[36mDuration\x1b[0m:`,
        `${e.duration}ms`,
        `\n--------`,
      )
    })
  }

  console.log(process.env.NODE_ENV);
  
export default prisma;
