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
        saveFile: true,
        cSize: {
            x: ~~(1920 / 1),
            y: ~~(1040 / 1),
        },

        curves: [],

        // Muss durch 2 teilbar sein, weil 2 SP je Bezierkurve
        numPoints: 6,
        numAttractors: 3,

        maxCurves: 500,
        numIterations: 50,
        lineWidth: 1,

        maxFiles: 10800,

        deltaPos: 1,
        deltaPosStartEnd: 1,

        hue: rnd(0, 360),
        deltaHue: rnd(0, 300) / 100,
        sat: 100,
        light: 50
    })
    domMapping();
    fillApp();
    // lStore.loadSettings()
    // createRandom();
    draw.init();

}

init();