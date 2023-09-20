'use strict';

import settings, { elements } from '../../../modules/settings.js';
import helpers, { rnd } from '../../../modules/helpers.js';
import dom, { create } from '../../../modules/dom.js';
import draw, { render } from './draw.js';

const domMapping = () => {
    elements.main = document.body;
}

const fillApp = () => {
    elements.c = create({
        type: 'canvas',
        parent: elements.main,
        attr: {
            width: 3840 / 4,
            height: 2160 / 4
        }
    })

    // Zoom
    create({
        type: 'input',
        attr: {
            type: 'range',
            value: settings.zoom*1000,
            min: 1,
            max: 3000,
            steps: 1,
        },
        parent: elements.main,
        listeners: {
            input(evt) {
                settings.zoom = +evt.target.value / 1000;
                render();
            }
        }
    })
    // posX
    create({
        type: 'input',
        attr: {
            type: 'range',
            value: settings.posX*1000,
            min: -1000,
            max: 3000,
            steps: 1,
        },
        parent: elements.main,
        listeners: {
            input(evt) {
                settings.posX = +evt.target.value / 1000;
                render();
            }
        }
    })
    // posY
    create({
        type: 'input',
        attr: {
            type: 'range',
            value: settings.posY*1000,
            min: -1000,
            max: 3000,
            steps: 1,
        },
        parent: elements.main,
        listeners: {
            input(evt) {
                settings.posY = +evt.target.value / 1000;
                render();
            }
        }
    })
}



const init = () => {

    domMapping();
    fillApp();

    settings.proportions = elements.c.height / elements.c.width;
    settings.zoom = 3;
    settings.posX = 2
    settings.posY = 1

    render();

}

init();