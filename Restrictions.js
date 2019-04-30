
// global variables
let voiceCount = 3;
let maxDistance = 3;
let voices = [TENOR, ALTO, SOPRANO];
let motionLibrary = [];
let library = new ChordLibrary;
let tune = [];
let currentPosition = -1;
let arpSpeed = 20;
const CONSTANTS = {
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40
}


// add a chordType(array) to chordLibrary
// (this function will eventually be able to parse note letters, common chord type names, etc)
function addChordType(chordType) {
    library.push(chordType);
}


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
    
    // sortAndReduce all destinations
    const reducedDestinations = [];
    for (let i=0; i<quantity; i++) {
        reducedDestinations.push(sortAndReduce(allDestinations[i]));
    }
    
            //console.log(motionLibrary);
            //console.log("All destinations:");
            //console.log(allDestinations);
            //console.log("Reduced destinations:");
            //console.log(reducedDestinations);
    

    // compare sortAndReduced chords with chordLibrary; save indexes of valid destinations
    const validIndex = [];
    for (let i=0; i<quantity; i++) {
        const temporaryChord = reducedDestinations[i];
        if (library.contains(temporaryChord)) {
            validIndex.push(i);
        }
        
    }
            //console.log(validIndex);

    // calculate all validDestinations
    let validDestinations = [];
    for (let i=0; i<validIndex.length; i++){
        const index = validIndex[i];
        validDestinations.push(allDestinations[index]);
    }

        //console.log("Valid destinations: ");
        //console.log(validDestinations);

    // remove destinations that result in parallel octaves of fifths
    const temporaryArray = [];
    for (let i=0; i<validDestinations.length; i++) {
        if (!parallel58(chord, validDestinations[i])) {
            temporaryArray.push(validDestinations[i]);
            //console.log('checking for 58')
        }
    }
    validDestinations = temporaryArray;

    //sort and reduce validDestinations
    const reducedValidDestinations = [];
    for (let i=0; i<validDestinations.length; i++) {
        reducedValidDestinations.push(sortAndReduce(validDestinations[i]));
    }


        //console.log("Valid destinations: ");
        //console.log(validDestinations);
    
        //console.log("Reductions of valid destinations: ");
        //console.log(reducedValidDestinations);
    
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
        reducedChord.push((sortedChord[i]-sortedChord[0])%scaleSize);
    }
    return reducedChord;
}

// returns true if movement between two chords results in parallel Octaves or parallel Fifths
function parallel58(chord1, chord2) {
    const size = chord1.length;
    for (let i=0; i<size; i++) {
        for (let j=i+1; j<size; j++) {
            const interval1 = (chord1[j]-chord1[i])%scaleSize;
            const interval2 = (chord2[j]-chord2[i])%scaleSize;
            //console.log(`Interval 1: ${interval1}, Interval 2: ${interval2}, `)
            if (((interval1===OCTAVE && interval2===OCTAVE) || // parallel octaves OR
        (interval1===PFIFTH && interval2===PFIFTH)) // parallel fifths
         && chord1[i]!==chord2[i]) { // and movement has occurred
            //console.log(`Parallel motion for chord ${chord2}`);
            return true;
            }
        }
    }
    return false;
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
    console.log(event);
// arrow keys
    switch (event.keyCode) {
        case CONSTANTS.KEY_LEFT: // go back one chord 
            if (currentPosition < 0) {
                console.log('at beginning');
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
        //console.log(tune);
            currentPosition++;
            break;

        case CONSTANTS.KEY_UP:  // go to beginning of tune
            if (tune.length === 0) {
                console.log('no chords')
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
        console.log('nothing to play');
        return;
    } else {
        //console.log(`currentPosition: ${currentPosition}`);
        updateChordInfo();
        console.log(tune);
        /*for (let i=0; i<voiceCount; i++) {
            //tones.play(midiToFrequency(tune[currentPosition][i]));
        }*/
        arpeggiate(tune[currentPosition], 0, arpSpeed);
    }
}

function arpeggiate(chord, index, ms) {
    if (!index || index < chord.length) {
        setTimeout(function(){
          index = index ? index : 0;
          tones.play(midiToFrequency(chord[index]));
          index++;
          arpeggiate(chord, index, ms);
        }, ms)
    }
}

// communication with html file
const firstDiv = document.getElementById('CM7');
const saveDiv = document.getElementById('resettune');
const infoDiv = document.getElementById('chordinfo');
firstDiv.addEventListener('click', playCM7);
saveDiv.addEventListener('click', resetTune);
infoDiv.addEventListener('click', updateChordInfo);
document.addEventListener('keydown', play);

function setParameters(){
    selectChords();
    selectInstrument();
    selectSpeed();
    selectDistance();
    generateMotionLibrary();
    console.log(library);
}

function resetTune() {
    tune = [];
    currentPosition = -1;
    infoDiv.innerHTML = 'Tune has been reset!';
}

function updateChordInfo() {
    infoDiv.innerHTML = `Current tune position: ${currentPosition}. Current chord: ${tune[currentPosition]}.`

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

/*old shit
// tests
const library = new ChordLibrary();
library.addChord([0,4,7]);
library.addChord([0,3,7]);
library.addChord([0,3,6]);
library.addChord([0,4,10]);
library.addChord([0,3,10]);
//library.addChord([0,3,6]);
library.addInversions();
console.log(library);
generateMotionLibrary();
//console.log(motionLibrary);

const chord1 = firstChord();
//const chord2 = nextChord(chord1);
console.log("First chord: ")
console.log(chord1);
//console.log(chord2);


function testFun() {
    const chord1 = firstChord();
    const chord2 = nextChord(chord1);
    const c1 = [20, 23, 27];
    const c2 = [21, 24, 28];
    console.log(parallel58(c1, c2));
}


*/