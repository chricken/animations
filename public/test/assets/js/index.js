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
            width: 800,
            height: 500
        }
    })
}


const init = () => {
    settings.basePath = '../results/img';
    domMapping();
    fillApp();
    render();

}

init();