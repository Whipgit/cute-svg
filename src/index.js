const fs = require('fs')
const SVGO = require('svgo')
const { trace } = require('potrace')
const JPEG = require('jpeg-js')

const defaultOptions = {
  color: 'lightgray',
  optTolerance: 0.4,
  turdSize: 100
}

// shouldOptimize :: Boolean -> SvgSizes -> Promise String
const shouldOptimize = optimize => ({ svg, sizes }) =>
  optimize
    ? new SVGO({ multipass: true, floatPrecision: 0 })
        .optimize(svg)
        .then(({ data }) => ({ optimized: data, sizes }))
        .catch(() => 'ERROR: Could not optimize SVG')
    : { optimized: svg, sizes }

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
const format = data => size => ({
  tracedSvg: encodeOptimizedSVGDataUri(data),
  aspectRatio: (size.width / size.height).toFixed(3)
})

// exists :: String -> Promise String
const exists = file =>
  new Promise((res, rej) =>
    fs.access(file, err => (err ? rej('ERROR: File not found') : res(file)))
  )

// outline :: Options -> String -> Size -> Promise String
const outline = options => path => sizes =>
  new Promise((res, rej) =>
    trace(path, options, (err, svg) => {
      err ? rej('ERROR: Could not create SVG trace') : res({ svg, sizes })
    })
  )

// shouldEncode :: Boolean -> Optimized -> String | Formatted
const shouldEncode = encode => ({ optimized, sizes }) =>
  encode ? format(optimized)(sizes) : svg

// shouldStringify :: Boolean -> String | Formatted -> String
const shouldStringify = makeStringy => svg =>
  makeStringy ? JSON.stringify(svg) : svg

// isDecodeable :: String -> Promise Size
const isDecodable = path =>
  new Promise((res, rej) => {
    fs.readFile(path, (err, data) => {
      if (err) rej('Error: Could not read file')
      try {
        const sizes = JPEG.decode(data)
        res(sizes)
      } catch (e) {
        rej('Error: The file provided is not JPEG decodable')
      }
    })
  })

// cute :: Config -> Promise String
const cute = ({
  filePath,
  encode = true,
  stringify = false,
  optimize = true,
  options = defaultOptions
}) =>
  exists(filePath)
    .then(isDecodable)
    .then(outline(options)(filePath))
    .then(shouldOptimize(optimize))
    .then(shouldEncode(encode))
    .then(shouldStringify(stringify))

module.exports = cute
