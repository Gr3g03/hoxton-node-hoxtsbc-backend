import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

const users = [
    {
        email: 'grigor@email.com',
        fullName: "grigori",
        password: "abcd",
        amountInAccount: 1000
    },
    {
        email: 'nicolas@email.com',
        fullName: "nicolas",
        password: "abcd",
        amountInAccount: 406
    },
    {
        email: 'ed@email.com',
        fullName: "ed",
        password: "abcd",
        amountInAccount: 658
    }
]

const transactions = [
    {
        amount: 20,
        currency: '$',
        receiverOrSender: 'sender',
        completedAt: 'today',
        isPositive: true,
        usersId: 1
    },
    {
        amount: 20,
        currency: '$',
        receiverOrSender: 'sender',
        completedAt: 'today',
        isPositive: true,
        usersId: 1
    },
    {
        amount: 20,
        currency: '$',
        receiverOrSender: 'sender',
        completedAt: 'yesterday',
        isPositive: true,
        usersId: 1
    },
    {
        amount: 20,
        currency: '$',
        receiverOrSender: 'sender',
        completedAt: 'today',
        isPositive: false,
        usersId: 1
    },
]


async function createStuff() {

    await prisma.transaction.deleteMany()
    await prisma.user.deleteMany()

    for (const user of users) {
        await prisma.user.create({ data: user })
    }

    for (const transaction of transactions) {
        await prisma.transaction.create({ data: transaction })
    }

}

createStuff()