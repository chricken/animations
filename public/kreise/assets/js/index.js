'use strict';

import settings, { elements } from '../../../modules/settings.js';
import fillApp from './fill_app.js';
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
            x: ~~(1920 / 1),
            y: ~~(1040 / 1),
        },

        curves: [],

        // Muss durch 2 teilbar sein, weil 2 SP je Bezierkurve
        numPoints: 40,

        numAttractors: 3,

        maxCurves: 30,
        numIterations: 30,
        lineWidth: 1,
        opacity: .1,

        maxFiles: 10800,

        deltaPos: 1,

        deltaPosStart: .1,
        deltaPosEnd: .1,

        fadeAfterFrames: 10,

        hue: rnd(0, 360),
        deltaHue: 1,
        sat: 100,
        light: 50
    })
    console.log(settings.deltaHue);
    domMapping();
    fillApp();
    // lStore.loadSettings()
    // createRandom();
    draw.init();

}

init();