'use strict';

import settings, { elements } from '../../../modules/settings.js';
import fillApp from './fill_app.js';
import lStore from './localstorage.js';
import { rnd, lead0 } from '../../../modules/helpers.js';
import draw from './draw.js';
import components from './components.js';

const domMapping = () => {
    elements.main = document.body;
}

const init = () => {
    Object.assign(settings, {
        basePath: '../results/img',
        fileNo: 0,
        saveFile: false,
        cSize: {
            x: ~~(1920 / 3),
            y: ~~(1040 / 3),
        },
        numIterations: 5,
        lineWidth: .05,

        deltaPos: 2,
        deltaPosStartEnd: .001,

        hue:rnd(0,360),
        delta:rnd(0,100)/100,
        sat:50,
        light:50
    })
    domMapping();
    fillApp();
    // lStore.loadSettings()
    // createRandom();
    draw.init();

}

init();