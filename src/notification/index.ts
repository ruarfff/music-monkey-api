import Pusher = require('pusher')
import {
  PUSHER_APP_ID,
  PUSHER_CLUSTER,
  PUSHER_KEY,
  PUSHER_SECRET
} from '../config'

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: PUSHER_CLUSTER,
  encrypted: true
})

export * from './notificationService'

export const send = (channel: string, event: string, body: any = null) => {
  if (body) {
    pusher.trigger(channel, event, body)
  } else {
    pusher.trigger(channel, event, {})
  }
}
