'use strict';

import settings, { elements } from './settings.js';



const helpers = {
    // Errechnet aus relativen Werten zwischen 0 und 1 die Absolute Position im Canvas
    relToAbs(x, y, c = elements.c) {
        return [x * c.width, y * c.height];
    },
    // Erzeugen einer zufälligen Nummer
    createNumber(min, max, dec = 0) {
        dec = 10 ** dec;
        if (min > max) [min, max] = [max, min];
        return ~~((Math.random() * (max - min + (1 / dec)) + min) * dec) / dec;
    },
    // Erzeugen einer zufälligen Farbe
    createColor({ minHue = 0, maxHue = 360, minSat = 70, maxSat = 80, minLight = 60, maxLight = 80, minAlpha = 1, maxAlpha = 1 }={}) {
        let rnd = helpers.createNumber;
        return `hsla(${rnd(minHue, maxHue)}, ${rnd(minSat, maxSat)}%, ${rnd(minLight, maxLight)}%, ${rnd(minAlpha * 100, maxAlpha * 100) / 100})`;
    },

    // Inhalt des Canvas in eine Datei schreiben
    writeCToFile(c = elements.c) {
        console.log(settings.path);
        let image = c.toDataURL('image/png');  // Wandelt das Canvas in eine Data URL um
        let a = document.createElement('a');        // Erstellt einen neuen Download-Link
    
        a.href = image;                             // Setzt den Link auf das Bild
        a.download = settings.path;             // Legt den Namen der heruntergeladenen Datei fest
        a.click();  
        
    },
    leadingZero(num, dec = 0) {
        let str = '0000000000';
        return (str + num).substr(-dec);

    }
}

export default helpers;
export let RtA = helpers.relToAbs;
export let rnd = helpers.createNumber;
export let saveC = helpers.writeCToFile;