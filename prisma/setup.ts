import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })


// model User {
//     id           Int           @id @default(autoincrement())
//     email        String        @unique
//     password     String
//     transactions Transaction[]
//   }

//   model Transaction {
//     id      Int  @id @default(autoincrement())
//     amount  Int
//     usersId Int
//     users   User @relation(fields: [usersId], references: [id], onDelete: Cascade)
//   }


const users = [
    {
        email: 'nicolas@email.com',
    }
]

const transactions = [
    {
        amount: Math.random(),
        userId: 1
    },
    {
        amount: Math.random(),
        userId: 1
    }, {
        amount: Math.random(),
        userId: 1
    },
]
