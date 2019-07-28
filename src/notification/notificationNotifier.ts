import { send } from './index'
import INotification from './INotification'

export const onNotificationSaved = (notification: INotification) => {
  send(
    'mm-user-notifications-' + notification.userId,
    'notifications-saved',
    notification
  )
}
