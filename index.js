
/**
 * Get notified if your code run into warning/error state.
 * Configure frequencies for your sounds.
 * 
 * Contribute or make a pull request on https://github.com/jasofalcon/log-beep
 * 
 * Thank you for using log-beep
 * 
 * version 1.0.2
 */

var global = global || window

var LogBeep = (function (global) {

    var DEFAULT_FREQUENCY = {
        WARN: 200,
        ERROR: 400
    }

    var ENVIRONMENT = {
        DEV: 'dev',
        PROD: 'prod'
    }

    var RAMP_VALUE = 0.00001
    var RAMP_DURATION = 2

    // Default config values
    var defaultConfig = {
        env: "dev",
        frequency: DEFAULT_FREQUENCY
    }

    var AudioCtx = global.AudioContext || global.webkitAudioContext
    /**
     * Main object containing audio context and configuration
     */
    var logBeep = { context: new AudioCtx(), env: defaultConfig.env, frequency: DEFAULT_FREQUENCY }

    function config(options) {
        options = options || {}

        validateConfig(options)

        config = Object.create(defaultConfig)

        logBeep = Object.assign(logBeep, config, options)
    }

    function info(message, ...args) {
        console.info(message, args)
    }

    function warn(message, ...args) {
        console.warn(message, args)

        if (logBeep.env === 'dev') playWarn()
    }

    function error(message, ...args) {
        console.error(message, args)

        if (logBeep.env === 'dev') playError()
    }

    function playError() {
        play(logBeep.frequency.ERROR)
    }

    function playWarn() {
        play(logBeep.frequency.WARN)
    }

    function play(frequency) {

        var currentTime = logBeep.context.currentTime
        var oscillator = logBeep.context.createOscillator()
        var gain = logBeep.context.createGain()

        oscillator.type = 'sine'

        oscillator.connect(gain)
        gain.connect(logBeep.context.destination)

        gain.gain.setValueAtTime(gain.gain.value, currentTime)
        gain.gain.exponentialRampToValueAtTime(RAMP_VALUE, currentTime + RAMP_DURATION)

        oscillator.onended = function () {
            gain.disconnect(logBeep.context.destination)
            oscillator.disconnect(gain)
        }

        oscillator.frequency.setValueAtTime(frequency, currentTime)
        oscillator.start(currentTime)
        oscillator.stop(currentTime + RAMP_DURATION)
    }

    function validateConfig(options) {
        //Validate env
        if (options.hasOwnProperty('env')) {
            if (!(options.env === ENVIRONMENT.DEV || options.env === ENVIRONMENT.PROD)) {
                throw new Error("You must provide proper env value or omit it. Values can be: 'dev' or 'prod'")
            }
        }
        if (options.hasOwnProperty('frequency')) {
            var fr = options.frequency
            if (!fr.hasOwnProperty('WARN') || !fr.hasOwnProperty('ERROR')) {
                throw new Error("You must provide ERROR and WARN frequencies if frequency parameter is provided. If you prefer default, just omit it.")
            }

            if (!Number.isInteger(fr.WARN) || !Number.isInteger(fr.ERROR)) {
                throw new Error("WARN and ERROR parameters must be of integer type")
            }
        }
    }

    return {
        config: config,
        info: info,
        warn: warn,
        error: error
    }

})(global)


module.exports = LogBeep