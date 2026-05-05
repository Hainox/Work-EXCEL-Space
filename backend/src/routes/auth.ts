import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { register, login } from '../controllers/authController'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
})

export const authRouter = Router()

authRouter.post('/register', authLimiter, register)
authRouter.post('/login', authLimiter, login)
