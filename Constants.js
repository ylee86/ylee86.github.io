const CONSTANTS = {
    //arrow keys
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,

    //midi values
    MIDI_MIN: 0,
    MIDI_MAX: 127,

    //intervals
    PERFECT_OCTAVE: 12,
    PERFECT_FIFTH: 7,
    PERFECT_UNISON: 0,

    //
    MIDI_FREQUENCIES: [],
    MIDI_PITCHES: [],
}

function midiToFrequency() {
    const frequencyArray = [];
    for (let i = CONSTANTS.MIDI_MIN; i < CONSTANTS.MIDI_MAX; i++) {
        const frequency = 440*Math.pow(1.059463,(i-69));
        frequencyArray.push(frequency);
    }
    //console.log(frequencyArray);
    CONSTANTS.MIDI_FREQUENCIES = frequencyArray;
}

function midiToPitch() {
    const pitchArray = [];
    for (let i = CONSTANTS.MIDI_MIN; i < CONSTANTS.MIDI_MAX; i++) {
        let val;
        const pitchVal = i%CONSTANTS.PERFECT_OCTAVE;
        const octVal = Math.floor(i/CONSTANTS.PERFECT_OCTAVE);
        switch (pitchVal) {
            case 0:
                val = 'c/'+ octVal;
                break;
            case 1:
                val = 'c#/'+ octVal;
                break;
            case 2:
                val = 'd/'+ octVal;
                break;
            case 3:
                val = 'eb/'+ octVal;
                break;
            case 4:
                val = 'e/'+ octVal;
                break;
            case 5:
                val = 'f/'+ octVal;
                break;
            case 6:
                val = 'f#/'+ octVal;
                break;
            case 7:
                val = 'g/'+ octVal;
                break;
            case 8:
                val = 'g#/'+ octVal;
                break;
            case 9:
                val = 'a/'+ octVal;
                break;
            case 10:
                val = 'bb/'+ octVal;
                break;
            case 11:
                val = 'b/'+ octVal;
                break;
        }
        pitchArray.push(val);
    }
    //console.log(pitchArray);
    CONSTANTS.MIDI_PITCHES = pitchArray;
}

// init
midiToFrequency();
midiToPitch();
