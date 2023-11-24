'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { create } from '../../../modules/dom.js';
import draw from './draw.js';
import components from './components.js';
import lStore from './localstorage.js';

const fillApp = () => {
    // Canvas zeichnen
    elements.containerCanvasDraw = create({
        parent: elements.main,
        classes: ['container']
    })

    components.renewCanvas()

    // UI füllen
    const containerUI = create({
        type: 'div',
        classes: ['container'],
        parent: elements.main,
    })

    // Schieber
    components.range({
        parent: containerUI,
        legend: 'Size',
        min: 1,
        max: settings.cSize.x,
        value: settings.size,
        callback(evt) {
            settings.size = evt.target.value;
            draw.step();
        }
    })

    // Linienbreite
    components.range({
        parent: containerUI,
        legend: 'Line Width',
        min: .2,
        max: settings.lineWidth*5,
        value: settings.lineWidth,
        callback(evt) {
            settings.lineWidth = evt.target.value;
            draw.step();
        }
    })

    // Maximale Iterationstiefe
    components.range({
        parent: containerUI,
        legend: 'maxLevel',
        min: 1,
        max: settings.maxLevel*3,
        value: settings.maxLevel,
        callback(evt) {
            settings.maxLevel = evt.target.value;
            draw.step();
        }
    })

    // Anzahl der Zweige
    components.range({
        parent: containerUI,
        legend: 'Num Branches',
        min: 1,
        max: settings.numBranches*3,
        value: settings.numBranches,
        callback(evt) {
            settings.numBranches = evt.target.value;            
            draw.step();
        }
    })


    // Linie
    create({
        parent: containerUI,
        type: 'hr'
    })

    // Button zum Rendern
    create({
        type: 'button',
        parent: containerUI,
        content: 'Render',
        listeners: {
            click() {
                settings.fileNo = 0;
                settings.cancel = false;
                draw.init();
            }
        }
    })

    // Button zum Abbrechen
    create({
        type: 'button',
        parent: containerUI,
        content: 'Step',
        listeners: {
            click() {
                draw.step()
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