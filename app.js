require('dotenv').config()
const qrcode = require('qrcode-terminal')
const { Client, RemoteAuth } = require('whatsapp-web.js')
const { MongoStore } = require('wwebjs-mongo')
const mongoose = require('mongoose')
const express = require('express')
const dataModel = require('./models/data.model')

const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 8080

const app = express()
app.use(express.json())

app.get('/', (_, res) => {
  res.send({ message: 'It is working!!!' })
})

mongoose.set('strictQuery', false)

mongoose.connect(MONGO_URI).then(() => {
  const store = new MongoStore({ mongoose })
  const client = new Client({
    authStrategy: new RemoteAuth({
      store,
      backupSyncIntervalMs: 300000
    })
  })

  client.on('qr', qr => {
    qrcode.generate(qr, { small: true })
  })

  client.on('ready', () => {
    console.log('Client is ready!')
  })

  client.on('message', async message => {
    if (message.body === '!get last record') {
      const data = await dataModel.findOne().sort({ _id: -1 })

      message.reply(data.data.replaceAll('\t', '\n'))
    }
  })

  app.post('/send', (req, res) => {
    const { number, text } = req.body

    const chatId = number + '@c.us'

    client.sendMessage(chatId, text)
    return res.send({ message: 'Enviado correctamente' })
  })

  app.post('/store', async (req, res) => {
    const { data } = req.body

    try {
      await dataModel.create({ data })

      return res.send({
        ok: true,
        message: 'Mensaje Guardado correctamente'
      })
    } catch (e) {
      return res.send({
        ok: false,
        message: e
      })
    }
  })

  app.listen(PORT, () => client.initialize())
})
