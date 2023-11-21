'use strict';

import settings, { elements } from '../../../modules/settings.js';
import fillApp from './fill_app.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';
import draw from './draw.js';

const domMapping = () => {
    elements.main = document.body;
}

const init = () => {
    Object.assign(settings, {
        basePath: '../results/img',
        fileNo: 0,
        maxFiles: 10800,
        saveFile: true,
        animate:true,
        cSize: {
            x: ~~(1920 / 1.5),
            y: ~~(1040 / 1.5),
        },
        numPoints: 100,
        numOrbiters: 50000,
        thresholdDistance: 30
    })

    domMapping();
    fillApp();
    draw.init();

}

init();