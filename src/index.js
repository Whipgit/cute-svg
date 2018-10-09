const SVGO = require('svgo')
const { trace } = require('potrace')

const options = {
  color: `lightgray`,
  optTolerance: 0.4,
  turdSize: 100
}

// optimize :: String -> Promise
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

// cute :: Config -> Promise
const cute = ({ filePath, encode = true }) =>
  new Promise((res, rej) => {
    trace(filePath, options, (err, svg) => {
      if (err) rej(err)
      optimize(svg)
        .then(
          ({ data }) =>
            encode ? res(encodeOptimizedSVGDataUri(data)) : res(data)
        )
        .catch(e => rej(e))
    })
  })

module.exports = cute
