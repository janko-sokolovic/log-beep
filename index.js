
/**
 * Get notified if your code run into warning/error state.
 * Configure frequencies for your sounds.
 * 
 * Contribute or make a pull request on https://github.com/jasofalcon/log-beep
 * 
 * Thank you for using log-beep
 * 
 * version 0.2.0
 */
var LogBeep = (function (global) {

    var DEFAULT_FREQUENCY = {
        WARN: 200,
        ERROR: 400
    }

    var RAMP_VALUE = 0.00001
    var RAMP_DURATION = 2

    // Default config values
    var defaultConfig = {
        env: "dev",
        frequency: DEFAULT_FREQUENCY
    }

    /**
     * Main object containing audio context and configuration
     */
    var logBeep

    function config(options) {
        options = options || {}

        config = Object.create(defaultConfig)

        logBeep = Object.assign(options, config)

        logBeep.context = new (global.AudioContext || global.webkitAudioContext)()
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

    return {
        config: config,
        info: info,
        warn: warn,
        error: error
    }

})(global)

module.exports = LogBeep