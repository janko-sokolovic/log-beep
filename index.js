
var LOGGER = (function (global) {

    FREQUENCY = {
        WARN: 400,
        ERROR: 800
    }

    var INTERVAL = 250
    var RAMP_VALUE = 0.00001
    var RAMP_DURATION = 3

    // Default config values
    var logBeep = {
        env: "dev"
    }

    function config(options) {
        options = options || logBeep
        logBeep.context = new (global.AudioContext || global.webkitAudioContext)();
    }

    function info(message, ...args) {
        console.info(message, args)
    }

    function warn(message, ...args) {
        playWarn()
        console.warn(message, args)
    }

    function error(message, ...args) {
        playError()
        console.error(message, args)
    }

    function playError() {
        play(FREQUENCY.ERROR)
    }

    function playWarn() {
        play(FREQUENCY.WARN)
    }

    function play(frequency) {

        var currentTime = logBeep.context.currentTime
        logBeep.oscillator = logBeep.context.createOscillator()
        logBeep.gain = logBeep.context.createGain()
        logBeep.oscillator.type = 'sine'

        logBeep.oscillator.connect(logBeep.gain)
        logBeep.gain.connect(logBeep.context.destination)

        logBeep.gain.gain.setValueAtTime(logBeep.gain.gain.value, currentTime)
        logBeep.gain.gain.exponentialRampToValueAtTime(RAMP_VALUE, currentTime + RAMP_DURATION)

        logBeep.oscillator.onended = function () {
            logBeep.gain.disconnect(logBeep.context.destination)
            logBeep.oscillator.disconnect(logBeep.gain)
        }

        logBeep.oscillator.frequency.setValueAtTime(frequency, currentTime)
        logBeep.oscillator.start(currentTime)
        logBeep.oscillator.stop(currentTime + RAMP_DURATION)
    }

    return {
        config: config,
        info: info,
        warn: warn,
        error: error
    }

})(global)

module.exports = LOGGER