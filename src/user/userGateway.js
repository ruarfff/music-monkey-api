const dynamo = require('dynamodb')
const Joi = require('joi')

dynamo.AWS.config.update({
  accessKeyId: 'AKIAIPMZTEODQOZYSNQA',
  secretAccessKey: '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',
  region: 'eu-west-1'
})

const User = dynamo.define('MM-Dev-User', {
  hashKey: 'userId',
  rangeKey: 'email',

  timestamps: true,

  schema: {
    userId: dynamo.types.uuid(),
    displayName: Joi.string(),
    email: Joi.string().email(),
    country: Joi.string(),
    birthdate: Joi.string(),
    image: Joi.string(),
    auth: {
      refreshToken: Joi.string(),
      accessToken: Joi.string(),
      expiresIn: Joi.number()
    }
  },

  indexes: [
    {
      hashKey: 'email',
      rangeKey: 'displayName',
      name: 'EmailIndex',
      type: 'global'
    }
  ]
})

dynamo.createTables(err => {
  if (err) {
    console.log('Error creating tables: ', err)
  } else {
    console.log('Tables has been created')
  }
})

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
      return resolve(userModel.get('email'))
    })
  })
}

exports.deleteUser = user => {
  return new Promise((resolve, reject) => {
    User.destroy(user.email, err => {
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
      return resolve(userModel.get('userId'))
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
