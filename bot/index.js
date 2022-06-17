const express = require('express')
const app = express()

const line = require('@line/bot-sdk')
const lineConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
}
const lineClient = new line.Client(lineConfig)

app.get('/', async (req, res) => {
    await lineClient.broadcast({
        type: 'text',
        text: 'Hello, World.',
    })
    res.send('Hello, World.')
})

const lineCallback = (e) => {
    return lineClient.broadcast({
        type: 'text',
        text: 'Fuck.',
    })
}
app.post('/callback', line.middleware(lineConfig), (req, res) => {
    Promise.all(req.body.events.map(lineCallback))
        .then(r => res.json(r))
        .catch(err => {
            console.error(err)
            res.status(500).end()
        })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Run PORT:${port}`)
})
