'use strict';

import settings, { elements } from '/public/modules/settings.js';
import helpers, { rnd } from '/public/modules/helpers.js';
import dom, { create } from '/public/modules/dom.js';
import draw, { render } from './draw.js';
import Point from './classes/point.js';

const domMapping = () => {
    elements.main = document.body;
}

const createData = () => {
    settings.points = [];
    for (let x = 0; x < elements.cLines.width; x += settings.rasterSize) {
        for (let y = 0; y < elements.cLines.height; y += settings.rasterSize) {
            settings.points.push(new Point(x, y));
        }
    }
}

const fillApp = () => {

    elements.cLines = create({
        type: 'canvas',
        parent: elements.main,
        attr: {
            width: settings.canvasSize.width,
            height: settings.canvasSize.height
        },
        listeners: {
            click() {
                requestAnimationFrame(render);
            }
        }
    })

    elements.c = create({
        type: 'canvas',
        parent: elements.main,
        attr: {
            width: settings.canvasSize.width,
            height: settings.canvasSize.height
        }
    })

    elements.ctxLines = elements.cLines.getContext('2d');
}

const createRandom = () => {

    settings.seedMap = new Uint8Array([
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
    /*
    settings.x = 0;
    settings.y = 0;
    settings.z = 0;
    */

    settings.rasterSize = 5;

    settings.canvasSize = {
        width: 3840 / 5,
        height: 2160 / 5
    }
    settings.basePath = '../results/img';
    domMapping();
    fillApp();
    createData();
    // console.log(settings.points);
    createRandom();
    requestAnimationFrame(render);



}

init();