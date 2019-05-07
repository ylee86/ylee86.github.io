
// global variables
let voiceCount = 3;
let maxDistance = 1;
let voices = [TENOR, ALTO, SOPRANO];
let motionLibrary = [];
let library = new ChordLibrary;
let tune = [];
let currentPosition = -1;
let arpSpeed = 20;

// select a random chordType from chordLibrary and generate a chordInstance with a random bass note
function firstChord() {
    const chord = [];
    const randomChord = library.randomChord(); // random chord and inversion from library
            //console.log(`randomChord: ${randomChord}`);
    const firstNote = voices[0].min + Math.floor(Math.random()*voices[0].range); // assign first note of chord
    chord.push(firstNote);
    for (let i=1; i<voiceCount; i++) { // assign remaining notes of chord
        const initialEstimate = voices[i].min + Math.floor(Math.random()*voices[i].range);
        const displacement = (firstNote%scaleSize)-(initialEstimate%scaleSize)+randomChord[i];
        let val = initialEstimate+displacement;
        if (belowVoiceRange(voices[i], val)) {
            val += scaleSize;
        } else if (aboveVoiceRange(voices[i], val)) {
            val -= scaleSize;
        }
        chord.push(val);
    }
            //console.log("First chord: ")
            //console.log(chord);
    return chord;  
}

function firstChord1() {
    return [51,61,73];
}

// given a chord, returns a valid next chord (compliant with ChordLibrary and voice leading)
function nextChord(chord) {
    // calculate all possible destinations with maximum voice leading distance allowed
    const allDestinations = [];
    const quantity = motionLibrary.length;
    for (let i=0; i<quantity; i++) {
        const oneDestination = [];
        for (let j=0; j<chord.length; j++){
            oneDestination.push(chord[j] + motionLibrary[i][j]);
        }
        allDestinations.push(oneDestination);
    }

        //  console.log('all destinations:');
        //  console.log(allDestinations);

    // remove invalid destinations!
    let validDestinations = removeInvalidChordTypes(allDestinations);
    validDestinations = removeNonDiatonicChords(validDestinations);
    validDestinations = removeParallels(chord, validDestinations);
    validDestinations = removeOutOfRangeChords(validDestinations);
          console.log('remaining chords are valid:')
          console.log(validDestinations);

    //sort and reduce validDestinations
    const reducedValidDestinations = [];
    for (let i=0; i<validDestinations.length; i++) {
        reducedValidDestinations.push(sortAndReduce(validDestinations[i]));
    }

    // return a random validChord
    const randomIndex = Math.floor(Math.random()*validDestinations.length);
    const nextChord = validDestinations[randomIndex];
        //console.log("Next chord: ")
        //console.log(nextChord);
    return nextChord;
}

// sorts chord voices in ascending order, then reduces to chord type
// Example: [60,67,64] --> [60,64,67] --> [0,4,7]
function sortAndReduce(chord) { 
    const sortedChord = chord.sort(function(a,b) {
        return a-b;
    })
    const reducedChord = [];
    for (let i=0; i<chord.length; i++){
        reducedChord.push((sortedChord[i]-sortedChord[0])%CONSTANTS.PERFECT_OCTAVE);
    }
    return reducedChord;
}

// takes an array of chords; removes chords that are not within chordLibrary
function removeInvalidChordTypes(originalChords) {

    // return indexes of valid chords
    const validIndex = [];
    let validChords = [];
    const invalidChords = [];
    for (let i=0; i<originalChords.length; i++) {
        const chord = sortAndReduce(originalChords[i]);
        if (library.contains(chord)) {
            validIndex.push(i);
                //console.log('valid chord type: ');
                //console.log(chord);
        } else {
            invalidChords.push(originalChords[i]);
                //console.log('invalid chord type: ');
                //console.log(chord);
        }
    }
    // create an return new array of valid chords
    
    for (let i=0; i<validIndex.length; i++){
        const index = validIndex[i];
        validChords.push(originalChords[index]);
    }
          console.log('removed invalid chord types:')
          console.log(invalidChords);
    return validChords;
}

// takes an array of chords; removes non-diatonic chords
function removeNonDiatonicChords(originalChords) {
    const validChords = [];
    const invalidChords = [];
    for (let i=0; i<originalChords.length; i++) {    // for each chord
        let allNotesDiatonic = true;
        for (let j=0; j <voiceCount; j++) {    // for each voice
            const note = originalChords[i][j];
            if (!scaleLookup.includes(note)) {
                allNotesDiatonic = false;
                invalidChords.push(originalChords[i]);
                break;
            }
        }
        if (allNotesDiatonic) {
            validChords.push(originalChords[i]);
        }
    }
          console.log('removed nondiatonic chords:')
          console.log(invalidChords);
    return validChords;
}

// takes a chord and an array of destinations; removes destinations that would result in //P8 or //P5
function removeParallels(chord, originalChords) {
    const validChords = [];
    const invalidChords = [];
    for (let i=0; i<originalChords.length; i++) {   // for each chord
        if (!parallel58(chord, originalChords[i])) {
            validChords.push(originalChords[i]);
        } else {
            invalidChords.push(originalChords[i]);
        }
    }
        //  console.log('removed chords resulting in parallel motion:')
        //  console.log(invalidChords);
    return validChords;
}

// returns true if movement between two chords results in //P8 or //P5 //PU
function parallel58(chord1, chord2) {
    const size = chord1.length;
    for (let i=0; i<size; i++) {
        for (let j=i+1; j<size; j++) {
            const interval1 = (chord1[j]-chord1[i])%CONSTANTS.PERFECT_OCTAVE;
            const interval2 = (chord2[j]-chord2[i])%CONSTANTS.PERFECT_OCTAVE;
            if (((interval1===CONSTANTS.PERFECT_UNISON && interval2===CONSTANTS.PERFECT_UNISON) || // parallel octaves/unison OR
        (interval1===CONSTANTS.PERFECT_FIFTH && interval2===CONSTANTS.PERFECT_FIFTH)) // parallel fifths
         && chord1[i]!==chord2[i]) { // and movement has occurred
            return true;
            }
        }
    }
    return false;
}

// takes an array of chords; removes destinations that are out of voice range
function removeOutOfRangeChords(originalChords) {
    const validChords = [];
    const invalidChords = [];
    for (let i=0; i<originalChords.length; i++) {    // for each chord
        let allVoicesInRange = true;
        for (let j=0; j <voiceCount; j++) {    // for each voice
            const note = originalChords[i][j];
            if (!inVoiceRange(voices[j], note)) {
                allVoicesInRange = false;
                invalidChords.push(originalChords[i]);
                break;
            }
        }
        if (allVoicesInRange) {
            validChords.push(originalChords[i]);
        }
    }
          console.log('removed out of range chords:')
          console.log(invalidChords);
    return validChords;
}

// calculate all possible permutations to move a maximum of distance
function generateMotionLibrary() { 
    const range = maxDistance*2+1;
    const size = voiceCount;
    const everyMove = [];
    const quantity = Math.pow(range,size);
    for (let i=0; i<quantity; i++) {
        const singleMove = [];
        for (let j=0; j<size; j++) {
            const val = (Math.floor(i/Math.pow(range,j))%range)-maxDistance; // SO STUPID!!!
            singleMove.push(val);
        }
        everyMove.push(singleMove);
    }
    motionLibrary = everyMove;
}

function playCM7() {
    const chord = [48,52,67,71];
    arpeggiate(chord,0,200);
}

function play(event) {
// arrow keys
    switch (event.keyCode) {
        case CONSTANTS.KEY_LEFT: // go back one chord 
            if (currentPosition < 0) {
            } else {
                currentPosition--;
            }
            break;

        case CONSTANTS.KEY_RIGHT:   // go right one chord
        setParameters();
            if (tune.length === 0) {    // if tune is empty, create first chord
                console.log('empty chord; creating first chord');
                tune.push(firstChord());
            }
            else if (currentPosition === tune.length-1) {   // if at end of tune, create next chord
                tune.push(nextChord(tune[currentPosition]));
            }
            currentPosition++;
            break;

        case CONSTANTS.KEY_UP:  // go to beginning of tune
            if (tune.length === 0) {
            } else {
                currentPosition = 0;
            }
            break;

        case CONSTANTS.KEY_DOWN:    // go to end of tune
            if (tune.length !== 0) {
                currentPosition = tune.length-1;
            }
            break;
    }
    
    // play the chord    
    if (currentPosition < 0) {
        return;
    } else {
        updateChordInfo();
        console.log(tune);
        arpeggiate(tune[currentPosition], 0, arpSpeed);
    }
}

// plays the chord arpeggiated
function arpeggiate(chord, index, ms) {
    if (!index || index < chord.length) {
        setTimeout(function(){
            index = index ? index : 0;
            const midiVal = chord[index];
            tones.play(CONSTANTS.MIDI_FREQUENCIES[midiVal]);
            index++;
            arpeggiate(chord, index, ms);
        }, ms)
    }
}

// initialization functions
function setVoiceCount(number) {
    voiceCount = number;
}

function setMaxDistance(number) {
    maxDistance = number;
}

function setVoiceRange(voice, minVal, maxVal) {
    voices[voice] = {min: minVal, max: maxVal};
}
function setParameters(){
    selectChords();
    selectInstrument();
    selectSpeed();
    selectDistance();
    generateMotionLibrary();
}

function resetTune() {
    tune = [];
    currentPosition = -1;
    infoDiv.innerHTML = 'Tune has been reset!';
}

function updateChordInfo() {
    chordNotes = [];
    for (let i = 0; i<voiceCount; i++) {
        chordNotes.push(CONSTANTS.MIDI_PITCHES[tune[currentPosition][i]]);
    }
    infoDiv.innerHTML = `Current tune position: ${currentPosition}. Current chord: ${chordNotes}.`;

}

function selectChords() {
    library.removeAll();
    if (document.getElementById('majtriad').checked) {
        library.addChord([0,4,7]);
    }
    if (document.getElementById('mintriad').checked) {
        library.addChord([0,3,7]);
    }
    if (document.getElementById('dimtriad').checked) {
        library.addChord([0,3,6]);
    }
    if (document.getElementById('augtriad').checked) {
        library.addChord([0,4,8]);
    }
    library.addInversions();
}

function selectInstrument() {
    if (document.getElementById('square').checked) {
        tones.type = "square";
    }
    else if (document.getElementById('triangle').checked) {
        tones.type = "triangle";
    }
    else if (document.getElementById('sawtooth').checked) {
        tones.type = "sawtooth";
    }
    else {
        tones.type = "sine";
    }
}

function selectSpeed() {
    const speed = document.getElementById('speed').value;
    arpSpeed = parseInt(speed);
}

function selectDistance() {
    const distance = document.getElementById('distance').value;
    maxDistance = parseInt(distance);  
}

// communication with html file
const firstDiv = document.getElementById('CM7');
const saveDiv = document.getElementById('resettune');
const infoDiv = document.getElementById('chordinfo');
firstDiv.addEventListener('click', playCM7);
saveDiv.addEventListener('click', resetTune);
infoDiv.addEventListener('click', updateChordInfo);
document.addEventListener('keydown', play);