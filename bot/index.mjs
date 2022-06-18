import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import postgresClient from './PostgresClient.mjs'
import line from '@line/bot-sdk'
import verifyToken from './auth.mjs'

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

    let statusCode = 200

    const tokens = []
    const client = postgresClient()
    try {
        await client.connect()

        const results = await client.query('SELECT token FROM users')
        results.rows.forEach(row => {
            tokens.push(row['token'])
        })
    } catch (error) {
        console.error(error)
        statusCode = 503
    }
    await client.end()

    const users = []
    if (statusCode === 200) {
        tokens.forEach(async token => {
            const result = await verifyToken(token)
            if (!result) { return }
            users.push({
                userId: result.id,
                displayName: result.name,
            })
        })
    }
    
    res.status(statusCode).json({ users: users })
})

app.post('/register', bodyParser.json(), async (req, res) => {
    let result = false
    let statusCode = 200

    const token = req.body.token
    // トークンの検証
    const verify = await verifyToken(token)
    if (!verify) {
        res.status(400).json({ result: false })
        return
    }

    const client = postgresClient()
    try {
        await client.connect()

        // ユーザ登録がされていなければ新規登録
        const results = await client.query('SELECT token from users where token = $1', [token])
        if (!results.rows.length) {
            await client.query('INSERT INTO users VALUES($1)', [token])
            result = true
        }
    } catch (error) {
        console.error(error)
        statusCode = 500
    }
    
    res.status(statusCode).json({ result: result })
})

/*
app.post('/line_webhook', line.middleware(lineConfig), async (req, res) => {
    await Promise.all(req.body.events.map(async (e) => {
        const profile = await lineClient.getProfile(e.source.userId)
        const userId = profile.userId
        const name = profile.displayName

        const client = postgresClient()
        try {
            await client.connect()
            // ユーザ登録がされていなければ新規登録
            const results = await client.query('SELECT * FROM users where user_id = $1', [userId])
            if (!results.rows.length) {
                await client.query('INSERT INTO users VALUES($1, $2)', [userId, name])
            }
        } catch (error) {
            console.error(error)
        }
        await client.end()
        return Promise.resolve()
    }))
    res.status(200).send()
})
*/

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Run PORT:${port}`)
})
