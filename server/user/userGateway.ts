import { Promise } from 'es6-promise'
import { IUser } from '../model'

const schema = {
  hashKey: 'userId',
  rangeKey: 'email',

  timestamps: true,

  schema: {
    auth: {
      accessToken: Joi.string(),
      expiresIn: Joi.number(),
      refreshToken: Joi.string()
    },
    birthdate: Joi.string()
      .allow('')
      .optional(),
    country: Joi.string()
      .allow('')
      .optional(),
    displayName: Joi.string(),
    email: Joi.string().email(),
    image: Joi.string()
      .allow('')
      .optional(),
    userId: dynamo.types.uuid()
  },

  indexes: [
    {
      hashKey: 'email',
      name: 'EmailIndex',
      rangeKey: 'displayName',
      type: 'global'
    }
  ]
}

var params = {
  TableName: 'TABLE',
  Item: {
    CUSTOMER_ID: { N: '001' },
    CUSTOMER_NAME: { S: 'Richard Roe' }
  }
}

// Call DynamoDB to add the item to the table
ddb.putItem(params, function(err, data) {
  if (err) {
    console.log('Error', err)
  } else {
    console.log('Success', data)
  }
})

const tableName = 'MM-Dev-User'

export default class UserGateway {
  constructor(private AWS: any) {
    this.ddb = new this.AWS.DynamoDB({ apiVersion: '2012-10-08' })
  }

  public createUser(user: IUser) {
    return new Promise((resolve, reject) => {
      User.create(user, (err: Error, userModel: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(userModel)
        }
      })
    })
  }

  public updateUser(user: IUser) {
    return new Promise((resolve, reject) => {
      User.update(user, (err: any, userModel: any) => {
        if (err) {
          return reject(err)
        }
        return resolve(userModel)
      })
    })
  }

  public deleteUser(userId: string) {
    return new Promise((resolve, reject) => {
      User.destroy(userId, (err: Error) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }

  public getUserById(userId: string) {
    return new Promise((resolve, reject) => {
      User.get(userId, (err: Error, userModel: any) => {
        if (err) {
          return reject(err)
        }
        return resolve(userModel)
      })
    })
  }

  public getUserByEmail(user: IUser) {
    return new Promise((resolve, reject) => {
      User.query(user.email)
        .usingIndex('EmailIndex')
        .limit(1)
        .exec((err: any, userModel: any) => {
          if (err || userModel.Items.length < 1) {
            return reject(err)
          }
          return resolve(userModel.Items[0].attrs)
        })
    })
  }
}
