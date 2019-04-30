// MIDI limits
const MIDI_RANGE = {min: 0, max: 127};

// total range
let USED_RANGE = {min: 40, max: 84};

// vocal ranges
let SOPRANO = {min: 60, max: 84, range: 24};
let MEZZO = {min: 57, max: 81, range: 24};
let ALTO = {min: 53, max: 76, range: 23};
let TENOR = {min: 47, max: 69, range: 22};
let BARITONE = {min: 43, max: 65, range: 22};
let BASS = {min: 40, max: 64, range: 24};

// relevant intervals
let OCTAVE = 12;
let PFIFTH = 7;

// scale
let scale = [0,1,2,3,4,5,6,7,8,9,10,11];
let scaleSize = scale.length;

/*
let SOPRANO = {min: 'C4', max: 'C6'};
let MEZZO = {min: 'A3', max: 'A5'};
let ALTO = {min: 'F3', max: 'E5'};
let TENOR = {min: 'B2', max: 'A4'};
let BARITONE = {min: 'G2', max: 'F4'};
let BASS = {min: 'E2', max: 'E4'};
*/

function setRange(min, max) {
    USED_RANGE.min = min;
    USED_RANGE.max = max;
}

function setScale(notes) {
    scale = notes;
    scaleSize = scale.length;
}

/*
function inVoiceRange(voice, val) {
    if (val<=voice.max && val>=voice.min) {
        return true;
    } else {
        return false;
    }
}
*/

function belowVoiceRange(voice, val) {
    if (val<=voice.min) {
        return true;
    }
    else return false;
}

function aboveVoiceRange(voice, val) {
    if (val>=voice.max) {
        return true;
    }
    else return false;
}

function midiToFrequency(midiVal) {
    const freq = 440*Math.pow(1.059463,(midiVal-69));
    return freq;
}