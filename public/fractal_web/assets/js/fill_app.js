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
        classes: ['container', 'ui'],
        parent: elements.main,
    })

    // ZOOM
    components.range({
        parent: containerUI,
        legend: 'zoom R',
        min: 0,
        max: settings.zoom.r * 10,
        step:.1,
        value: settings.zoom.r,
        callback(evt) {
            settings.zoom.r = evt.target.value;
            draw.step();
        }
    })
    
    // ZOOM G
    components.range({
        parent: containerUI,
        legend: 'zoom G',
        min: 0,
        max: settings.zoom.g * 10,
        step:.1,
        value: settings.zoom.g,
        callback(evt) {
            settings.zoom.g = evt.target.value;
            draw.step();
        }
    })

    // Threshold R
    components.range({
        parent: containerUI,
        legend: 'Threshold R',
        min: -1,
        max: 1,
        step:.001,
        value: settings.threshold.r,
        callback(evt) {
            settings.threshold.r = evt.target.value;
            draw.step();
        }
    })

    // Threshold G
    components.range({
        parent: containerUI,
        legend: 'Threshold G',
        min: -1,
        max: 1,
        step:.001,
        value: settings.threshold.g,
        callback(evt) {
            settings.threshold.g= evt.target.value;
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