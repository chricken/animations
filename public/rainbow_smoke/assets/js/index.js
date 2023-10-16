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
    components.inputFile({
        parent:containerUI,
        legend: 'Image Colortable',
        callback(){

        }
    })
   

    // Allgemeine Settings
    /*
    components.commonSettings(containerUI)
    
    // Addition Auswahlfeld
    const elAuswahl = create({
        type:'select',
        parent: containerUI,
        listeners:{
            change(){
                console.log(alAuswahl.value);

            }
        }
    })
    create({
        type:'option',
        parent:elAuswahl,
        content: 'Bitte wählen',
        attr:{
            value: 'none'
        }
    })

    settings.additionsAvailable.forEach(addition => {
        create({
            type:'option',
            parent:elAuswahl,
            content: addition,
            attr:{
                value: addition
            }
        })
    })

    // Container für die Einstellungen
    const containerAdditionSettings = create({
        parent: containerUI,
        type:'div',
        className: 'container'
    })
    */

    // Button zum Rendern
    create({
        type:'button',
        parent:containerUI,
        content: 'Render',
        listeners:{
            click(){
                settings.cancel = false;
                draw.init();
            }
        }
    })
    create({
        type:'button',
        parent:containerUI,
        content: 'Cancel',
        listeners:{
            click(){
                settings.cancel = true;
            }
        }
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
            x: ~~(1920 / 4),
            y: ~~(1040 / 4),
        },
        additionInflux: 10,
        additionInvert: true,
        showNoiseMult: 100,
        noiseZoom: 60,
        dividerSimilarity: 1000,
        additionFilename: 'Apophysis-2.png',
        colorFilename: '041002_174545.jpg',
        numIterationsAtAll: 10,
        additionToUse: 'fillAdditionTableImg',
        addNoise: 0,
        numBalls: 15,
        numSeeds: 3,
        additionsAvailable: [
            'fillAdditionTableSinus',
            'fillAdditionTablePerlin',
            'fillAdditionTableImg',
            'fillAdditionTableSinPlane',
            'fillAdditionTableJulia',
            'fillAdditionTableBalls'
        ]
    })
    domMapping();
    fillApp();
    // createRandom();
    // draw.init();

}

init();