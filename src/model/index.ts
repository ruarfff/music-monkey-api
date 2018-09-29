// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')
import { DYNAMO_DB_ID, DYNAMO_DB_REGION, DYNAMO_DB_SECRET_KEY } from '../config'
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
  accessKeyId: DYNAMO_DB_ID,
  region: DYNAMO_DB_REGION,
  secretAccessKey: DYNAMO_DB_SECRET_KEY
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
