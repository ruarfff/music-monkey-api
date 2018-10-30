export const notifications = [
  {
    userId: 'host-userId',
    type: 'rsvp',
    context: 'event',
    contextId: 'eventId1',
    text: 'Some Person is going to Event X.',
    status: 'Unread'
  },
  {
    userId: 'host-userId',
    type: 'rsvp',
    context: 'event',
    contextId: 'eventId2',
    text: 'Some Person is going to Event X.',
    status: 'Unread'
  },
  {
    userId: 'host-userId',
    type: 'rsvp',
    context: 'event',
    contextId: 'eventId3',
    text: 'Some Person is going to Event X.',
    status: 'Unread'
  }
]

export const createNotification = (data: any, option: string) => {
  const { userId, event } = data
  switch (option) {
    case 'rsvp':
      notifications.push({
        userId,
        type: 'rsvp',
        context: event,
        contextId: event.eventId,
        text: `Some Person is going to Event ${event.name}`,
        status: 'Unread'
      })
  }
}

export const getNotificationByUserId = (userId: string) => {
  return notifications.filter(n => n.userId === userId)
}
