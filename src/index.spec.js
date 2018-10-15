const cute = require('./index')
const sample = __dirname + '/sample.jpg'

describe('Test suite for the cute-svg library', () => {
  it('should return a string', () => {
    return cute({ filePath: sample, stringify: true }).then(data => {
      expect(typeof data === 'string' || data instanceof String).toBe(true)
    })
  })

  it('should return an object with aspectRatio and tracedSvg', () => {
    return cute({ filePath: sample }).then(data => {
      expect(data).toHaveProperty('aspectRatio')
      expect(data).toHaveProperty('tracedSvg')
    })
  })

  it(`should throw an error if it can't find the file`, () => {
    return cute({ filePath: '/somefolderthatdoesntexist' }).catch(e =>
      expect(e).toBe('ERROR: File not found')
    )
  })
})
