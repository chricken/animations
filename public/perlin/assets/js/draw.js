'use strict';

import settings, { elements } from '../../../modules/settings.js';
import helpers, { RtA, rnd, lead0 } from '../../../modules/helpers.js';
import dom from '../../../modules/dom.js';
import noises, { Perlin } from '../../../modules/noises.js';
import ajax from '../../../modules/ajax.js';

let zoom = 100;
let speedX = .5, speedY = 1, speedZ = 2;
let fileNo = 0;

const draw = {

    render() {
        let c = elements.c;
        // console.log(settings.z);
        const perlin = new Perlin(settings.p);

        let ctx = c.getContext('2d');
        let imgData = ctx.getImageData(0, 0, c.width, c.height);
        let data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            let x = ((i / 4) % imgData.width) + settings.x;
            let y = Math.floor((i / 4) / imgData.width) + settings.y;
            let z = settings.z;
            [x, y, z] = [x / zoom, y / zoom, z / zoom];
            let valR = perlin.noise(x, y, z);
            // console.log(perlin.noise(x, y, z));
            let valG = perlin.noise(x * .5, y, z);
            let valB = perlin.noise(y, x, z);
            // Wert (-1 -> 1) in (0 - 255) umwandeln
            [valR, valG, valB] = [valR, valG, valB].map(val => (val + 1) * 128 - 1);
            data[i] = valR;
            data[i + 1] = valG;
            data[i + 2] = valB;
            data[i + 3] = 255;
        }
        // console.log(imgData);
        ctx.putImageData(imgData, 0, 0);

        settings.x += speedX;
        settings.y += speedY;
        settings.z += speedZ;

        ajax.saveCanvasToServer(c, `image_${lead0(fileNo, 6)}.png`).then(
            () => {
                fileNo++;
                requestAnimationFrame(render)
            }
        ).catch(
            console.warn
        )


    }
}

export default draw;
export let render = draw.render;