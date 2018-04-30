const dynamo = require('dynamodb');
const Joi = require('joi');

dynamo.AWS.config.update({accessKeyId: 'AKIAIPMZTEODQOZYSNQA', secretAccessKey: '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', region: "eu-west-1"});

const User = dynamo.define('MM-Dev-User', {
  hashKey : 'email',

  timestamps : true,

  schema : {
    email   : Joi.string().email(),
    name    : Joi.string()
  }
});

dynamo.createTables(function(err) {
  if (err) {
    console.log('Error creating tables: ', err);
  } else {
    console.log('Tables has been created');
  }
});

