import express from 'express'
import { healthRouter } from './routes/health'
import { filesRouter } from './routes/files'
import { authRouter } from './routes/auth'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/files', filesRouter)

app.use(errorHandler)

export { app }
