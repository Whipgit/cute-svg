const fs = require('fs')
const SVGO = require('svgo')
const { trace } = require('potrace')
const sizeOf = require('image-size')

const defaultOptions = {
  color: 'lightgray',
  optTolerance: 0.4,
  turdSize: 100
}

// optimize :: String -> Promise String
const optimize = svg =>
  new SVGO({ multipass: true, floatPrecision: 0 }).optimize(svg)

// encodeOptimizedSVGDataUri :: String -> String
const encodeOptimizedSVGDataUri = svg => {
  const uriPayload = encodeURIComponent(svg) // encode URL-unsafe characters
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

// exists :: String -> Promise String
const exists = file =>
  new Promise((res, rej) =>
    fs.access(file, err => (err ? rej('ERROR: File not found') : res(file)))
  )

// size :: String -> Promise Size
const size = file =>
  new Promise((res, rej) =>
    sizeOf(
      file,
      (err, sizes) =>
        err ? rej('ERROR: Could not get size of image') : res(sizes)
    )
  )

// outline :: Boolean -> Options -> String -> Size -> Promise String
const outline = encode => options => path => sizes =>
  new Promise((res, rej) =>
    trace(path, options, (err, svg) => {
      err
        ? rej('ERROR: Could not create SVG trace')
        : optimize(svg)
            .then(({ data }) => (encode ? res(format(data)(sizes)) : res(data)))
            .catch(() => rej('ERROR: Could not optimize SVG'))
    })
  )

// createSvg :: Boolean -> Options -> String -> Promise String
const createSvg = encode => options => path =>
  size(path).then(outline(encode)(options)(path))

// cute :: Config -> Promise String
const cute = ({ filePath, encode = true, options = defaultOptions }) =>
  exists(filePath).then(createSvg(encode)(options))

module.exports = cute
