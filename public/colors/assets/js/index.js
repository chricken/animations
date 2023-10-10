'use strict';

import settings, { elements } from '/public/modules/settings.js';
import helpers, { rnd } from '/public/modules/helpers.js';
import dom, { create } from '/public/modules/dom.js';
import draw, { render } from './draw.js';
import Noise from './classes/noise.js';

const domMapping = () => {
    elements.main = document.body;
}


const fillApp = () => {
    settings.noise1 = new Noise();
    settings.noise1.init();
    /*
    settings.noise2 = new Noise();
    settings.noise2.init();
    
    settings.noise3 = new Noise();
    settings.noise3.init();
    */
    
}

const init = () => {

    settings.canvasSize = {
        width: 3840 / 5,
        height: 2160 / 5
    }
    settings.basePath = '../results/img';
    domMapping();
    fillApp();
    requestAnimationFrame(render);

}

init();