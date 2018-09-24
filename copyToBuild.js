const fs = require('fs-extra')

fs.copy('public', './build/server/public', err => {
  if (err) return console.error(err)

  console.log('copy success!')
})
