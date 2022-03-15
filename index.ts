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


function createToken(id: number) {
    // @ts-ignore
    return jwt.sign({ id: id }, process.env.MY_SECRET, { expiresIn: '2 hours' })
}

async function getUserFromToken(token: string) {
    // @ts-ignore
    const decodedData = jwt.verify(token, process.env.MY_SECRET)
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { id: decodedData.id } })

    return user
}


app.post('/register', async (req, res) => {
    const { email, password, fullName, amountInAccount } = req.body

    try {
        const hash = bcrypt.hashSync(password, 8)
        const user = await prisma.user.create({
            data: { email: email, fullName: fullName, amountInAccount, password: hash }
        })
        res.send({ user, token: createToken(user.id) })
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { email: email } })
        // @ts-ignore
        const passwordMatches = bcrypt.compareSync(password, user.password)

        if (user && passwordMatches) {
            res.send({ user, token: createToken(user.id) })
        } else {
            throw Error('BOOM!')
        }
    } catch (err) {
        res.status(400).send({ error: 'User/password invalid.' })
    }
})

app.post('/banking-info', async (req, res) => {
    const { token } = req.body

    try {
        const user = await getUserFromToken(token)
        res.send(user)
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message })
    }
})



app.listen(4000, () => {
    console.log('server running: http://localhost:4000')
})