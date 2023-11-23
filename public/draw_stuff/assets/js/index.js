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
        animate: false,
        cSize: {
            x: ~~(1920 / 2),
            y: ~~(1040 / 2),
        },
        maxLevel:4,
        numBranches:3,
        numRoots:5,
        rotation :.3,
        randomRotation:.3,
        scale:.3,
        offsetBranch:.2,
        size:250,
        startPos:[.5,.5],
    })

    domMapping();
    fillApp();
    draw.init();

}

init();