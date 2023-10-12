'use strict';

import settings, { elements } from '../../../modules/settings.js';
import { create } from '../../../modules/dom.js';
import draw from './draw.js';

const domMapping = () => {
    elements.main = document.body;
}

const fillApp = () => {
    elements.c = create({
        type: 'canvas',
        parent: elements.main,
        attr: {
            width: settings.cSize.x,
            height: settings.cSize.y
        }
    })
    elements.ctx = elements.c.getContext('2d');
}

const init = () => {
    settings.basePath = '../results/img';
    settings.saveFile = true;
    settings.cSize = {
        x: 600,
        y: 300,
    }
    domMapping();
    fillApp();
    // createRandom();
    draw.init();

}

init();