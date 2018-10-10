const SVGO = require('svgo')
const { trace } = require('potrace')
const sizeOf = require('image-size')

const defaultOptions = {
  color: 'lightgray',
  optTolerance: 0.4,
  turdSize: 100
}

// optimize :: String -> Promise String
const optimize = svg => {
  const svgo = new SVGO({ multipass: true, floatPrecision: 0 })
  return svgo.optimize(svg)
}

// encodeOptimizedSVGDataUri :: String -> String
function encodeOptimizedSVGDataUri(svgString) {
  const uriPayload = encodeURIComponent(svgString) // encode URL-unsafe characters
    .replace(/%0A/g, ``) // remove newlines
    .replace(/%20/g, ` `) // put spaces back in
    .replace(/%3D/g, `=`) // ditto equals signs
    .replace(/%3A/g, `:`) // ditto colons
    .replace(/%2F/g, `/`) // ditto slashes
    .replace(/%22/g, `'`) // replace quotes with apostrophes (may break certain SVGs)
  return `data:image/svg+xml,` + uriPayload
}

// format :: String -> Size -> String
const format = data => size =>
  JSON.stringify({
    tracedSvg: encodeOptimizedSVGDataUri(data),
    aspectRatio: (size.width / size.height).toFixed(3)
  })

// cute :: Config -> Promise String
const cute = ({ filePath, encode = true, options = defaultOptions }) =>
  new Promise((res, rej) => {
    trace(filePath, options, (err, svg) => {
      if (err) rej(err)
      optimize(svg)
        .then(
          ({ data }) =>
            encode ? res(format(data)(sizeOf(filePath))) : res(data)
        )
        .catch(e => rej(e))
    })
  })

module.exports = cute
