import { send } from './index'
import INotification from './INotification'

export const onNotificationSaved = (notification: INotification) => {
  console.log('notification')
  send(
    'mm-user-notifications-' + notification.userId,
    'notifications-saved',
    notification
  )
}
