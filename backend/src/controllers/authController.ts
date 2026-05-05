import type { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma'

function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '7d' })
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string }
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }
    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { email, password: hashed } })
    res.status(201).json({ token: signToken(user.id) })
  } catch (err) {
    next(err)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }
    res.json({ token: signToken(user.id) })
  } catch (err) {
    next(err)
  }
}
