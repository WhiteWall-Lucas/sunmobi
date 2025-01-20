import express from 'express'
import { errorHandler } from './middlewares/error'
import message from './controllers/message'
import { initializeCrons } from './crons'

const PORT = process.env.PORT || 4001

const app = express()
    .use(express.json())
    .use('/message', message)
    .use((_, res) => res.status(404).send('Not Found'))
    .use(errorHandler)

app.listen(PORT, () => {
    // biome-ignore lint/nursery/noConsole: <explanation>
    console.log(`Server está funcionando na porta ${PORT}`)
})

initializeCrons()
