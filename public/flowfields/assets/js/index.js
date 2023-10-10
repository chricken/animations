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
            width: 3840 / 2,
            height: 2160 / 2
        }
    })
    elements.ctx = elements.c.getContext('2d');
}



const init = () => {
    settings.numPoints = 3000;
    settings.threshold = 100;
    settings.maxAbweichung = 10;
    settings.numAttractors = 3;
    settings.basePath = '../results/img';
    settings.animate = true;
    settings.saveFile = true;
    domMapping();
    fillApp();
    // createRandom();
    draw.init();

}

init();