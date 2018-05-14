// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

dynamo.AWS.config.update({
  accessKeyId: 'AKIAIPMZTEODQOZYSNQA',
  region: 'eu-west-1',
  secretAccessKey: '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'
})

export * from './event'
export * from './user'
export * from './invite'

export const createTables = () => {
  dynamo.createTables((err: Error) => {
    if (err) {
      console.log('Error creating tables: ', err)
    } else {
      console.log('Tables have been created')
    }
  })
}
