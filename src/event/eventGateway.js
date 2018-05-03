const Event = require('../model').Event

exports.createEvent = event => {
  return new Promise((resolve, reject) => {
    Event.create(event, (err, eventModel) => {
      if (err) {
        reject(err)
      } else {
        resolve(eventModel)
      }
    })
  })
}

exports.updateEvent = event => {
  return new Promise((resolve, reject) => {
    Event.update(event, (err, eventModel) => {
      if (err) {
        return reject(err)
      }
      return resolve(eventModel)
    })
  })
}

exports.deleteEvent = eventId => {
  return new Promise((resolve, reject) => {
    Event.destroy(eventId, err => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

exports.getEventById = eventId => {
  return new Promise((resolve, reject) => {
    Event.get(eventId, (err, eventModel) => {
      if (err) {
        return reject(err)
      }
      return resolve(eventModel)
    })
  })
}

exports.getEventByUserId = userId => {
  return new Promise((resolve, reject) => {
    Event.query(userId)
      .usingIndex('UserIdIndex')
      .exec((err, eventModel) => {
        if (err || eventModel.Items.length < 1) {
          return reject(err)
        }
        return resolve(eventModel.Items.map(item => item.attrs))
      })
  })
}
