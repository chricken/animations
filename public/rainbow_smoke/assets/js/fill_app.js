'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { create } from '../../../modules/dom.js';
import draw from './draw.js';
import components from './components.js';
import lStore from './localstorage.js';

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
    components.textbox({
        parent: containerUI,
        callback(evt) {
            settings.colorsFilename = evt.target.value
        },
        value: settings.colorsFilename,
        legend: 'URL zum Colortable Image'
    })
    /*
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
                lStore.saveSettings();
            })
            // Filereader aufrufen
            reader.readAsDataURL(file);
        }
    })
    */



    // Stärke Noise 
    components.range({
        parent: containerUI,
        legend: 'Add Noise (0-10)',
        min: 0,
        max: 10,
        step: .1,
        value: settings.addNoise,
        callback(evt) {
            settings.addNoise = +evt.target.value;
            lStore.saveSettings();
        }
    })

    // Anzahl der Seeds 
    components.range({
        parent: containerUI,
        legend: 'Num Seeds (1-~)',
        min: 1,
        max: 20,
        step: 1,
        value: settings.numSeeds,
        callback(evt) {
            settings.numSeeds = +evt.target.value;
            lStore.saveSettings();
        }
    })

    // Header zur Addition
    create({
        content: 'Addition',
        parent: containerUI,
        type: 'h3'
    })

    // Addition
    components.selectbox({
        parent: containerUI,
        legend: 'Type',
        callback(evt) {
            // console.log(elAuswahl.value);
            settings.additionToUse = evt.target.value;
            lStore.saveSettings();
        },
        options: settings.additionsAvailable,
        value: settings.additionToUse
    })

    // Einfluss der Addition 
    components.range({
        parent: containerUI,
        legend: 'Addition Influx (0-100)',
        min: 0,
        max: 100,
        step: 1,
        value: settings.additionInflux,
        callback(evt) {
            settings.additionInflux = +evt.target.value;
            lStore.saveSettings();
        }
    })

    // Addition Image
    components.textbox({
        parent: containerUI,
        callback(evt) {
            settings.additionFilename = evt.target.value
        },
        value: settings.additionFilename,
        legend: 'Filename Addition Image'
    })
    /*
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
                lStore.saveSettings();
            })
            // Filereader aufrufen
            reader.readAsDataURL(file);
        }
    })
    */

    // Anzahl der Bälle für Ball Addition 
    components.range({
        parent: containerUI,
        legend: 'Number of Balls (1-~)',
        min: 1,
        max: 20,
        step: 1,
        value: settings.numBalls,
        callback(evt) {
            settings.numBalls = +evt.target.value;
            lStore.saveSettings();
        }
    })

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

    // Button zum Abbrechen
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
        classes: ['container', 'preview']
    })
}

export default fillApp;