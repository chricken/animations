'use strict';

import settings, { elements } from '../../../modules/settings.js';
import helpers, { RtA, rnd, lead0 } from '../../../modules/helpers.js';
import dom from '../../../modules/dom.js';
import noises, { Perlin } from '../../../modules/noises.js';
import ajax from '../../../modules/ajax.js';

let transform = [0, 0, 0];
let transformMove = [.4, .4, .7];
// let transformMove = [0, 0, 0];
let zoom = 700;
// let speedX = .5, speedY = 1, speedZ = 2;
let fileNo = 0;

const draw = {

    render() {

        settings.noise1.update();
        /*
        settings.noise2.render();
        settings.noise3.render();
        */

        requestAnimationFrame(render);

        /*
        ajax.saveCanvasToServer(c, `image_${lead0(fileNo, 6)}.png`).then(
            () => {
                fileNo++;
                requestAnimationFrame(render)
            }
        ).catch(
            console.warn
        )
        */


    }
}

export default draw;
export let render = draw.render;