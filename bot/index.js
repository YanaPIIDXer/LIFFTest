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

app.get('/users', async (req, res) => {
    if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        res.status(403).send()
        return
    }

    const users = []
    const idList = await lineClient.getBotFollowersIds()
    idList.forEach(id => {
        const info = await lineClient.getProfile(id)
        users.push({
            userId: info.userId,
            displayName: info.displayName,
        })
    })

    res.json({ users: users })
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
