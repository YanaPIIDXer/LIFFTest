import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import postgresClient from './PostgresClient.mjs'
import line from '@line/bot-sdk'

const app = express()

app.use(cors())

const lineConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
}
const lineClient = new line.Client(lineConfig)

app.get('/', async (req, res) => {
    res.send('Hello, World.')
})

app.post('/message', bodyParser.json(), async (req, res) => {
    const userId = req.body.userId
    const message = req.body.message

    await lineClient.pushMessage(userId, {
        type: 'text',
        text: message,
    })
    
    res.json({ result: true })
})

app.get('/users', async (req, res) => {
    if (!req.headers.authorization ||
        req.headers.authorization.split(' ')[0] !== 'Bearer' ||
        req.headers.authorization.split(' ')[1] !== process.env.ADMIN_USER_ID) {
        res.status(403).send()
        return
    }

    const users = []
    let statusCode = 200
    try {
        await postgresClient.connect()

        const results = await postgresClient.query('SELECT * FROM users')
        results.rows.forEach(row => {
            users.push({
                userId: row.user_id,
                displayName: row.name,
            })
        })
    } catch (error) {
        console.error(error)
        statusCode = 503
    }

    await postgresClient.end()
    res.status(statusCode).json({ users: users })
})

app.post('/line_webhook', line.middleware(lineConfig), async (req, res) => {
    await Promise.all(req.body.events.map(async (e) => {
        const profile = await lineClient.getProfile(e.source.userId)
        const userId = profile.userId
        const name = profile.displayName

        try {
            await postgresClient.connect()
            // ユーザ登録がされていなければ新規登録
            const results = await postgresClient.query('SELECT * FROM users where user_id = $1', [userId])
            if (!results.rows.length) {
                await postgresClient.query('INSERT INTO users VALUES($1, $2)', [userId, name])
            }
        } catch (error) {
            console.error(error)
        }
        await postgresClient.end()
        return Promise.resolve()
    }))
    res.status(200).send()
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Run PORT:${port}`)
})