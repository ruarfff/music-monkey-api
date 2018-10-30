import { isEmpty } from 'lodash'
import util = require('util')
import { logError } from '../logging'
import { Notification } from '../model'
import cleanModel from '../model/cleanModel'
import INotification from './INotification'

export const getNotificationsByUserId = async (userId: string) => {
  const result: any = await util.promisify(
    Notification.query(userId).usingIndex('UserIdIndex').exec
  )
  if (isEmpty(result) || isEmpty(result.Items)) {
    return []
  }
  return result.Items.map((item: any) => cleanModel(item.attrs))
}

export const saveNotification = async (notification: INotification) => {
  try {
    const savedNotification = await Notification.create(notification)
    return savedNotification
  } catch (err) {
    logError('Failed to create notification', err)
    throw err
  }
}

export const modifyNotification = async (notification: INotification) => {
  return await util.promisify(Notification.update(notification))
}

export const fetchNotificationByIdAndUserId = async (
  notificationId: string,
  userId: string
) => {
  try {
    const { attrs } = await util.promisify(Notification.get)(
      notificationId,
      userId
    )
    return cleanModel(attrs)
  } catch (err) {
    logError('Error fetching notification by ID and userId', err)
    return null
  }
}
