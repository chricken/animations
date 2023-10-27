'use strict';

import settings, { elements } from '../../../modules/settings.js';
import fillApp from './fill_app.js';
import { rnd, lead0 } from '../../../modules/helpers.js';
import draw from './draw.js';

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

        lineWidth: 1,
        opacity: .1,

        maxFiles: 10800,

        lines : [],

        hue: 0,
        sat: 100,
        light: 50
    })
    domMapping();
    fillApp();
    draw.init();

}

init();