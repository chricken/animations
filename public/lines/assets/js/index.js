'use strict';

import settings, { elements } from '../../../modules/settings.js';
import helpers, { rnd } from '../../../modules/helpers.js';
import dom, { create } from '../../../modules/dom.js';
import draw, { render } from './draw.js';

const domMapping = () => {
    elements.main = document.body;
}

const fillApp = () => {
    elements.c = create({
        type: 'canvas',
        parent: elements.main,
        attr: {
            width:  3840/2,
            height: 2160/2
        }
    })
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

    settings.x = 0;
    settings.y = 0;
    settings.z = 0;
    settings.basePath = '../results/img';
    domMapping();
    fillApp();
    createRandom();
    requestAnimationFrame(render);

    

}

init();