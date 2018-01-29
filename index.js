
var LOGGER = (function (global) {

    var ERROR_FREQUENCY = 800
    var WARN_FREQUENCY = 400
    var INTERVAL = 250
    var RAMP_VALUE = 0.00001
    var RAMP_DURATION = 1

    // Default config values
    var logBeep = {
        env: "dev"
    }

    function config(options) {
        options = options || logBeep

    }

    function info(message, ...args) {
        //check if sound is needed
        console.info(message, args)
    }

    function warn(message, ...args) {
        // play sound for warning if needed

        playWarn()

        console.warn(message, args)
    }

    function error(message, ...args) {
        // play sound for err

        playError()

        console.error(message, args)
    }


    // PRIVATE
    function setupAudioOscillator() {

    }

    function playError() {
        play(ERROR_FREQUENCY)
    }

    function playWarn() {
        play(WARN_FREQUENCY)
    }

    function play(frequency) {

        var context = new (window.AudioContext || window.webkitAudioContext)();
        var frequency = ERROR_FREQUENCY
        var interval = INTERVAL

        var currentTime = context.currentTime
        var osc = context.createOscillator()
        var gain = context.createGain()

        osc.connect(gain)
        gain.connect(context.destination)

        gain.gain.setValueAtTime(gain.gain.value, currentTime)
        gain.gain.exponentialRampToValueAtTime(RAMP_VALUE, currentTime + RAMP_DURATION)

        osc.onended = function () {
            gain.disconnect(context.destination)
            osc.disconnect(gain)
        }

        osc.type = 'sine'
        osc.frequency.value = frequency
        osc.start(currentTime)
        osc.stop(currentTime + RAMP_DURATION)
    }

    return {
        config: config,
        info: info,
        warn: warn,
        error: error
    }

})(global)

module.exports = LOGGER