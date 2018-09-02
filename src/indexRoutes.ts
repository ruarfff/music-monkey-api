import { Request, Response, Router } from 'express'
const router = Router()

router.get('/', (_req: Request, res: Response) => {
  res.send('Hello')
})

router.get('/ping', (_req: Request, res: Response) => {
  res.send('pong')
})

export default router
