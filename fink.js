// returns a stack trace ending `skip` levels above the caller
function trace(skip) {
  return (new Error('')).stack
    .split('\n')
    .filter(function (line) {
      return line.substring(0, 7) === '    at '
    })
    .slice(1 + (skip || 0))
    .map(function (line) {
      line = line.substring(7)

      var match = line.match(/^(.*) \(([^:]*)(?::([0-9]+):([0-9]+))?\)$/) ||
                  line.match(/^()(.*):([0-9]+):([0-9]+)$/)

      return (
        { ident: match[1]
        , file: match[2] || 'native'
        , line: match[3] != null ? +match[3] : -1
        , column: match[4] != null ? +match[4] : -1
        })
    })
}
