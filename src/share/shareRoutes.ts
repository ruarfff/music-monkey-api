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
      emails.map((email: string) => {
        const msg = {
          to: email,
          from: 'hello@musicmonkey.io',
          subject: 'You have been invited',
          text: '',
          html: '<strong>You&#39;ve been invited to ' + event.name + '</strong>' +
          '' + '<a href="https://guests.musicmonkey.io/invite/' + event.inviteId + '">click here for more details</a>'
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
