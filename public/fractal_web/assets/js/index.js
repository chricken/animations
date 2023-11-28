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

    Object.assign(settings, {
        basePath: '../results/img',
        fileNo: 0,
        maxFiles: 10800,
        saveFile: false,
        animate: true,
        perlin: new Perlin(settings.p),
        hue: 0,
        deltaHue: .1,
        numPoints: 1e4,
        cSize: {
            x: ~~(1920 / 4),
            y: ~~(1040 / 4),
        },
        zoom: {
            r: 10,
            g: 50,
            b: 35
        },
        threshold: {
            r: 0,
            g: .25,
            b: .25,
        },
        pos: {
            x: 1.1,
            y: 2.1,
            z: 1.1
        },
        speed: {
            x: .010,
            y: .010,
            z: .010
        }
    })

    console.log(settings.cSize);

    domMapping();
    fillApp();
    draw.init();

}

init();