import sgMail = require('@sendgrid/mail')
import { Request, Response, Router } from 'express'
import * as passport from 'passport'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const router = Router()

router.post(
  '/email',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { emails, event } = req.body
    try {
      emails.map(async (email: string) => {
        const msg = {
          to: email,
          from: 'hello@musicmonkey.io',
          subject: 'You have been invited to ' + event.name,
          text: 'test',
          html: '<a href="https://guests.musicmonkey.io/invite/' + event.invites[0] + '">' +
          'click here for more details</a>'
        }
        try {
          await sgMail.send(msg)
        } catch (e) {
          res.status(500).send(e.message)
        }
      })

      res.status(200).send('Emails successfully sent')
    } catch (e) {
      res.status(500).send(e.message)
    }
  }
)

export default router
