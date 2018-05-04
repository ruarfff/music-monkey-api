import * as AWS from 'aws-sdk'

AWS.config.update({
  accessKeyId: 'AKIAIPMZTEODQOZYSNQA',
  region: 'eu-west-1',
  secretAccessKey: '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'
})

export * from './event'
export * from './user'
