'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { create } from '../../../modules/dom.js';
import draw from './draw.js';
import components from './components.js';

const domMapping = () => {
    elements.main = document.body;
}

const fillApp = () => {
    // Canvas zeichnen
    elements.c = create({
        type: 'canvas',
        parent: elements.main,
        attr: {
            width: settings.cSize.x,
            height: settings.cSize.y
        }
    })
    elements.ctx = elements.c.getContext('2d');

    // UI füllen
    const containerUI = create({
        type: 'div',
        classes: ['container'],
        parent: elements.main,
    })

    // Colortable Image
    const [inputFile] = components.inputFile({
        parent: containerUI,
        legend: 'Image for Colortable',
        callback() {
            const file = inputFile.files[0];
            const reader = new FileReader();

            reader.addEventListener('load', event => {
                settings.colorFileContent = new Image();
                settings.colorFileContent.addEventListener('load', () => {
                    // console.log(settings.colorFileContent);
                });
                settings.colorFileContent.src = event.target.result;
            })
            // Filereader aufrufen
            reader.readAsDataURL(file);
        }
    })

    // Addition Image
    const [inputAdditionFile] = components.inputFile({
        parent: containerUI,
        legend: 'Image for Additiontable',
        callback() {
            console.log(inputAdditionFile.files[0]);

            const file = inputAdditionFile.files[0];
            const reader = new FileReader();

            reader.addEventListener('load', event => {
                // console.log('Reader', event);
                settings.additionFileContent = new Image();
                settings.additionFileContent.addEventListener('load', () => {
                    // console.log(settings.additionFileContent);
                });
                settings.additionFileContent.src = event.target.result;
            })
            // Filereader aufrufen
            reader.readAsDataURL(file);
        }
    })


    // Allgemeine Settings
    // components.commonSettings(containerUI)

    // Addition Auswahlfeld
    const containerSelect = create({
        parent: containerUI
    })

    create({
        type:'span',
        content: 'Addition to use',
        parent: containerSelect
    })

    const elAuswahl = create({
        type: 'select',
        parent: containerSelect,
        attr:{
            value:settings.additionToUse
        },
        listeners: {
            change() {
                console.log(elAuswahl.value);
                settings.additionToUse = elAuswahl.value;
            }
        }
    })
    create({
        type: 'option',
        parent: elAuswahl,
        content: 'Bitte wählen',
        attr: {
            value: 'none'
        }
    })

    settings.additionsAvailable.forEach(addition => {
        create({
            type: 'option',
            parent: elAuswahl,
            content: addition.text,
            attr: {
                value: addition.value
            }
        })
    })

    // Noise einstellen
    components.range({
        parent:containerUI,
        legend: 'Add Noise',
        min:0,
        max:10,
        step:.1,
        value: settings.addNoise,
        callback(evt){
            settings.addNoise = +evt.target.value;
        }
    })
    elAuswahl.value = settings.additionToUse;

    // Anzahl der Seeds einstellen
    components.range({
        parent:containerUI,
        legend: 'Num Seeds',
        min:0,
        max:20,
        step:1,
        value: settings.numSeeds,
        callback(evt){
            settings.numSeeds = +evt.target.value;
        }
    })
    elAuswahl.value = settings.additionToUse;

    /*
    // Container für die Einstellungen
    const containerAdditionSettings = create({
        parent: containerUI,
        type:'div',
        className: 'container'
    })
    */

    // Button zum Rendern
    create({
        type: 'button',
        parent: containerUI,
        content: 'Render',
        listeners: {
            click() {
                settings.cancel = false;
                draw.init();
            }
        }
    })
    create({
        type: 'button',
        parent: containerUI,
        content: 'Cancel',
        listeners: {
            click() {
                settings.cancel = true;
            }
        }
    })

    // Container for Previews
    elements.containerPreview = create({
        parent: containerUI,
        classes:['container', 'preview']
    })
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
            x: ~~(1920 / 3),
            y: ~~(1040 / 3),
        },
        additionInflux: 4,
        additionInvert: true,
        showNoiseMult: 100,
        noiseZoom: 60,
        dividerSimilarity: 1000,
        additionFilename: false,
        colorFilename: false,
        numIterationsAtAll: ~~((600*300)/300),
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
    domMapping();
    fillApp();
    // createRandom();
    // draw.init();

}

init();