const express = require('express')
const app = express()
const bodyParser = require('body-parser');

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

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Run PORT:${port}`)
})
