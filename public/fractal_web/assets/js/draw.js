'use strict';

import settings, { elements } from '/modules/settings.js';
import helpers, { rnd, lead0, clamp } from '/modules/helpers.js';
import noises, { Perlin } from '/modules/noises.js';
import ajax from '/modules/ajax.js';
import Point from './classes/point.js';

const draw = {

    step() {
        // Ein Bild rendern
        settings.counter++;

        let c = elements.c;
        const perlin = settings.perlin;

        let ctx = c.getContext('2d');
        // let imgData = ctx.getImageData(0, 0, c.width, c.height);
        // let data = imgData.data;

        for (let posY = 0; posY < settings.cSize.y; posY++) {
            for (let posX = 0; posX < settings.cSize.x; posX++) {

                let x = posX + settings.pos.x;
                let y = posY + settings.pos.y;
                let z = settings.pos.z;

                let valR = perlin.noise(
                    x / settings.cSize.x * settings.zoom.r,
                    y / settings.cSize.x * settings.zoom.r,
                    z / settings.cSize.x * settings.zoom.r
                );
                let valG = perlin.noise(...[
                    x / settings.cSize.x * settings.zoom.g,
                    y / settings.cSize.x * settings.zoom.g,
                    z / settings.cSize.x * settings.zoom.g
                ]);
                let valB = perlin.noise(...[
                    x / settings.cSize.x * settings.zoom.b,
                    y / settings.cSize.x * settings.zoom.b,
                    z / settings.cSize.x * settings.zoom.b
                ]);
                let val = valR > settings.threshold.r;
                val = val || (valR + valG > settings.threshold.g) ? 255 : 0;

                // console.log(settings.px, y, x);

                settings.px[posY][posX] = val;
                /* 
                data[i] = val;
                data[i + 1] = val;
                data[i + 2] = val;
                data[i + 3] = 255;
                 */
            }
        }
        // ctx.putImageData(imgData, 0, 0);

        ctx.clearRect(0, 0, settings.cSize.x, settings.cSize.y);

        for (let i = 0; i < settings.points.length; i++) {
            settings.points[i].render();
        }

        settings.pos.x += settings.speed.x;
        settings.pos.y += settings.speed.y;
        settings.pos.z += settings.speed.z;

        if (settings.animate) draw.animate();
    },

    animate() {
        // Speichern und rendervorgang erneuern
        settings.fileNo++;

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

        // Points zum Zeichnen
        settings.points = [...new Array(settings.numPoints)].map(
            () => new Point(
                rnd(0, settings.cSize.x),
                rnd(0, settings.cSize.y)
            )
        );

        // Zu Grunde liegende Pixel, um die Points zu steuern
        settings.px = [...new Array(settings.cSize.y)].map(() => {
            return [...new Array(settings.cSize.x)].map(() => 0)
        })

        // draw.step();
        draw.step();
    }
}

export default draw;
export let render = draw.render;