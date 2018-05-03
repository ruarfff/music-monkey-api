const dynamo = require('dynamodb')

dynamo.AWS.config.update({
  accessKeyId: 'AKIAIPMZTEODQOZYSNQA',
  secretAccessKey: '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',
  region: 'eu-west-1'
})

const User = require('./user')
const Event = require('./event')

dynamo.createTables(err => {
  if (err) {
    console.log('Error creating tables: ', err)
  } else {
    console.log('Tables have been created')
  }
})

module.exports = {
  User: User,
  Event: Event
}
