const multer = require('multer')
const AWS = require('aws-sdk')
const uuidv5 = require('uuid/v5')

const bucket = 'musicmonkey-uploads'

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: bucket }
})
// TODO: Temporary hardcoding here. Will remove user and set this up properly soon.
AWS.config.update({
  accessKeyId: 'AKIAIDX53D4NJCS7FZOQ',
  secretAccessKey: '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',
  subregion: 'eu-west-1'
})

// memory storage keeps file data in a buffer
const upload = multer({
  storage: multer.memoryStorage(),
  // file size limitation in bytes
  limits: { fileSize: 52428800 }
})

module.exports = function(app) {
  var router = app.loopback.Router()
  router.post('/upload', upload.single('event-image'), (req, res) => {
    const key = 'event-images/'
    const fileName = uuidv5.URL + '-' + req.file.originalname
    s3.putObject(
      {
        Key: key + fileName,
        Body: req.file.buffer,
        ACL: 'public-read'
      },
      (err) => {
        if (err) {
          return res.status(400).send(err)
        } else {
          res.send(`http://${bucket}.s3.amazonaws.com/${key}${fileName}`)
        }
      }
    )
  })

  app.use(router)
}
