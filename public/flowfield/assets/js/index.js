'use strict';

import settings, { elements } from '../../../modules/settings.js';
import fillApp from './fill_app.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';
import draw from './draw.js';

const domMapping = () => {
    elements.main = document.body;
}

const createRandom = () => {

    settings.p = new Uint8Array([
        ...[...new Array(6)].map(() => rnd(1, 254)),
        ...(() => {
            let p = [], i;
            for (i = 0; i < 256; i++) p[i] = i;
            for (i = 0; i < 255; i++) {
                let t, j = Math.floor((i + 1) * Math.random());
                t = p[j]; p[j] = p[j + 1]; p[j + 1] = t;
            }
            return p;
        })()]);
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
        
        noiseZoom: 70,
        numPoints:20000,
        posZ : 0.1,
        deltaZ : .3
    })

    domMapping();
    createRandom();
    fillApp();
    draw.init();

}

init();