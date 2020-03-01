import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { devCookieOpts, jwtCookieKey, prodCookieOpts } from './authConstants'
const isProduction = process.env.NODE_ENV === 'production'

export const setJwtCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, jwtCookieKey)
  if (isProduction) {
    res.cookie('jwt', token, prodCookieOpts)
  } else {
    console.log('Setting cookie')
    console.log(devCookieOpts)
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
