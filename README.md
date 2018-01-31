# Log Beep

Useful library that lets you get notified whenever you log an error or a warning with different beep sounds. 
Easily configurable. It doesn't make sounds for production build. Just initialize it with env='prod'

version 1.0.1

## Installation


```shell
$ npm i --save log-beep
```


## Usage
```js
// !! Don't forget to turn on speakers!!

var LogBeep = require('log-beep') 
// or use ES6: import LogBeep from 'log-beep'

var options = {
    env: 'dev'  // default
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
Feel free to create a pull request should you find a bug or want to extend the lib with new features.
