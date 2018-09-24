import { Request, Response, Router } from 'express'

const router = Router()

/**
 * @swagger
 * /ping:
 *   get:
 *     tags:
 *       - ping
 *     description: Returns pong
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Simple check if the server is alive
 */
router.get('/ping', (_req: Request, res: Response) => {
  res.send('pong')
})

export default router
