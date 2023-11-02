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
            x: ~~(1920 / 1),
            y: ~~(1040 / 1),
        },

        lines: [],

        // Muss durch 2 teilbar sein, weil 2 SP je Bezierkurve
        numPoints: 1500,

        res: 10,    //Frames pro Line
        addX: 1,
        addZ:1/100,
        moveX: .00000,
        acc: 5, // Beschleunigung auf dem Weg nach unten

        maxFiles: 10800,

        hue: rnd(0, 360),
        deltaHue:10,
        sat: 100,
        light: 50
    })

    createRandom();

    domMapping();
    fillApp();
    // lStore.loadSettings()
    // createRandom();
    draw.init();

}

init();