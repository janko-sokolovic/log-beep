# Log Beep

version 0.2.0

### Description
Useful library that lets you get notified whenever you log the error or warning with different beep sounds. 
Easily configurable and it doesn't make sounds for production build. Just initialize it with env = 'prod'

## Installation

In a browser:
```html
<script src="log-beep.js"></script>
```

Using npm:
```shell
$ npm i --save log-beep
```


## Usage
```js
// !! Don't forget to turn on speakers!!

var LogBeep = require('log-beep')

var options = {
    env: 'prod'  // default is 'dev',
    frequency: {
        WARN: 300, // default is 200
        ERROR: 600 // default is 400
    }
}

LogBeep.config(options)

// then in your code use:
LogBeep.warn("Object has unexpected value", obj)
// or
LogBeep.error("Bad attribute provided, should not be null", obj)

```

## Contribute
Feel free to add ideas for expansion and create a pull request should you find some bug or want to extend the lib
