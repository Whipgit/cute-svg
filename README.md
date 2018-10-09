[![npm](https://img.shields.io/npm/v/cute-svg.svg)](http://npm.im/cute-svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/rametta/cute-svg/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# 📸 Cute SVG

Image optimizer by converting to SVG.

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

## Example

### From this:

133kb

![notcute](./src/sample.jpg 'Sample image not cute')

### To this:

36kb

![cute](./src/output.png 'Sample image cute')
