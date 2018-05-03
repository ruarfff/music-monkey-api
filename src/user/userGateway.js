const User = require('../model').User

exports.createUser = user => {
  return new Promise((resolve, reject) => {
    User.create(user, (err, userModel) => {
      if (err) {
        reject(err)
      } else {
        resolve(userModel)
      }
    })
  })
}

exports.updateUser = user => {
  return new Promise((resolve, reject) => {
    User.update(user, (err, userModel) => {
      if (err) {
        return reject(err)
      }
      return resolve(userModel)
    })
  })
}

exports.deleteUser = userId => {
  return new Promise((resolve, reject) => {
    User.destroy(userId, err => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

exports.getUserById = userId => {
  return new Promise((resolve, reject) => {
    User.get(userId, (err, userModel) => {
      if (err) {
        return reject(err)
      }
      return resolve(userModel)
    })
  })
}

exports.getUserByEmail = user => {
  return new Promise((resolve, reject) => {
    User.query(user.email)
      .usingIndex('EmailIndex')
      .limit(1)
      .exec((err, userModel) => {
        if (err || userModel.Items.length < 1) {
          return reject(err)
        }
        return resolve(userModel.Items[0].attrs)
      })
  })
}
