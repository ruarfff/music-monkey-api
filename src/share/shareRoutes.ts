import sgMail = require('@sendgrid/mail')
import { Request, Response, Router } from 'express'
import * as passport from 'passport'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const router = Router()

router.post(
  '/email',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { emails } = req.body
    try {
      console.log(emails)
      emails.map((email: string) => {
        const msg = {
          to: email,
          from: 'hello@musicmonkey.io',
          subject: 'You have been invited',
          text: 'This is a test',
          html: '<strong>This is a test</strong>'
        }
        sgMail.send(msg)
      })

      res.status(200).send('Emails successfully sent')
    } catch (e) {
      res.status(500).send(e.message)
    }
  }
)

export default router
