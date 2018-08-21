import { IRsvp } from '../model'
import ISafeUser from '../user/ISafeUser'

export default interface IEventGuest {
  user: ISafeUser
  rsvp: IRsvp
}
