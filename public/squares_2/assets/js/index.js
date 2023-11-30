'use strict';

import settings, { elements } from '../../../modules/settings.js';
import fillApp from './fill_app.js';
import { rnd, lead0, clamp } from '/modules/helpers.js';
import draw from './draw.js';
import noises, { Perlin } from '/modules/noises.js';

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
        })()
    ]);

}

const init = () => {
    createRandom();

    let divisorRes = 1.5;

    Object.assign(settings, {
        basePath: '../results/img',
        fileNo: 0,
        maxFiles: 10800,
        saveFile: false,
        animate: true,
        perlin: new Perlin(settings.p),
        hue: 0,
        deltaHue: .03,
        cSize: {
            x: ~~(1920 / divisorRes),
            y: ~~(1040 / divisorRes),
        },
        posX: 0,
        posY: 0,
        speedX: 2,
        speedY: 2,
        numSquares: 40
    })

    settings.squareSize = settings.cSize.x / settings.numSquares;

    console.log(settings.squareSize);

    domMapping();
    fillApp();
    draw.init();

}

init();