'use strict';

import settings, { elements } from '../../../modules/settings.js';
import fillApp from './fill_app.js';
import lStore from './localstorage.js';

const domMapping = () => {
    elements.main = document.body;
}

const init = () => {
    Object.assign(settings, {
        // Pfad, um Dateien zu speichern, Dazu muss saveFile auf 'true' stehen
        basePath: '../results/img',
        // Sollen die Ergebnisse als Datei gespeichert werden?
        // Dazu muss die Webseite über den eigenen Server geöffnet 
        saveFile: false,
        // Größe des zu rendernden Bildes
        cSize: {
            x: ~~(1920 / 20),
            y: ~~(1040 / 20),
        },
        additionInflux: 4,
        additionInvert: true,
        showNoiseMult: 100,
        noiseZoom: 60,
        dividerSimilarity: 1000,
        additionFilename: '',
        colorsFilename: '',
        numIterationsAtAll: ~~((600 * 300) / 300),
        additionToUse: 'fillAdditionTableNone',
        addNoise: 0,
        numBalls: 15,
        numSeeds: 3,
        additionsAvailable: [
            { text: 'None', value: 'fillAdditionTableNone' },
            { text: 'Sinus', value: 'fillAdditionTableSinus' },
            { text: 'Perlin', value: 'fillAdditionTablePerlin' },
            { text: 'Image', value: 'fillAdditionTableImg' },
            { text: 'Sinus Plane', value: 'fillAdditionTableSinPlane' },
            { text: 'Julia', value: 'fillAdditionTableJulia' },
            { text: 'Balls', value: 'fillAdditionTableBalls' }
        ]
    })
    lStore.loadSettings();
    domMapping();
    fillApp();
    // createRandom();
    // draw.init();

}

init();