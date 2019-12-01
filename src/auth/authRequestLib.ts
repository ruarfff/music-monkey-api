import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { jwtCookieKey } from './authConstants'
const isProduction = process.env.NODE_ENV === 'production'
const devCookieOpts = {}
const prodCookieOpts = { secure: true, sameSite: true }

export const setJwtCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, jwtCookieKey)
  if (isProduction) {
    res.cookie('jwt', token, prodCookieOpts)
  } else {
    res.cookie('jwt', token, devCookieOpts)
  }
}

export const handleCallback = (redirectUrl: string) => {
  return (req: Request, res: Response) => {
    const user = req.user
    setJwtCookie(res, user.userId)
    res.redirect(redirectUrl)
  }
}
