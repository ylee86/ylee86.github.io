const SCALES = {
    //arrow keys
    MAJOR: [0,2,4,5,7,9,11],
    MINOR_NAT: [0,2,3,5,7,8,10],
    MINOR_HAR: [0,2,3,5,7,8,11],
    MINOR_MEL: [0,2,3,5,7,9,11],
    PENTATONIC: [0,2,4,7,9],
    OCTATONIC: [0,2,3,5,6,8,9,11],
    WHOLETONE: [0,2,4,6,8,10]
}


let scale = [0,1,2,3,4,5,6,7,8,9,10,11];
let root = 0;
let scaleLookup = [];

function setScale(notes) {
    scale = notes;
    scaleSize = scale.length;
}

function createScaleLookup() {
    for (let i = CONSTANTS.MIDI_MIN; i < CONSTANTS.MIDI_MAX; i++) {
        if (scale.includes(i%CONSTANTS.PERFECT_OCTAVE)) {
            scaleLookup.push(i);
        }
    }
}

// test
setScale(SCALES.MINOR_NAT);
createScaleLookup();
    console.log(scaleLookup);

tempArray = [];
for (let i = 0; i<scaleLookup.length; i++) {
    midiVal = scaleLookup[i]
    tempArray.push(CONSTANTS.MIDI_PITCHES[midiVal]);
}
    //console.log(tempArray);

const testDiv = document.getElementById('temporary');
testDiv.addEventListener('click', scaleTest1);

//
let tune1 = [];

function scaleTest1() {
    let chord;
    if (tune1.length === 0) {
        chord = createFirstChord();
    } else {
        chord = createNextChord();
    }
    console.log(chord);
    arpeggiate(chord,0,100);
    tune1.push(chord);
}

function createFirstChord() {
    let chord = [];
    for (let i = 0; i < voiceCount; i++) {
        let note = voices[i].min + Math.floor(Math.random()*voices[i].range); // select random value in voice range
        while (!scaleLookup.includes(note)) {  // increment firstNote until it returns a value within the scale
            note++;
        }
        chord.push(note);
    }
    return chord;
}

function createNextChord() {
    let chord = [];
    for (let i = 0; i < voiceCount; i++) { // calculate all possible moves for this voice
        const possibleMoves = [];
        previousNote = tune1[tune1.length-1][i];
        for (let j = -maxDistance; j <= maxDistance; j++) {
            possibleMoves.push(previousNote+j);
        }
        //console.log(possibleMoves);
        const tempArray = [];
        for (let j = 0; j < possibleMoves.length; j++) {
            if (scaleLookup.includes(possibleMoves[j])) {
                tempArray.push(possibleMoves[j]);
            }
        }
        //console.log(tempArray);
        const randomIndex = Math.floor(Math.random()*tempArray.length);
        //console.log(randomIndex);
        chord.push(tempArray[randomIndex]);
    }
    return chord;
}