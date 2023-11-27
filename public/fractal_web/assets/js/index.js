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
        animate: false,
        perlin: new Perlin(settings.p),
        cSize: {
            x: ~~(1920 / 3),
            y: ~~(1040 / 3),
        },
        zoom: {
            r: 100,
            g: 200,
            b: 50
        },
        pos: {
            x: 1.1,
            y: 2.1,
            z: 1.1
        },
        speed: {
            x: .0,
            y: .0,
            z: 10
        }
    })

    console.log(settings.cSize);

    domMapping();
    fillApp();
    draw.init();

}

init();