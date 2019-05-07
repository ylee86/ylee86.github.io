// total range
let USED_RANGE = {min: 40, max: 84};

// vocal ranges
let SOPRANO = {min: 60, max: 84, range: 24};
let MEZZO = {min: 57, max: 81, range: 24};
let ALTO = {min: 53, max: 76, range: 23};
let TENOR = {min: 47, max: 69, range: 22};
let BARITONE = {min: 43, max: 65, range: 22};
let BASS = {min: 40, max: 64, range: 24};

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


function inVoiceRange(voice, val) {
    if (val<=voice.max && val>=voice.min) {
        return true;
    } else {
        return false;
    }
}

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