// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')
import { logError, logInfo } from '../logging'
import {
  eventTableName,
  inviteTableName,
  rsvpTableName,
  suggestionTableName,
  userTableName,
  voteTableName
} from './modelConstants'

dynamo.AWS.config.update({
  accessKeyId: 'AKIAIPMZTEODQOZYSNQA',
  region: 'eu-west-1',
  secretAccessKey: '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'
})

export * from './event'
export * from './user'
export * from './invite'
export * from './suggestion'
export * from './rsvp'
export * from './vote'

export const createTables = () => {
  dynamo.createTables(
    {
      [eventTableName]: { readCapacity: 5, writeCapacity: 3 },
      [inviteTableName]: { readCapacity: 5, writeCapacity: 2 },
      [rsvpTableName]: { readCapacity: 5, writeCapacity: 2 },
      [suggestionTableName]: { readCapacity: 5, writeCapacity: 5 },
      [userTableName]: { readCapacity: 5, writeCapacity: 2 },
      [voteTableName]: { readCapacity: 5, writeCapacity: 5 }
    },
    (err: Error) => {
      if (err) {
        logError('Error creating tables: ', err)
      } else {
        logInfo('Tables have been created')
      }
    }
  )
}
