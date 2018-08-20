const Pusher = require('pusher')

const pusher = new Pusher({
  appId: '536146',
  key: 'd7c284d8f17d26f74047',
  secret: 'b745eb542c9fc267ead7',
  cluster: 'eu',
  encrypted: true
})

export const send = (channel: string, event: string, body: any = null) => {
  if (body) {
    pusher.trigger(channel, event, body)
  } else {
    pusher.trigger(channel, event)
  }
}
