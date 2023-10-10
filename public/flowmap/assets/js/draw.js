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
        let c = elements.c;
        // console.log(settings.z);
        const perlin = new Perlin(settings.seedMap);

        let ctx = c.getContext('2d');
        settings.imgData = ctx.getImageData(0, 0, c.width, c.height);

        // Matrix verschieben
        transform = transform.map((val, index) => val + transformMove[index]);

        let data = settings.imgData.data;
        for (let i = 0; i < data.length; i += 4) {

            let x = ((i / 4) % settings.imgData.width);
            let y = Math.floor((i / 4) / settings.imgData.width);
            let z = 0;

            [x, y, z] = [x + transform[0], y + transform[1], z + transform[2]];
            [x, y, z] = [x / zoom, y / zoom, z / zoom];

            let valR = perlin.noise(x, y, z);
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
        ctx.putImageData(settings.imgData, 0, 0);

        // Punkte zeichnen
        elements.ctxLines.clearRect(
            0, 0,
            elements.cLines.width,
            elements.cLines.height
        )

        for (let i = 0; i < settings.points.length; i++) {
            let point = settings.points[i];
            point.update();
        }

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