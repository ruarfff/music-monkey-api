import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { jwtCookieKey } from './authConstants'

const devCookieOpts = {}
const prodCookieOpts = { httpOnly: true, secure: true }

export const setJwtCookie = (res: Response, userId: string, env: string) => {
  const token = jwt.sign({ id: userId }, jwtCookieKey)
  if (env === 'production') {
    res.cookie('jwt', token, prodCookieOpts)
  } else {
    res.cookie('jwt', token, devCookieOpts)
  }
}

export const handleCallback = (redirectUrl: string) => {
  return (req: Request, res: Response) => {
    const user = req.user
    setJwtCookie(res, user.userId, req.get('env'))
    res.redirect(redirectUrl)
  }
}
