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
            x: ~~(1920 / 2),
            y: ~~(1040 / 2),
        },

        lines: [],

        // Muss durch 2 teilbar sein, weil 2 SP je Bezierkurve
        numPoints: 120,

        numLines: 30,

        lineWidth: .4,

        maxFiles: 10800,

        hue: rnd(0, 360),
        deltaHue:1 ,
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