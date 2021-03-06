import { PrismaClient } from "@prisma/client";
import express from "express"
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import 'dotenv/config'


const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000


function createToken(id: number) {
    // @ts-ignore
    return jwt.sign({ id: id }, process.env.MY_SECRET, { expiresIn: '2hours' })
}

async function getUserFromToken(token: string) {
    // @ts-ignore
    const decodedData = jwt.verify(token, process.env.MY_SECRET)
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { id: decodedData.id } })

    return user
}

function randomAmount() {
    return Math.floor(Math.random());
}


app.post('/signup', async (req, res) => {
    const { email, password, fullName } = req.body

    try {
        const hash = bcrypt.hashSync(password, 8)
        const user = await prisma.user.create({
            data: { email: email, fullName: fullName, password: hash, amountInAccount: randomAmount() },
            include: { transactions: true }
        })
        res.send({ user, token: createToken(user.id) })
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/sign-in', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await prisma.user.findUnique({ where: { email }, include: { transactions: true } })
        //@ts-ignore
        const passwordMatches = bcryptjs.compareSync(password, user.password)

        if (passwordMatches) {
            //@ts-ignore
            res.send({ user, token: createToken(user.id) })
        } else {
            throw Error('Password not found')
        }

    }
    catch (err) {
        res.status(400).send({ error: 'User/password invalid' })
    }

})


app.post('/validate', async (req, res) => {
    const { token } = req.body

    try {
        const user = await getUserFromToken(token)
        res.send(user)
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/banking-info', async (req, res) => {
    const { token } = req.body
    try {
        //@ts-ignore
        const decoded = jwt.verify(token, process.env.MY_SECRET)
        //@ts-ignore
        const user = await prisma.user.findUnique({ where: { id: decoded.id }, include: { transactions: true } })
        res.send(user)
    }
    catch (err) {
        //@ts-ignore
        res.send({ error: err.message })
    }
})



app.listen(PORT, () => {
    console.log('server running: http://localhost:4000')
})