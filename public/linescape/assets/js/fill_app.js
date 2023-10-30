'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { create } from '../../../modules/dom.js';
import draw from './draw.js';
import components from './components.js';

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