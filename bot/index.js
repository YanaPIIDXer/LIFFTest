const express = require('express')
const app = express()
const bodyParser = require('body-parser');

import postgresClient from './PostgresClient.js'

const cors = require('cors')
app.use(cors())

const line = require('@line/bot-sdk')
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
        return Promise.resolve()
    }))
    res.status(200).send()
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Run PORT:${port}`)
})
