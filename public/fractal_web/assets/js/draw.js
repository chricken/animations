'use strict';

import settings, { elements } from '/modules/settings.js';
import helpers, { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';
import ajax from '/modules/ajax.js';

const draw = {
    step() {
        // Ein Bild rendern
        settings.counter++;
        let c = elements.c;
        let ctx = elements.ctx;

        ctx.clearRect(0, 0, elements.c.width, elements.c.height);

        // console.log(settings.z);
        const perlin = new Perlin(settings.perlin);

        let imgData = ctx.getImageData(0, 0, c.width, c.height);
        let data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {

            let x = ((i / 4) % imgData.width) + settings.pos.x;
            let y = Math.floor((i / 4) / imgData.width) + settings.pos.y;
            let z = settings.pos.z;
            console.log(x, y);
            [x, y, z] = [
                x / settings.zoom,
                y / settings.zoom,
                z / settings.zoom
            ];

            let val = perlin.noise(x, y, z);
            // val = (val + 1) / 2;

            // Wert (-1 -> 1) in (0 - 255) umwandeln
            val = (val + 1) * 128 - 1;

            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
            data[i + 3] = 255;
        }
        // console.log(imgData);
        ctx.putImageData(imgData, 0, 0);

        settings.pos.x += settings.speed.x;
        settings.pos.y += settings.speed.y;
        settings.pos.z += settings.speed.z;

        if (settings.animate) draw.animate();
    },
    deleteThisLater() {

        let zoom = 3;
        let speedX = .5, speedY = 1, speedZ = 2;

        let c = elements.c;
        // console.log(elements);
        // console.log(settings.z);
        const perlin = settings.perlin;
        console.log(perlin.noise(.1, 2.01, 3.01));

        let ctx = c.getContext('2d');
        let imgData = ctx.getImageData(0, 0, c.width, c.height);
        let data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {

            let x = ((i / 4) % imgData.width) + settings.pos.x;
            let y = Math.floor((i / 4) / imgData.width) + settings.pos.y;
            let z = settings.pos.z;

            // [x, y, z] = [x / settings.zoom, y / settings.zoom, z / settings.zoom];

            let valR = perlin.noise(
                x / settings.zoom.r,
                y / settings.zoom.r,
                z / settings.zoom.r
            );
            // console.log(perlin.noise(x, y, z));
            let valG = perlin.noise(...[
                x / settings.zoom.g,
                y / settings.zoom.g,
                z / settings.zoom.g
            ]);
            let valB = perlin.noise(...[
                x / settings.zoom.b,
                y / settings.zoom.b,
                z / settings.zoom.b
            ]);
            // Wert (-1 -> 1) in (0 - 255) umwandeln
            [valR, valG, valB] = [valR, valG, valB].map(val => (val + 1) * 128 - 1);

            data[i] = valR;
            data[i + 1] = valG;
            data[i + 2] = valB;
            data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);

        settings.x += speedX;
        settings.y += speedY;
        settings.z += speedZ;
    },

    animate() {
        // Speichern und rendervorgang erneuern
        settings.fileNo++;
        // console.clear();
        // console.log(settings.fileNo);
        if (settings.saveFile) {
            if (settings.fileNo < settings.maxFiles) {
                ajax.saveCanvasToServer(elements.c, `image_${lead0(settings.fileNo, 6)}.png`).then(
                    () => {
                        requestAnimationFrame(draw.step)
                    }
                ).catch(
                    console.warn
                )
            }
        } else {
            requestAnimationFrame(draw.step)
        }
    },
    init() {
        // Wird initial einmal aufgerufen
        settings.counter = 0;

        // draw.step();
        draw.deleteThisLater();
    }
}

export default draw;
export let render = draw.render;