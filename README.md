# Cute SVG

### From this:

133kb

![notcute](./src/sample.jpg 'Sample image not cute')

### To this:

36kb

![cute](./src/output.png 'Sample image cute')

## Install

`yarn add cute-svg`

## Usage

```js
const cute = require('cute-svg')
const fs = require('fs')

const inputFile = __dirname + '/sample.jpg'
const outputFile = __dirname + '/output.txt'

cute({ filePath: inputFile })
  .then(svg => fs.writeFileSync(outputFile, svg))
  .catch(e => console.log(e))
```
