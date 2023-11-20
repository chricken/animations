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
        saveFile: false,
        cSize: {
            x: ~~(1920 / 3),
            y: ~~(1040 / 3),
        },
        numPoints: 300,
    })

    domMapping();
    fillApp();
    draw.init();

}

init();