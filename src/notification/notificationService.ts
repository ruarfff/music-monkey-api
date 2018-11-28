import INotification from './INotification'
import {
  fetchNotificationByIdAndUserId,
  getNotificationsByUserId,
  modifyNotification,
  saveNotification
} from './notificationGateway'
import { onNotificationSaved } from './notificationNotifier'

export const createNotification = async (notification: INotification) => {
  const defaultStatus = 'Unread'
  let savedNotification: INotification = null
  if (!notification.userId) {
    throw new Error('UserId is required to create a notification')
  }
  if (!notification.status) {
    savedNotification = await saveNotification({
      ...notification,
      status: defaultStatus
    })
  } else {
    savedNotification = await saveNotification(notification)
  }
  onNotificationSaved(savedNotification)
  return savedNotification
}

export const updateNotification = async (notification: INotification) => {
  onNotificationSaved(notification)
  return await modifyNotification(notification)
}

export const getUsersNotifications = async (userId: string) => {
  return await getNotificationsByUserId(userId)
}

export const getNotificationByIdAndUserId = async (
  notificationId: string,
  userId: string
) => {
  return await fetchNotificationByIdAndUserId(notificationId, userId)
}
