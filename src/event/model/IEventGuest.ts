import { IRsvp } from '../../model'
import ISafeUser from '../../user/model/ISafeUser'

export default interface IEventGuest {
  user: ISafeUser
  rsvp: IRsvp
}
