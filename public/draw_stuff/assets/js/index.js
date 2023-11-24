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
        lineWidth: 5,
        maxLevel: 3,
        numBranches:4,
        branchDistance:5,
        numRoots: 3,
        rootDistance: [0, 0],
        rotation: .5,
        rotationMod:8.8,
        randomRotation: .0,
        scale: .2,
        offsetBranch: .4,
        size: 200,
        startPos: [.2, .5],
    })

    domMapping();
    fillApp();
    draw.init();

}

init();