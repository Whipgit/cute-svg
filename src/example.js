const cute = require('./index')
const fs = require('fs')

const inputFile = __dirname + '/sample.jpg'
const outputFile = __dirname + '/output.json'

cute({ filePath: inputFile })
  .then(data => fs.writeFileSync(outputFile, data))
  .catch(e => console.log(e))
