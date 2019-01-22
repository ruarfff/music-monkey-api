import sgMail = require('@sendgrid/mail')
import { Request, Response, Router } from 'express'
import * as moment from 'moment'
import * as passport from 'passport'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const router = Router()

router.post(
  '/email',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { emails, event, emailText } = req.body

    const eventImg = event.imageUrl ?
      event.imageUrl :
      'https://res.cloudinary.com/dxk0d7mmy/image/upload/v1548150130/partycover.png'

    try {
      emails.map(async (email: string) => {
        const msg = {
          to: email,
          from: 'hello@musicmonkey.io',
          subject: 'You have been invited to ' + event.name,
          text: 'test',
          html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"' +
          ' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
          '<html>\n' +
          '<head>\n' +
          '    <meta charset="UTF-8">\n' +
          '    <meta content="width=device-width, initial-scale=1" name="viewport">\n' +
          '    <meta name="x-apple-disable-message-reformatting">\n' +
          '    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
          '    <meta content="telephone=no" name="format-detection">\n' +
          '    <title></title>\n' +
          '    <link href="https://fonts.googleapis.com/css?family=Open Sans:400,400i,700,700i" rel="stylesheet">\n' +
          '</head>\n' +
          '\n' +
          '<body>\n' +
          '    <div class="es-wrapper-color">\n' +
          '        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">\n' +
          '            <tbody>\n' +
          '                <tr>\n' +
          '                    <td class="esd-email-paddings" valign="top">\n' +
          '                        <table ' +
          '                          class="es-content esd-header-popover" ' +
          '                          cellspacing="0" cellpadding="0" align="center"' +
          '                        >\n' +
          '                            <tbody>\n' +
          '                                <tr> </tr>\n' +
          '                                <tr>\n' +
          '                                    <td ' +
          '                                     class="esd-stripe" esd-custom-block-id="7964" align="center" ' +
          '                                     style="background-color: #ffb000; color: white;"' +
          '                                    >\n' +
          '                                        <table ' +
          '                                         class="es-content-body" style="background-color: transparent;"' +
          '                                         width="640" cellspacing="0" cellpadding="0" align="center"' +
          '                                        >\n' +
          '                                            <tbody>\n' +
          '                                                <tr>\n' +
          '                                                    <td ' +
          '                                                    class="esd-structure es-p15t es-p15b es-p20r es-p20l" ' +
          '                                                     style="padding: 0 20px" align="left"' +
          '                                                    >\n' +
          '                                                        <table ' +
          '                                                           class="es-left"cellspacing="0" cellpadding="0" ' +
          '                                                           align="left"' +
          '                                                         >\n' +
          '                                                            <tbody>\n' +
          '                                                                <tr>\n' +
          '                                                                    <td ' +
          '                                                                     class="esd-container-frame" ' +
          '                                                                     width="290" align="left"' +
          '                                                                    >\n' +
          '                                                                       <table width="100%" cellspacing="0"' +
          '                                                                        cellpadding="0"' +
          '                                                                       >\n' +
          '                                                                            <tbody>\n' +
          '                                                                                <tr>\n' +
          '                                                                                    <td ' +
          '                                               class="es-infoblock esd-block-text es-m-txt-c" align="left"' +
          '                                                                                    >\n' +
          '                                                                                        <p ' +
          '                                     style="font-family: arial, helvetica\\ neue, helvetica, sans-serif;">' +
          '                                                                                          Music Monkey<br>' +
          '                                                                                        </p>\n' +
          '                                                                                    </td>\n' +
          '                                                                                </tr>\n' +
          '                                                                            </tbody>\n' +
          '                                                                        </table>\n' +
          '                                                                    </td>\n' +
          '                                                                </tr>\n' +
          '                                                            </tbody>\n' +
          '                                                        </table>\n' +
          '                                                    </td>\n' +
          '                                                </tr>\n' +
          '                                            </tbody>\n' +
          '                                        </table>\n' +
          '                                    </td>\n' +
          '                                </tr>\n' +
          '                            </tbody>\n' +
          '                        </table>\n' +
          '                        <table ' +
          '                         class="es-content esd-footer-popover" cellspacing="0" ' +
          '                         cellpadding="0" align="center"' +
          '                        >\n' +
          '                            <tbody>\n' +
          '                                <tr>\n' +
          '                                    <td ' +
          '                                     class="esd-stripe esd-checked" ' +
          'style="' +
          'background-image:url(' + eventImg + ');' +
          'background-color: rgb(61, 76, 107); ' +
          'background-position: left top; ' +
          'background-repeat: no-repeat; ' +
          'background-size: cover;" ' +
          'bgcolor="#3d4c6b" align="center"' +
          '                                   >\n' +
          '                                        <table ' +
          '                                         class="es-content-body" ' +
          '                                         style="background-color: rgba(0, 0, 0, 0.4);" ' +
          '                                         width="640" cellspacing="0" ' +
          '                                         cellpadding="0" ' +
          '                                         bgcolor="#f6f6f6"' +
          '                                         align="center"' +
          '                                        >\n' +
          '                                            <tbody>\n' +
          '                                                <tr>\n' +
          '                                                    <td ' +
          '                                                     class="esd-structure es-p10t es-p20r es-p20l" ' +
          '                                                     align="left"' +
          '                                                    >\n' +
          '                                                        <table ' +
          '                                                         width="100%" ' +
          '                                                         cellspacing="0" ' +
          '                                                         cellpadding="0"' +
          '                                                        >\n' +
          '                                                            <tbody>\n' +
          '                                                                <tr>\n' +
          '                                                                    <td ' +
          '                                                                     class="esd-container-frame" ' +
          '                                                                     width="600" valign="top" ' +
          '                                                                     align="center"' +
          '                                                                    >\n' +
          '                                                                        <table ' +
          '                                                                         width="100%" ' +
          '                                                                         cellspacing="0" ' +
          '                                                                         cellpadding="0"' +
          '                                                                        >\n' +
          '                                                                            <tbody>\n' +
          '                                                                                <tr>\n' +
          '                                                                                    <td ' +
          'class="esd-block-image es-p40t es-p25b" ' +
          'align="center" ' +
          'height="100"' +
          '                                                                                    >\n' +
          '                                                                                        <img ' +
          'src="https://res.cloudinary.com/dxk0d7mmy/image/upload/v1548149098/monkey_logo.png" ' +
          'style="display: block;" alt="Logo" title="Logo" width="100"' +
          '                                                                                        >\n' +
          '                                                                                    </td>\n' +
          '                                                                                </tr>\n' +
          '                                                                                <tr>\n' +
          '                                                                                    <td ' +
          '                                                                                     align="center" ' +
          '                                                                    class="esd-block-text es-p25t es-p30b"' +
          '                                                                                    >\n' +
          '                                                                                        ' +
          '                                   <h1 style="color: #ffffff; font-family: arial, helvetica, sans-serif;">' +
          '                                                                                       Event ' + event.name +
          '                                                                                       </h1>\n' +
          '                                                                                    </td>\n' +
          '                                                                                </tr>\n' +
          '                                                                            </tbody>\n' +
          '                                                                        </table>\n' +
          '                                                                    </td>\n' +
          '                                                                </tr>\n' +
          '                                                            </tbody>\n' +
          '                                                        </table>\n' +
          '                                                    </td>\n' +
          '                                                </tr>\n' +
          '                                                <tr>\n' +
          '                                                    <td ' +
          '                                                     class="esd-structure es-p40r es-p40l" ' +
          '                                                     esd-custom-block-id="6599" ' +
          '                                                     align="left"' +
          '                                                    >\n' +
          '                                                        <table ' +
          '                                                         class="es-left"' +
          '                                                         cellspacing="0"' +
          '                                                         cellpadding="0"' +
          '                                                         style="margin: 0 auto"' +
          '                                                        >\n' +
          '                                                            <tbody>\n' +
          '                                                                <tr>\n' +
          '                                                                    <td ' +
          '                                                                     class="esd-container-frame"' +
          '                                                                     width="196" ' +
          '                                                                     align="center"' +
          '                                                                    >\n' +
          '                                                                        <table ' +
          'style="border-radius: 3px; border-collapse: separate; background-color: white;" width="100%" ' +
          'cellspacing="0" cellpadding="0" bgcolor="#ffffff"' +
          '                                                                        >\n' +
          '                                                                            <tbody>\n' +
          '                                                                                <tr>\n' +
          '                                                                                    <td ' +
          'style="border-radius: 3px 3px 0 0; min-width: 100px;"' +
          ' bgcolor="#3aabd1" align="center" class="esd-block-text es-p10t es-p5b"' +
          '                                                                                    >\n' +
          '                 <p style="color: #ffffff; font-size: 14px; font-family: arial, helvetica, sans-serif;">\n' +
                                                                      moment(event.startDateTime).format('MMM') +
          '                                                                                        </p>\n' +
          '                                                                                    </td>\n' +
          '                                                                                </tr>\n' +
          '                                                                                <tr>\n' +
          '                                                                                    <td ' +
          'align="center" class="esd-block-text es-p15t es-p15b es-p15r es-p15l"' +
          '                                                                                    >\n' +
          '                                            <p style="color: #444444; font-size: 48px; line-height: 150%; ' +
          '                                          font-family: arial, helvetica\\ neue, helvetica, sans-serif;">\n' +
                                                                        moment(event.startDateTime).format('D') +
          '                                                                                        </p>\n' +
          '                                                                                    </td>\n' +
          '                                                                                </tr>\n' +
          '                                                                            </tbody>\n' +
          '                                                                        </table>\n' +
          '                                                                    </td>\n' +
          '                                                                </tr>\n' +
          '                                                            </tbody>\n' +
          '                                                        </table>\n' +
          '                                                    </td>\n' +
          '                                                </tr>\n' +
          '                                                <tr>\n' +
          '                                                    <td ' +
          '                                                     class="esd-structure es-p20t es-p15b es-p20r es-p20l"' +
          '                                                     align="left"' +
          '                                                    >\n' +
          '                                                        <table width="100%" cellspacing="0" ' +
          '                                                         cellpadding="0"' +
          '                                                        >\n' +
          '                                                            <tbody>\n' +
          '                                                                <tr>\n' +
          '                                                                    <td ' +
          '                                                                     class="esd-container-frame"' +
          '                                                                     width="600" ' +
          '                                                                     valign="top"' +
          '                                                                     align="center"' +
          '                                                                    >\n' +
          '                                                                        <table ' +
          '                                                                         width="100%" ' +
          '                                                                         cellspacing="0" ' +
          '                                                                         cellpadding="0"' +
          '                                                                        >\n' +
          '                                                                            <tbody>\n' +
          '                                                                                <tr>\n' +
          '                                                                                    <td ' +
          '                                                                               esdev-links-color="#b7bdc9"' +
          '                                                                    class="esd-block-text es-p15t es-p20b"' +
          '                                                                                            align="center"' +
          '                                                                                    >\n' +
          '                                                                                        <p ' +
          'style="color: white; font-family: \'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;">' +
          emailText +
          '                                                                                        </p>\n' +
          '                                                                                    </td>\n' +
          '                                                                                </tr>\n' +
          '                                                                                <tr>\n' +
          '                                                                                    <td ' +
          '                                      class="esd-block-button es-p5t es-p40b" height="50px" align="center"' +
          '                                                                                    > \n' +
          '                                                                                        <span ' +
          '                                                                                  class="es-button-border"' +
          '                                                                                           > \n' +
          '                                                                                            <a ' +
          'href="https://guests.musicmonkey.io/invite/' + event.invites[0] + '" class="es-button" target="_blank" ' +
          'style="color: white; font-family: arial, helvetica\\ neue, helvetica, sans-serif;"' +
          '                                                                                            > \n' +
          '                                                                                                click here' +
          '                                                                                        for more details\n' +
          '                                                                                            </a> \n' +
          '                                                                                        </span> \n' +
          '                                                                                    </td>\n' +
          '                                                                                </tr>\n' +
          '                                                                            </tbody>\n' +
          '                                                                        </table>\n' +
          '                                                                    </td>\n' +
          '                                                                </tr>\n' +
          '                                                            </tbody>\n' +
          '                                                        </table>\n' +
          '                                                    </td>\n' +
          '                                                </tr>\n' +
          '                                            </tbody>\n' +
          '                                        </table>\n' +
          '                                    </td>\n' +
          '                                </tr>\n' +
          '                            </tbody>\n' +
          '                        </table>\n' +
          '                    </td>\n' +
          '                </tr>\n' +
          '            </tbody>\n' +
          '        </table>\n' +
          '    </div>\n' +
          '</body>\n' +
          '\n' +
          '</html>' +
          '<a href="https://guests.musicmonkey.io/invite/' + event.invites[0] + '">' +
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
