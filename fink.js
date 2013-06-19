var events = require('events')
  , fs = require('fs')

var handle = new events.EventEmitter()

// attach our listeners to all functions we're interested in
for (var key in fs) {
  fs[key] = /^[a-z]/.test(key) ? wrap(fs[key], key) : fs[key]
}

// intercepts all calls to `fn`, and broadcasts them to the
// global handle
function wrap(fn, name) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
      , stack = trace(1)

    // skip calls originating from inside the fs module itself
    if (stack.length === 0 || stack[0].file !== 'fs.js') {
      handle.emit(name, args, stack)
      handle.emit('call', name, args, stack)
    }

    return fn.apply(null, args)
  }
}

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

module.exports = handle
