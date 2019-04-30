class ChordLibrary {
    constructor() {
        this._chords = [];
        this._lookup = [];
    }

    get chords() {
        return this._chords;
    }

    get library() {
        return this._lookup;
    }

    addChord(chord) {
        this._chords.push(chord);
    }

    addInversions() {
        if (this._chords.length === 0) {return} // return if library is size 0
        if (this._chords[0].length === 0) {return} // return if chord is size 0
        for (let i=0; i<this._chords.length; i++) { // for every chord in the library
            const chord = this._chords[i];
            for (let degree=0; degree<chord.length; degree++) { // for each inversion
                const inversion = [];
                for (let voice=0; voice<chord.length; voice++) { // for each voice
                    const val = mod(chord[(degree+voice)%chord.length]-chord[degree], scaleSize);
                    inversion.push(val);
                }
                this._lookup.push(inversion);
            }
            
        }
    }

    randomChord() {
        const librarySize = this._lookup.length;
        const randomIndex = Math.floor(Math.random() * librarySize);
        return this._lookup[randomIndex];
    }

    contains(chord) { // checks if library contains chord
                //console.log(`size = ${librarySize}`);
                //console.log(`chordLength = ${chordLength}`);
        for (let i=0; i<this._lookup.length; i++) { // iterate over each chord in the library
            if (chord.join('') === this._lookup[i].join('')) {  
            return true;
            }
        }

    }

    removeAll() {
        this._chords = [];
        this._lookup = [];
    }

}

function mod(x,y) { //helper: modulo for negative numbers
    return ((x%y) + y) % y;
}
/*
const chordLibrary = new ChordLibrary();
chordLibrary.addChord([0,4,7]);
chordLibrary.addChord([0,3,7]);
chordLibrary.addInversions();
const aChord = chordLibrary.randomChord();

console.log(chordLibrary);
console.log(aChord);
*/