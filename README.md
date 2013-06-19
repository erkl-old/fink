**fink** lets you monitor which files your node.js process touches.

#### Usage

```js
var fink = require('fink')

fink.on('readFileSync', function (args, stack) {
  // do something useful here
})
```
